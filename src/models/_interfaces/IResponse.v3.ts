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

export type ISingleErrorV3 = {
  message: string;
  code: number;
  error: string;
  field: string;
};

export type IErrorResponseV3 = {
  status: number;
  message: string;
  code: number;
  errors?: ISingleErrorV3[];
  uri: string;
};
