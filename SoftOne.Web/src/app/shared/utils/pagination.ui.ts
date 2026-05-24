export function formatPaginationRange(
  page: number,
  pageSize: number,
  totalCount: number
): string {
  if (totalCount <= 0) {
    return 'Showing 0 of 0 tasks';
  }

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return `Showing ${start}–${end} of ${totalCount} tasks`;
}

export function formatPageIndicator(page: number, totalPages: number): string {
  const safeTotal = Math.max(totalPages, 1);
  const safePage = Math.min(Math.max(page, 1), safeTotal);

  return `Page ${safePage} of ${safeTotal}`;
}
