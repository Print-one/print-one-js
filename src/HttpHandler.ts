import { Axios, AxiosRequestConfig, AxiosResponse } from "axios";
import debug from "debug";
import { PrintOneError } from "./errors/PrintOneError";

export class AxiosHTTP {
  private readonly client: Axios;
  private readonly debug: debug.Debugger;

  constructor(client: Axios, debug: debug.Debugger) {
    this.client = client;
    this.debug = debug;
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
    const response = await this.client.request<Buffer>({
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

  private handleErrors(response: AxiosResponse) {
    if (response.status >= 400) {
      throw new PrintOneError(
        response.data.statusCode ?? response.status,
        response.data.message,
      );
    }
  }
}
