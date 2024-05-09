export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type SortDirection = "ASC" | "DESC";
export type SortBy<T extends string> =
  | {
      order: SortDirection;
      field: T;
    }
  | `${T}:${SortDirection}`;
export type PaginationOptions<T extends string> = {
  limit?: number;
  page?: number;
  sortBy?: SortBy<T>[] | SortBy<T>;
};

export function sortToQuery<T extends string>(
  options: PaginationOptions<T>,
): Record<string, unknown> {
  const query: Record<string, unknown> = {};

  if (options?.sortBy) {
    const sortBy = Array.isArray(options.sortBy)
      ? options.sortBy
      : [options.sortBy];

    query.sortBy = sortBy
      .map((sort) =>
        typeof sort === "string" ? sort : `${sort.field}:${sort.order}`,
      )
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

export function mapInFilter<T extends string, R extends string>(
  values: undefined | InFilter<T>,
  mapper: (value: T) => R,
): undefined | InFilter<R> {
  if (values === undefined) {
    return undefined;
  }

  if (typeof values === "string") {
    return mapper(values);
  } else {
    return values.map(mapper);
  }
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
  invert: boolean,
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
  from?: string | Date;
  to?: string | Date;
};

export function dateFilterToQuery(
  field: string,
  values: undefined | DateFilter,
): Record<string, unknown> {
  if (values === undefined) {
    return {};
  }

  const query: Record<string, unknown> = {};

  const from =
    values.from instanceof Date ? values.from.toISOString() : values.from;
  const to = values.to instanceof Date ? values.to.toISOString() : values.to;

  if (from && to) {
    query[`filter.${field}`] = `$btw:${from},${to}`;
  } else if (values.from) {
    query[`filter.${field}`] = `$gte:${from}`;
  } else if (values.to) {
    query[`filter.${field}`] = `$lte:${to}`;
  }

  return query;
}

export type EqualsFilter<T = string> = T | null;

export function equalsFilterToQuery(
  field: string,
  value: undefined | EqualsFilter,
): Record<string, unknown> {
  if (value === undefined) {
    return {};
  }

  return {
    [`filter.${field}`]: value === null ? "$null" : `$eq:${value}`,
  };
}
