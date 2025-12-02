import { useEffect, useRef } from 'react';
import { useAppDispatch } from '../store/hooks';
import { updateJobStatusFromWebSocket } from '../store/contentSlice';
import { websocketService } from '../services/websocket';
import type { JobStatus } from '../store/contentSlice';

interface UseMultipleJobWebSocketOptions {
  jobIds: string[];
  enabled?: boolean;
}

/**
 * Hook to subscribe to multiple job status updates via WebSocket
 * Useful for dashboard views where multiple jobs might be active
 */
export function useMultipleJobWebSocket({
  jobIds,
  enabled = true,
}: UseMultipleJobWebSocketOptions) {
  const dispatch = useAppDispatch();
  const subscribedJobIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled || jobIds.length === 0) {
      // Unsubscribe from all jobs if disabled or no jobs
      const socket = websocketService.getSocket();
      if (socket?.connected && subscribedJobIdsRef.current.size > 0) {
        subscribedJobIdsRef.current.forEach((jobId) => {
          socket.emit('unsubscribe-job', jobId);
        });
        subscribedJobIdsRef.current.clear();
      }
      return;
    }

    const socket = websocketService.getSocket();
    if (!socket) {
      console.warn('WebSocket not available');
      return;
    }

    // Set up listener for job updates (only once)
    const handleJobUpdate = (data: {
      jobId: string;
      contentId?: string;
      status?: JobStatus;
      generatedContent?: string;
      timestamp?: string;
    }) => {
      // Only process updates for jobs we're tracking
      if (jobIds.includes(data.jobId)) {
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

    // Subscribe to all new jobs
    const currentSubscribed = new Set(subscribedJobIdsRef.current);
    jobIds.forEach((jobId) => {
      if (!currentSubscribed.has(jobId)) {
        socket.emit('subscribe-job', jobId);
        subscribedJobIdsRef.current.add(jobId);
      }
    });

    // Unsubscribe from jobs that are no longer in the list
    currentSubscribed.forEach((jobId) => {
      if (!jobIds.includes(jobId)) {
        socket.emit('unsubscribe-job', jobId);
        subscribedJobIdsRef.current.delete(jobId);
      }
    });

    // Cleanup: unsubscribe from all jobs when component unmounts or dependencies change
    return () => {
      if (socket.connected) {
        subscribedJobIdsRef.current.forEach((jobId) => {
          socket.emit('unsubscribe-job', jobId);
        });
        subscribedJobIdsRef.current.clear();
        socket.off('job-update', handleJobUpdate);
      }
    };
  }, [jobIds, enabled, dispatch]);
}

