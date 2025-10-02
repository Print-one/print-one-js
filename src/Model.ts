import { Protected } from "./PrintOne";

export abstract class Model<T> {
  public constructor(
    protected readonly _protected: Protected,
    protected _data: T,
  ) {}

  public toJSON(): T {
    return this._data;
  }
}
