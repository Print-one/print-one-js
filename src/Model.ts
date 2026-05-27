import { Protected, UnsafeCreationContext } from "./types";

export abstract class Model<T> extends UnsafeCreationContext {
  public constructor(
    protected readonly _protected: Protected,
    protected _data: T,
  ) {
    super();
  }

  public toJSON(): T {
    return this._data;
  }
}
