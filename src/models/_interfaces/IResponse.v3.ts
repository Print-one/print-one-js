export type IResponseV3<T = unknown> = {
  data: T;
};

export type IPaginatedResponseV3<T = unknown> = {
  data: T[];
  meta: MetaV3;
  links: LinksV3;
};

export type MetaV3 = {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  filterOptions: Record<string, string[]>;
};

export type LinksV3 = {
  first: string | null;
  previous: string | null;
  current: string;
  next: string | null;
  last: string | null;
};
