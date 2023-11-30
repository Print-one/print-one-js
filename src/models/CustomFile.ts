import { Protected } from "../PrintOne";
import { ICustomFile } from "./_interfaces/ICustomFile";

export class CustomFile {
  constructor(
    private readonly _protected: Protected,
    private readonly _data: ICustomFile,
  ) {}

  public get id(): string {
    return this._data.id;
  }

  public get fileName(): string {
    return this._data.fileName;
  }

  public get fileExtension(): string {
    return this._data.fileExtension;
  }

  public get size(): number {
    return this._data.size;
  }

  public get createdAt(): Date {
    return new Date(this._data.createdAt);
  }

  /**
   * Downloads the file
   * @returns { Promise<ArrayBuffer> } The file as an ArrayBuffer
   * @throws { PrintOneError } If the file could not be downloaded
   */
  public async download(): Promise<ArrayBuffer> {
    return this._protected.client.GET(`/customfiles/${this.id}/download`, {
      responseType: "arraybuffer",
    });
  }

  /**
   * Deletes the file
   * @returns { Promise<void> } Nothing if successful
   * @throws { PrintOneError } If the file could not be deleted
   */
  public async delete(): Promise<void> {
    return this._protected.client.DELETE(`/customfiles/${this.id}`);
  }
}
