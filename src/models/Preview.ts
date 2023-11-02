import { IPreview } from "./_interfaces/IPreview";
import { Protected } from "../PrintOne";
import { PrintOneError } from "../errors/PrintOneError";
import { PreviewDetails } from "./PreviewDetails";
import { IPreviewDetails } from "./_interfaces/IPreviewDetails";
import { TimeoutError } from "../errors/TimeoutError";
import { sleep } from "../utils";

export class Preview {
  private _data: IPreview;

  constructor(
    private readonly _protected: Protected,
    _data: IPreview,
  ) {
    this._data = _data;
  }

  public get detailsUrl(): string {
    return this._data.detailsUrl;
  }

  public get url(): string {
    return this._data.url;
  }

  public get orderingKey(): number {
    return this._data.orderingKey;
  }

  /**
   * Get the details of the preview.
   * @param polling Whether to poll for the details until they are available.
   * @param timeoutSeconds How long it should poll until it gives up.
   * @throws { TimeoutError } If the timeout is reached.
   * @throws { PrintOneError } If the details could not be retrieved.
   */
  public async getDetails(
    polling = true,
    timeoutSeconds = 20,
  ): Promise<PreviewDetails> {
    let time = 0;
    do {
      try {
        const data = await this._protected.client.GET<IPreviewDetails>(
          this.detailsUrl,
        );

        return new PreviewDetails(this._protected, data);
      } catch (e) {
        if (polling && e instanceof PrintOneError) {
          const error = e as PrintOneError;

          if (error.statusCode === 404) {
            await sleep(1000);

            if (time++ >= timeoutSeconds) {
              throw new TimeoutError("Timeout reached");
            }

            continue;
          }
        }

        throw e;
      }
    } while (polling);

    throw new Error("Unreachable");
  }

  /**
   * Download the preview.
   * @param polling Whether to poll for the image until they are available.
   * @param timeoutSeconds How long it should poll until it gives up.
   * @throws { TimeoutError } If the timeout is reached.
   * @throws { PrintOneError } If the details could not be retrieved.
   */
  public async download(
    polling = true,
    timeoutSeconds = 20,
  ): Promise<ArrayBuffer> {
    let time = 0;
    do {
      try {
        return await this._protected.client.GET<ArrayBuffer>(this.url, {
          responseType: "arraybuffer",
        });
      } catch (e) {
        if (polling && e instanceof PrintOneError) {
          const error = e as PrintOneError;

          if (error.statusCode === 404) {
            await sleep(1000);

            if (time++ >= timeoutSeconds) {
              throw new TimeoutError("Timeout reached");
            }

            continue;
          }
        }

        throw e;
      }
    } while (polling);

    throw new Error("Unreachable");
  }
}
