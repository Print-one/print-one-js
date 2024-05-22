import debug from "debug";
import { PrintOneError } from "~/errors/PrintOneError";
import { PrintOneOptions } from "~/PrintOne";

export abstract class HttpHandler<RequestOptions, Response> {
  protected readonly debug: debug.Debugger;

  constructor(
    token: string,
    protected readonly options: Required<PrintOneOptions>,
    debug: debug.Debugger,
  ) {
    // We require these, so each extended class has type-safe auto-fill
    token;

    this.debug = debug;
  }
  /**
   * Performs a GET request.
   * @param url The url to perform the request to
   * @param options The options for the request
   */
  public abstract GET<T>(url: string, options?: RequestOptions): Promise<T>;

  /**
   * Performs a GET request and returns the response as a ArrayBuffer.
   * @param url The url to perform the request to
   * @param options The options for the request
   */
  public abstract GETBuffer(
    url: string,
    options?: RequestOptions,
  ): Promise<Uint8Array>;

  /**
   * Performs a POST request.
   * @param url The url to perform the request to
   * @param data The data to send with the request
   * @param options The options for the request
   */
  public abstract POST<T>(
    url: string,
    data: unknown,
    options?: RequestOptions,
  ): Promise<T>;

  /**
   * Performs a PATCH request.
   * @param url The url to perform the request to
   * @param data The data to send with the request
   * @param options The options for the request
   */
  public abstract PATCH<T>(
    url: string,
    data: unknown,
    options?: RequestOptions,
  ): Promise<T>;

  /**
   * Performs a DELETE request.
   * @param url The url to perform the request to
   * @param options The options for the request
   */
  public abstract DELETE<T>(url: string, options?: RequestOptions): Promise<T>;

  protected handleErrors(response: Response) {
    const res = response as {
      status: number;
      data: { statusCode?: number; message: string[] };
    };

    if (res.status >= 400) {
      throw new PrintOneError(
        res.data.statusCode ?? res.status,
        res.data.message,
      );
    }
  }
}
