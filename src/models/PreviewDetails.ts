import { IPreviewDetails } from "~/models/_interfaces/IPreviewDetails";
import { Model } from "~/Model";

export class PreviewDetails extends Model<IPreviewDetails> {
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
