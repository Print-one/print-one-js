import { Model } from "../Model";
import { Destination } from "~/enums/Destination";
import { Format } from "~/enums/Format";
import {
  IDesign,
  IDesignPage,
  IFullDesign,
  ISerializedHelperCall,
} from "./_interfaces/IDesign";

class BaseDesign<T extends IDesign> extends Model<T> {
  public get id(): string {
    return this._data.id;
  }

  public get version(): number {
    return this._data.version;
  }

  public get name(): string {
    return this._data.name;
  }

  public get format(): Format {
    return this._data.format;
  }

  public get overlay(): string {
    return this._data.overlay;
  }

  public get labels(): string[] {
    return this._data.labels;
  }

  public get mergeVariables(): string[] {
    return this._data.mergeVariables;
  }

  public get thumbnail(): string | null {
    return this._data.thumbnail;
  }

  public get apiVersion(): number {
    return this._data.apiVersion;
  }

  public get updatedAt(): Date | undefined {
    return this._data.updatedAt ? new Date(this._data.updatedAt) : undefined;
  }

  public get destination(): Destination {
    return this._data.destination;
  }
}

export class Design extends BaseDesign<IDesign> {
  // No additional fields
}

// TODO: Implement API endpoint to fetch full design details
export class FullDesign extends BaseDesign<IFullDesign> {
  public get pages(): IDesignPage[] {
    return this._data.pages;
  }

  public get serializedHelperCalls(): ISerializedHelperCall[] {
    return this._data.serializedHelperCalls;
  }
}
