import { Protected } from "../PrintOne";
import { IPreviewDetails } from "./_interfaces/IPreviewDetails";

export class PreviewDetails {
  private _data: IPreviewDetails;

  constructor(
    private readonly _protected: Protected,
    _data: IPreviewDetails,
  ) {
    this._data = _data;
  }

  public get id(): string {
    return this._data.id;
  }

  public get imageUrl(): string {
    return this._data.imageUrl;
  }

  public get errors(): string[] {
    return this._data.errors;
  }

  /**
   * Download the preview.
   * @throws { PrintOneError } If the preview could not be downloaded.
   */
  public async download(): Promise<Uint8Array> {
    return this._protected.client.GETBuffer(this.imageUrl);
  }
}
