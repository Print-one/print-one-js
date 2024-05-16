import axios, { Axios, AxiosRequestConfig, AxiosResponse } from "axios";
import debug from "debug";
import { HttpHandler } from "./HttpHandler";
import { PrintOneOptions } from "./PrintOne";

export class AxiosHTTPHandler extends HttpHandler<
  AxiosRequestConfig,
  AxiosResponse
> {
  private readonly client: Axios;

  constructor(
    token: string,
    options: Required<PrintOneOptions>,
    debug: debug.Debugger,
  ) {
    super(token, options, debug);
    this.client = axios.create({
      baseURL: new URL(options.version, options.url).href + "/",
      responseType: "json",
      validateStatus: () => true,
      headers: {
        "x-api-key": token,
      },
    });
  }
  /**
   * Performs a GET request.
   * @param url The url to perform the request to
   * @param options The options for the request
   */
  public async GET<T>(
    url: string,
    options: AxiosRequestConfig = {},
  ): Promise<T> {
    const response = await this.client.request<T>({
      method: "GET",
      url: url,
      ...options,
    });

    this.debug(`GET ${response.request.path}`);

    this.handleErrors(response);

    return response.data;
  }

  /**
   * Performs a GET request and returns the response as a ArrayBuffer.
   * @param url The url to perform the request to
   * @param options The options for the request
   */
  public async GETBuffer(
    url: string,
    options: AxiosRequestConfig = {},
  ): Promise<Uint8Array> {
    const response = await this.client.request<number[]>({
      method: "GET",
      url: url,
      responseType: "arraybuffer",
      ...options,
    });

    this.debug(`GET ${response.request.path}`);

    this.handleErrors(response);

    return Uint8Array.from(response.data);
  }

  /**
   * Performs a POST request.
   * @param url The url to perform the request to
   * @param data The data to send with the request
   * @param options The options for the request
   */
  public async POST<T>(
    url: string,
    data: unknown,
    options: AxiosRequestConfig = {},
  ): Promise<T> {
    const response = await this.client.request<T>({
      method: "POST",
      url: url,
      data: data,
      ...options,
    });

    this.debug(`POST ${response.request.path}`);

    this.handleErrors(response);

    return response.data;
  }

  /**
   * Performs a PATCH request.
   * @param url The url to perform the request to
   * @param data The data to send with the request
   * @param options The options for the request
   */
  public async PATCH<T>(
    url: string,
    data: unknown,
    options: AxiosRequestConfig = {},
  ): Promise<T> {
    const response = await this.client.request<T>({
      method: "PATCH",
      url: url,
      data: data,
      ...options,
    });

    this.debug(`PATCH ${response.request.path}`);

    this.handleErrors(response);

    return response.data;
  }

  /**
   * Performs a DELETE request.
   * @param url The url to perform the request to
   * @param options The options for the request
   */
  public async DELETE<T>(
    url: string,
    options: AxiosRequestConfig = {},
  ): Promise<T> {
    const response = await this.client.request<T>({
      method: "DELETE",
      url: url,
      ...options,
    });

    this.debug(`DELETE ${response.request.path}`);

    this.handleErrors(response);

    return response.data;
  }
}
