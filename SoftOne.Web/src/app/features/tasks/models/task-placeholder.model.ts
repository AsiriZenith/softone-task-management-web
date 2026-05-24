/** Placeholder task shape for dashboard layout (replaced by API model in Phase 7). */
export interface TaskPlaceholder {
  id: number;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: string;
  dueDate: string;
}
