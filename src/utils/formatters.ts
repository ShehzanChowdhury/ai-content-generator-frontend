
export function formatContentType(type: string): string {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleString();
}

export function formatDateShort(date: string | Date): string {
  return new Date(date).toLocaleDateString();
}


