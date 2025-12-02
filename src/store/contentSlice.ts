import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { contentAPI } from '../lib/api';

export type ContentType = 'blog_post_outline' | 'product_description' | 'social_media_caption' | 'article' | 'email';
export type JobStatus = 'queued' | 'pending' | 'processing' | 'completed' | 'failed';

export interface Content {
  id: string;
  topic: string;
  contentType: ContentType;
  source: 'ai' | 'manual';
  prompt?: string | null;
  generatedContent?: string | null;
  content?: string | null;
  jobId?: string | null;
  jobStatus?: JobStatus | null;
  createdAt: string;
  updatedAt: string;
}

interface ContentState {
  contents: Content[];
  currentContent: Content | null;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: ContentState = {
  contents: [],
  currentContent: null,
  isLoading: false,
  isCreating: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const createContent = createAsyncThunk(
  'content/create',
  async ({ topic, contentType }: { topic: string; contentType: ContentType }, { rejectWithValue }) => {
    try {
      const response = await contentAPI.createContent(topic, contentType);
      const data = response.data || response;
      const content = data.data?.content || data.content;
      return {
        ...content,
        id: content._id || content.id,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create content');
    }
  }
);

export const fetchContents = createAsyncThunk(
  'content/fetchAll',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await contentAPI.getContent(page, limit);
      // API returns { success: true, data: { content: [...], total, page, totalPages } }
      const data = response.data || response;
      // Transform MongoDB _id to id and map content array
      const contents = ((data.data?.content || data.content || [])).map((item: any) => ({
        ...item,
        id: item._id || item.id,
      }));
      return {
        contents,
        total: data.data?.total || data.total || 0,
        page: data.data?.page || data.page || page,
        totalPages: data.data?.totalPages || data.totalPages || 0,
        limit,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contents');
    }
  }
);

export const fetchContentById = createAsyncThunk(
  'content/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await contentAPI.getContentById(id);
      const data = response.data || response;
      const content = data.data?.content || data.content;
      return {
        ...content,
        id: content._id || content.id,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch content');
    }
  }
);

export const updateContent = createAsyncThunk(
  'content/update',
  async ({ id, data }: { id: string; data: { topic?: string; content?: string } }, { rejectWithValue }) => {
    try {
      const response = await contentAPI.updateContent(id, data);
      const responseData = response.data || response;
      const content = responseData.data?.content || responseData.content;
      return {
        ...content,
        id: content._id || content.id,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update content');
    }
  }
);

export const rollbackContent = createAsyncThunk(
  'content/rollback',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await contentAPI.rollbackContent(id);
      const responseData = response.data || response;
      const content = responseData.data?.content || responseData.content;
      return {
        ...content,
        id: content._id || content.id,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to rollback content');
    }
  }
);

export const deleteContent = createAsyncThunk(
  'content/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await contentAPI.deleteContent(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete content');
    }
  }
);

export const fetchJobStatus = createAsyncThunk(
  'content/fetchJobStatus',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await contentAPI.getJobStatus(jobId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch job status');
    }
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentContent: (state, action: PayloadAction<Content | null>) => {
      state.currentContent = action.payload;
    },
    updateContentInList: (state, action: PayloadAction<Content>) => {
      const index = state.contents.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.contents[index] = action.payload;
      }
      if (state.currentContent?.id === action.payload.id) {
        state.currentContent = action.payload;
      }
    },
    updateJobStatusFromWebSocket: (
      state,
      action: PayloadAction<{
        jobId: string;
        contentId?: string;
        jobStatus?: JobStatus;
        generatedContent?: string;
      }>
    ) => {
      const { jobId, contentId, jobStatus, generatedContent } = action.payload;

      // Update content in list by jobId or contentId
      if (contentId) {
        const index = state.contents.findIndex((c) => c.id === contentId);
        if (index !== -1) {
          if (jobStatus) {
            state.contents[index].jobStatus = jobStatus;
          }
          if (generatedContent !== undefined) {
            state.contents[index].generatedContent = generatedContent;
            // Update content field if it doesn't exist (preserve user edits)
            if (!state.contents[index].content) {
              state.contents[index].content = generatedContent;
            }
          }
        }
        // Update currentContent if it matches
        if (state.currentContent && state.currentContent.id === contentId) {
          if (jobStatus) {
            state.currentContent.jobStatus = jobStatus;
          }
          if (generatedContent !== undefined) {
            state.currentContent.generatedContent = generatedContent;
            if (!state.currentContent.content) {
              state.currentContent.content = generatedContent;
            }
          }
        }
      } else {
        // Fallback: find by jobId
        const index = state.contents.findIndex((c) => c.jobId === jobId);
        if (index !== -1) {
          if (jobStatus) {
            state.contents[index].jobStatus = jobStatus;
          }
          if (generatedContent !== undefined) {
            state.contents[index].generatedContent = generatedContent;
            if (!state.contents[index].content) {
              state.contents[index].content = generatedContent;
            }
          }
        }
        if (state.currentContent && state.currentContent.jobId === jobId) {
          if (jobStatus) {
            state.currentContent.jobStatus = jobStatus;
          }
          if (generatedContent !== undefined) {
            state.currentContent.generatedContent = generatedContent;
            if (!state.currentContent.content) {
              state.currentContent.content = generatedContent;
            }
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Create content
    builder
      .addCase(createContent.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createContent.fulfilled, (state, action) => {
        state.isCreating = false;
        state.contents.unshift(action.payload as Content);
        state.currentContent = action.payload as Content;
      })
      .addCase(createContent.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      });

    // Fetch all contents
    builder
      .addCase(fetchContents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contents = action.payload.contents;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchContents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch content by ID
    builder
      .addCase(fetchContentById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentContent = action.payload as Content;
      })
      .addCase(fetchContentById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update content
    builder
      .addCase(updateContent.fulfilled, (state, action) => {
        const index = state.contents.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.contents[index] = action.payload as Content;
        }
        if (state.currentContent?.id === action.payload.id) {
          state.currentContent = action.payload as Content;
        }
      });

    // Rollback content
    builder
      .addCase(rollbackContent.fulfilled, (state, action) => {
        const index = state.contents.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.contents[index] = action.payload as Content;
        }
        if (state.currentContent?.id === action.payload.id) {
          state.currentContent = action.payload as Content;
        }
      });

    // Delete content
    builder
      .addCase(deleteContent.fulfilled, (state, action) => {
        state.contents = state.contents.filter((c) => c.id !== action.payload);
        if (state.currentContent?.id === action.payload) {
          state.currentContent = null;
        }
      });

    // Fetch job status
    builder
      .addCase(fetchJobStatus.fulfilled, (state, action) => {
        const payload = action.payload;
        const data = payload.data || payload;
        const content = data.data?.content || data.content;
        if (content) {
          const contentId = content._id || content.id;
          const index = state.contents.findIndex((c) => c.id === contentId);
          if (index !== -1) {
            state.contents[index].jobStatus = content.jobStatus;
            state.contents[index].generatedContent = content.generatedContent;
            state.contents[index].content = content.content;
          }
          if (state.currentContent && state.currentContent.id === contentId) {
            state.currentContent.jobStatus = content.jobStatus;
            state.currentContent.generatedContent = content.generatedContent;
            state.currentContent.content = content.content;
          }
        }
      });
  },
});

export const { clearError, setCurrentContent, updateContentInList, updateJobStatusFromWebSocket } = contentSlice.actions;
export default contentSlice.reducer;

