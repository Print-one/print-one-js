import { Model } from "../Model";
import { Destination } from "~/enums/Destination";
import { Format } from "~/enums/Format";
import {
  IDesign,
  IDesignPage,
  IFullDesign,
  ISerializedHelperCall,
} from "./_interfaces/IDesign";
import { Protected } from "~/PrintOne";

export interface AddDesign {
  name: string;
  format: Format;
  labels?: string[];
  pages: { content: string }[];
  options?: { doubleSided?: boolean };
  default?: boolean;
}

class BaseDesign<T extends IDesign> extends Model<T> {
  constructor(
    protected _protected: Protected,
    _data: T,
    public campaignId: string,
  ) {
    super(_protected, _data);
  }

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

  public async makeDefault(): Promise<void> {
    await this._protected.client.PATCH(
      `campaigns/${this.campaignId}/designs/${this.destination}/${this.id}`,
      { default: true },
    );
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
