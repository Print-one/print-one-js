import {
  IPaginatedResponseV3,
  IResponseV3,
  LinksV3,
  MetaV3,
} from "~/models/_interfaces/IResponse.v3";
import { Protected } from "~/PrintOne";
import { Model } from "../Model";

export class ResponseV3<T = unknown> extends Model<T> {
  static safe<T, I>(
    _protected: Protected,
    data: IResponseV3<T>,
    _convert: (data: T) => I,
  ): I {
    return new ResponseV3(_protected, data, _convert as (data: unknown) => I)
      .data;
  }

  private constructor(
    _protected: Protected,
    data: IResponseV3,
    private readonly _convert: (data: unknown) => T,
  ) {
    super(_protected, _convert(data.data));
  }

  public get data(): T {
    return this._data;
  }
}

export class PaginatedResponseV3<T = unknown> extends Model<
  IPaginatedResponseV3<T>
> {
  // We have need to use a static method because we can't use a generic just for the constructor
  static safe<T, I>(
    _protected: Protected,
    data: IPaginatedResponseV3<I>,
    _convert: (data: I) => T,
  ): PaginatedResponseV3<T> {
    return new PaginatedResponseV3(
      _protected,
      data,
      _convert as (data: unknown) => T,
    );
  }

  private constructor(
    _protected: Protected,
    data: IPaginatedResponseV3,
    private readonly _covert: (data: unknown) => T,
  ) {
    super(_protected, {
      ...data,
      data: [...data.data].map(_covert),
    });
  }

  public get meta(): MetaV3 {
    return {
      totalItems: this._data.meta.totalItems,
      totalPages: this._data.meta.totalPages,
      currentPage: this._data.meta.currentPage,
      itemsPerPage: this._data.meta.itemsPerPage,
      filterOptions: this._data.meta.filterOptions,
    };
  }

  public get links(): LinksV3 {
    return {
      first: this._data.links.first,
      previous: this._data.links.previous,
      current: this._data.links.current,
      next: this._data.links.next,
      last: this._data.links.last,
    };
  }

  public get data(): T[] {
    return this._data.data;
  }

  /**
   * Get the first page of data
   * @returns { PaginatedResponseV3 } If there is a next page
   * @returns { null } If there is no first page
   * @throws { PrintOneError }
   */
  public async first(): Promise<PaginatedResponseV3<T> | null> {
    return this._paginateTo(this._data.links.first);
  }

  /**
   * Get the previous page of data
   * @returns { PaginatedResponseV3 } If there is a previous page
   * @returns { null } If there is no previous page
   * @throws { PrintOneError }
   */
  public async previous(): Promise<PaginatedResponseV3<T> | null> {
    return this._paginateTo(this._data.links.previous);
  }

  /**
   * Get the next page of data
   * @returns { PaginatedResponseV3 } If there is a next page
   * @returns { null } If there is no next page
   * @throws { PrintOneError }
   */
  public async next(): Promise<PaginatedResponseV3<T> | null> {
    return this._paginateTo(this._data.links.next);
  }

  /**
   * Get the last page of data
   * @returns { PaginatedResponseV3 } If there is a previous page
   * @returns { null } If there is no last page
   * @throws { PrintOneError }
   */
  public async last(): Promise<PaginatedResponseV3<T> | null> {
    return this._paginateTo(this._data.links.last);
  }

  private async _paginateTo(
    url?: string | null,
  ): Promise<PaginatedResponseV3<T> | null> {
    if (!url) {
      return null;
    }

    const data = await this._protected.client.GET<IPaginatedResponseV3>(url);

    return new PaginatedResponseV3(this._protected, data, this._covert);
  }
}
