import { IPaginatedResponse } from "./_interfaces/IPaginatedResponse";
import { Protected } from "../PrintOne";

export class PaginatedResponse<T = unknown> {
  protected readonly _data: IPaginatedResponse<T>;

  // We have need to use a static method because we can't use a generic just for the constructor
  static safe<T, I>(
    _protected: Protected,
    data: IPaginatedResponse<I>,
    _convert: (data: I) => T,
  ): PaginatedResponse<T> {
    return new PaginatedResponse(
      _protected,
      data,
      _convert as (data: unknown) => T,
    );
  }

  private constructor(
    private readonly _protected: Protected,
    data: IPaginatedResponse,
    private readonly _covert: (data: unknown) => T,
  ) {
    this._data = {
      ...data,
      data: [...data.data].map(_covert),
    };
  }

  public get page(): number {
    return this._data.page;
  }

  public get pages(): number {
    return this._data.pages;
  }

  public get pageSize(): number {
    return this._data.pageSize;
  }

  public get total(): number {
    return this._data.total;
  }

  public get data(): T[] {
    return this._data.data;
  }

  /**
   * Get the next page of data
   * @returns { PaginatedResponse } If there is a next page
   * @returns { null } If there is no next page
   * @throws { PrintOneError }
   */
  public async next(): Promise<PaginatedResponse<T> | null> {
    if (this._data.nextUrl === null) {
      return null;
    }

    const data = await this._protected.client.GET<IPaginatedResponse>(
      this._data.nextUrl,
    );

    return new PaginatedResponse(this._protected, data, this._covert);
  }

  /**
   * Get the previous page of data
   * @returns { PaginatedResponse } If there is a previous page
   * @returns { null } If there is no previous page
   * @throws { PrintOneError }
   */
  public async previous(): Promise<PaginatedResponse<T> | null> {
    if (this._data.previousUrl === null) {
      return null;
    }

    const data = await this._protected.client.GET<IPaginatedResponse>(
      this._data.previousUrl,
    );

    return new PaginatedResponse(this._protected, data, this._covert);
  }
}
