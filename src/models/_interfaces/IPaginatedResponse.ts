export type IPaginatedResponse<T = unknown> = {
  data: T[];
  previousUrl: string | null;
  currentUrl: string;
  nextUrl: string | null;
  page: number;
  pages: number;
  pageSize: number;
  total: number;
  meta: {
    filterOptions: Record<string, string[]>;
  };
};
