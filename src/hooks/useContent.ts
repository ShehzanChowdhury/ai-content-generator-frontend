import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  createContent,
  fetchContents,
  fetchContentById,
  updateContent,
  rollbackContent,
  deleteContent,
  clearError,
} from '../store/contentSlice';
import type { ContentType } from '../store/contentSlice';

export function useContent() {
  const dispatch = useAppDispatch();
  const { contents, currentContent, isLoading, isCreating, error, pagination } = useAppSelector(
    (state) => state.content
  );

  const create = useCallback(
    async (topic: string, contentType: ContentType) => {
      return dispatch(createContent({ topic, contentType })).unwrap();
    },
    [dispatch]
  );

  const fetchAll = useCallback(
    async (page: number = 1, limit: number = 10) => {
      return dispatch(fetchContents({ page, limit })).unwrap();
    },
    [dispatch]
  );

  const fetchById = useCallback(
    async (id: string) => {
      return dispatch(fetchContentById(id)).unwrap();
    },
    [dispatch]
  );

  const update = useCallback(
    async (id: string, data: { topic?: string; content?: string }) => {
      return dispatch(updateContent({ id, data })).unwrap();
    },
    [dispatch]
  );

  const rollback = useCallback(
    async (id: string) => {
      return dispatch(rollbackContent(id)).unwrap();
    },
    [dispatch]
  );

  const remove = useCallback(
    async (id: string) => {
      return dispatch(deleteContent(id)).unwrap();
    },
    [dispatch]
  );

  const clearContentError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    contents,
    currentContent,
    isLoading,
    isCreating,
    error,
    pagination,
    create,
    fetchAll,
    fetchById,
    update,
    rollback,
    remove,
    clearContentError,
  };
}


