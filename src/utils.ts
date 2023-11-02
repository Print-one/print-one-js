export type SortDirection = "ASC" | "DESC";
export type SortBy<T> = {
  order: SortDirection;
  field: T;
};
export type PaginationOptions<T> = {
  limit?: number;
  page?: number;
  sortBy?: SortBy<T>[] | SortBy<T>;
};

export function sortToQuery<T>(
  options: PaginationOptions<T>,
): Record<string, unknown> {
  const query: Record<string, unknown> = {};

  if (options?.sortBy) {
    const sortBy = Array.isArray(options.sortBy)
      ? options.sortBy
      : [options.sortBy];

    query.sortBy = sortBy
      .map((sort) => `${sort.field}:${sort.order}`)
      .join(",");
  }

  if (options?.page) {
    query.page = options.page;
  }

  if (options?.limit) {
    query.limit = options.limit;
  }

  return query;
}

export type InFilter<T = string> = T | T[];

export function inFilterToQuery(
  field: string,
  values: undefined | InFilter,
): Record<string, unknown> {
  if (values === undefined) {
    return {};
  }

  if (typeof values === "string") {
    return {
      [`filter.${field}`]: `$in:${values}`,
    };
  }

  return {
    [`filter.${field}`]: `$in:${values.join(",")}`,
  };
}

export type ContainsFilter =
  | string
  | {
      some: string[];
    }
  | {
      all: string[];
    };

export function containsFilterToQuery(
  field: string,
  values: undefined | ContainsFilter,
): Record<string, unknown> {
  if (values === undefined) {
    return {};
  }

  if (typeof values === "string") {
    return {
      [`filter.${field}`]: `$contains:${values}`,
    };
  }

  if ("some" in values) {
    return {
      [`filter.${field}`]: `$containss:${values.some.join(",")}`,
    };
  }

  return {
    [`filter.${field}`]: `$contains:${values.all.join(",")}`,
  };
}

export function invertedFilterToQuery(
  field: string,
  values: undefined | boolean,
  operator: string,
  invert = false,
): Record<string, unknown> {
  if (values === undefined) {
    return {};
  }

  if ((values && !invert) || (!values && invert)) {
    return {
      [`filter.${field}`]: operator,
    };
  } else {
    return {
      [`filter.${field}`]: `$not:${operator}`,
    };
  }
}

export type DateFilter = {
  from?: Date;
  to?: Date;
};

export function dateFilterToQuery(
  field: string,
  values: undefined | DateFilter,
): Record<string, unknown> {
  if (values === undefined) {
    return {};
  }

  const query: Record<string, unknown> = {};

  if (values.from && values.to) {
    query[
      `filter.${field}`
    ] = `btw:${values.from.toISOString()},${values.to.toISOString()}`;
  } else if (values.from) {
    query[`filter.${field}`] = `$gte:${values.from.toISOString()}`;
  } else if (values.to) {
    query[`filter.${field}`] = `$lte:${values.to.toISOString()}`;
  }

  return query;
}
