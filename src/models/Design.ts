import { Model } from "~/Model";
import { Destination } from "~/enums/Destination";
import { Format } from "~/enums/Format";
import {
  IDesign,
  IDesignPage,
  IFullDesign,
  ISerializedHelperCall,
} from "./_interfaces/IDesign";
import { Protected } from "~/PrintOne";
import { ResponseV3 } from "./Response.v3";
import { IResponseV3 } from "./_interfaces/IResponse.v3";

export interface AddDesign {
  name: string;
  format: Format;
  labels?: string[];
  pages: { content: string }[];
  options?: { doubleSided?: boolean };
  default?: boolean;
}

export class Design extends Model<IFullDesign | IDesign> {
  private _loaded?: IFullDesign;

  constructor(
    protected _protected: Protected,
    _data: IDesign | IFullDesign,
    public campaignId: string,
  ) {
    super(_protected, _data);
    if (_data.pages) this._loaded = _data as IFullDesign;
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

  public get updatedAt(): Date {
    return new Date(this._data.updatedAt);
  }

  public get destination(): Destination {
    return this._data.destination;
  }

  public get default(): boolean {
    return this._data.default;
  }

  public async load(): Promise<void> {
    const response = ResponseV3.safe(
      this._protected,
      await this._protected.clientV3.GET<IResponseV3<IFullDesign>>(
        `campaigns/${this.campaignId}/designs/${this.destination}/${this.id}`,
      ),
      (d) => d,
    );

    this._data = response;
    this._loaded = response;
  }

  /**
   * Get the pages of the design
   *
   * <b>NOTE: This method will throw an error if {@link load} has not been called</b>
   * @throws { Error } When the design is not loaded
   * @returns { IDesignPage[] } The pages of the design
   */
  public get pages(): IDesignPage[] {
    if (this._loaded === undefined)
      throw new Error("Design pages are not loaded, call 'load()' first");

    return this._loaded.pages;
  }

  /**
   * Get the serialized helper calls of the design
   *
   * <b>NOTE: This method will throw an error if {@link load} has not been called</b>
   * @throws { Error } When the design is not loaded
   * @returns { ISerializedHelperCall[] } The serialized helper calls of the design
   */
  public get serializedHelperCalls(): ISerializedHelperCall[] {
    if (this._loaded === undefined)
      throw new Error(
        "Design serializedHelperCalls are not loaded, call 'load()' first",
      );

    return this._loaded.serializedHelperCalls;
  }
}
