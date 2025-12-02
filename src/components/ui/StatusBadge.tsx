import Badge from './Badge';
import type { JobStatus } from '../../store/contentSlice';

interface StatusBadgeProps {
  status: JobStatus | null | undefined;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  if (!status) return null;

  const statusConfig: Record<JobStatus, { variant: 'success' | 'warning' | 'info' | 'danger' | 'default'; label: string }> = {
    queued: { variant: 'warning', label: 'Queued' },
    pending: { variant: 'info', label: 'Pending' },
    processing: { variant: 'info', label: 'Processing' },
    completed: { variant: 'success', label: 'Completed' },
    failed: { variant: 'danger', label: 'Failed' },
  };

  const config = statusConfig[status] || { variant: 'default' as const, label: status };

  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
}


