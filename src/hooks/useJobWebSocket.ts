import { useEffect, useRef } from 'react';
import { useAppDispatch } from '../store/hooks';
import { updateJobStatusFromWebSocket } from '../store/contentSlice';
import { websocketService } from '../services/websocket';
import type { JobStatus } from '../store/contentSlice';

interface UseJobWebSocketOptions {
  jobId: string | null | undefined;
  jobStatus: JobStatus | null | undefined;
  enabled?: boolean;
}

/**
 * Hook to subscribe to job status updates via WebSocket
 * Replaces the polling mechanism with real-time WebSocket updates
 */
export function useJobWebSocket({
  jobId,
  jobStatus,
  enabled = true,
}: UseJobWebSocketOptions) {
  const dispatch = useAppDispatch();
  const subscribedJobIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Don't subscribe if disabled, no jobId, or job is already completed/failed
    if (
      !enabled ||
      !jobId ||
      !jobStatus ||
      jobStatus === 'completed' ||
      jobStatus === 'failed'
    ) {
      // Unsubscribe if we were previously subscribed to a different job
      if (subscribedJobIdRef.current && subscribedJobIdRef.current !== jobId) {
        const socket = websocketService.getSocket();
        if (socket?.connected) {
          socket.emit('unsubscribe-job', subscribedJobIdRef.current);
          subscribedJobIdRef.current = null;
        }
      }
      return;
    }

    const socket = websocketService.getSocket();
    if (!socket) {
      console.warn('WebSocket not available');
      return;
    }

    // Unsubscribe from previous job if different
    if (subscribedJobIdRef.current && subscribedJobIdRef.current !== jobId) {
      socket.emit('unsubscribe-job', subscribedJobIdRef.current);
    }

    // Subscribe to new job
    socket.emit('subscribe-job', jobId);
    subscribedJobIdRef.current = jobId;

    // Set up listener for job updates
    const handleJobUpdate = (data: {
      jobId: string;
      contentId?: string;
      status?: JobStatus;
      generatedContent?: string;
      timestamp?: string;
    }) => {
      // Only process updates for the current job
      if (data.jobId === jobId) {
        dispatch(
          updateJobStatusFromWebSocket({
            jobId: data.jobId,
            contentId: data.contentId,
            jobStatus: data.status,
            generatedContent: data.generatedContent,
          })
        );
      }
    };

    socket.on('job-update', handleJobUpdate);

    // Cleanup: unsubscribe when component unmounts or jobId changes
    return () => {
      if (socket.connected && subscribedJobIdRef.current) {
        socket.emit('unsubscribe-job', subscribedJobIdRef.current);
        socket.off('job-update', handleJobUpdate);
        subscribedJobIdRef.current = null;
      }
    };
  }, [jobId, jobStatus, enabled, dispatch]);
}

