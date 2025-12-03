# AI-Powered Content Generator Frontend

## Table of Contents

- [a. Project Overview and Tech Stack Used](#a-project-overview-and-tech-stack-used)
- [b. Setup Instructions](#b-setup-instructions)
- [c. API Documentation](#c-api-documentation)
- [d. Architectural Decisions](#d-architectural-decisions)

## a. Project Overview and Tech Stack Used

A modern frontend application for AI-powered content generation and management. The application provides a user-friendly interface for creating, viewing, editing, and managing AI-generated content with real-time job status updates via WebSocket.

**Tech Stack:**
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios
- **WebSocket**: Socket.IO Client
- **Markdown Editor**: CodeMirror 6
- **Markdown Rendering**: react-markdown

### Folder Structure
```
frontend/
├── app/                    # Next.js App Router pages
│   ├── content/[id]/      # Content detail page
│   ├── create/            # Create content page
│   ├── dashboard/         # Dashboard page
│   ├── login/             # Login page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Base UI components
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ReduxProvider.tsx
│   ├── features/          # Feature-based modules
│   │   ├── auth/         # Authentication features
│   │   ├── content/     # Content management features
│   │   ├── create/      # Content creation features
│   │   ├── dashboard/   # Dashboard features
│   │   └── home/        # Home page features
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # API client configuration
│   ├── services/         # External service integrations (WebSocket)
│   ├── store/            # Redux store and slices
│   └── utils/            # Utility functions
├── public/               # Static assets
├── package.json
└── tsconfig.json
```

## b. Setup Instructions

### Prerequisites
- Node.js 20+ and npm
- Backend API server running (see [backend setup](https://github.com/ShehzanChowdhury/ai-content-generator-backend))

### Local Development Setup

1. **Clone the git repository and navigate to frontend directory:**
   ```bash
   git clone <repository-url>
   cd ai-content/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file:**
   ```bash
   touch .env.local
   ```

4. **Configure environment variables in `.env.local`:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```
   
   **Note:** The API URL should point to your backend server. If your backend is running on a different port or domain, update this accordingly.

5. **Start the development server:**
   ```bash
   npm run dev
   ```

The application will run on `http://localhost:3000` by default.

### Production Build

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

## c. API Documentation

The frontend communicates with the backend API for all data operations. For detailed API documentation including request/response schemas, authentication, and endpoint details, please refer to the [backend API documentation](https://github.com/ShehzanChowdhury/ai-content-generator-backend).

### API Integration Overview

The frontend uses the following API endpoints:

**Authentication:**
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Token refresh
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - User logout

**Content Management:**
- `POST /api/v1/content` - Create content and queue AI generation
- `GET /api/v1/content` - Get paginated content list
- `GET /api/v1/content/:id` - Get content by ID
- `PUT /api/v1/content/:id` - Update content
- `POST /api/v1/content/:id/rollback` - Rollback to AI-generated version
- `DELETE /api/v1/content/:id` - Delete content
- `GET /api/v1/content/job/:jobId/status` - Get job status

**WebSocket Events:**
- `subscribe-job` - Subscribe to job status updates
- `unsubscribe-job` - Unsubscribe from job updates
- `job-update` - Receive real-time job status updates

All API requests are handled through the centralized API client (`src/lib/api.ts`) with automatic token management and refresh logic.

## d. Architectural Decisions

1. **Redux Toolkit for State Management**: Centralized state management using Redux Toolkit with separate slices for authentication (`authSlice`) and content (`contentSlice`). This provides predictable state updates, middleware support, and excellent DevTools integration.

2. **Feature-Based Architecture**: Code is organized by features (auth, content, dashboard, etc.) rather than by file type, making it easier to locate and maintain related code. Each feature contains its components, hooks, and logic.

3. **Custom Hooks for Business Logic**: Reusable custom hooks (`useAuth`, `useContent`, `useJobWebSocket`) encapsulate complex logic and provide clean interfaces for components, promoting code reusability and testability.

4. **WebSocket Integration for Real-Time Updates**: Socket.IO client integration provides real-time job status updates without polling, improving user experience and reducing server load. The WebSocket service uses a singleton pattern to maintain a single connection.

5. **Protected Routes**: Route protection is implemented at the component level using `ProtectedRoute` wrapper, ensuring authenticated access to sensitive pages.

6. **Axios Interceptors for Token Management**: Automatic token injection and refresh logic through Axios interceptors ensures seamless authentication without manual token handling in each API call.

7. **Server-Side Rendering with Next.js App Router**: Leverages Next.js 16 App Router for optimal performance, SEO, and user experience with server-side rendering and static generation capabilities.

8. **TypeScript for Type Safety**: Full TypeScript implementation ensures type safety across the application, reducing runtime errors and improving developer experience.

9. **Centralized API Client**: Single API client instance with configured interceptors handles all HTTP requests, providing consistent error handling and authentication across the application.

10. **Optimistic UI Updates**: Redux state updates immediately reflect user actions while API calls are in progress, providing instant feedback and better perceived performance.
