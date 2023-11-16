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
   * Performs a GET request to the Moneybird API
   * @param url The url to perform the request to
   * @param options The options for the request
   */
  public async GET<T>(
    url: string,
    options: AxiosRequestConfig = {},
  ): Promise<T> {
    this.debug(`GET ${url}`);

    const response = await this.client.request<T>({
      method: "GET",
      url: url,
      ...options,
    });

    this.handleErrors(response);

    return response.data;
  }

  /**
   * Performs a POST request to the Moneybird API
   * @param url The url to perform the request to
   * @param data The data to send with the request
   * @param options The options for the request
   */
  public async POST<T>(
    url: string,
    data: unknown,
    options: AxiosRequestConfig = {},
  ): Promise<T> {
    this.debug(`POST ${url}`);

    const response = await this.client.request<T>({
      method: "POST",
      url: url,
      data: data,
      ...options,
    });

    this.handleErrors(response);

    return response.data;
  }

  /**
   * Performs a PATCH request to the Moneybird API
   * @param url The url to perform the request to
   * @param data The data to send with the request
   * @param options The options for the request
   */
  public async PATCH<T>(
    url: string,
    data: unknown,
    options: AxiosRequestConfig = {},
  ): Promise<T> {
    this.debug(`PATCH ${url}`);

    const response = await this.client.request<T>({
      method: "PATCH",
      url: url,
      data: data,
      ...options,
    });

    this.handleErrors(response);

    return response.data;
  }

  /**
   * Performs a DELETE request to the Moneybird API
   * @param url The url to perform the request to
   * @param options The options for the request
   */
  public async DELETE<T>(
    url: string,
    options: AxiosRequestConfig = {},
  ): Promise<T> {
    this.debug(`DELETE ${url}`);

    const response = await this.client.request<T>({
      method: "DELETE",
      url: url,
      ...options,
    });

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
