import { Company } from "~/models/Company";
import debug from "debug";
import { HttpHandler } from "~/HttpHandler";
import { ICompany } from "~/models/_interfaces/ICompany";
import {
  ContainsFilter,
  containsFilterToQuery,
  DateFilter,
  dateFilterToQuery,
  EqualsFilter,
  equalsFilterToQuery,
  InFilter,
  inFilterToQuery,
  invertedFilterToQuery,
  mapInFilter,
  PaginationOptions,
  sortToQuery,
} from "~/utils";
import { IPaginatedResponse } from "~/models/_interfaces/IPaginatedResponse";
import { ICustomFile } from "~/models/_interfaces/ICustomFile";
import { PaginatedResponse } from "~/models/PaginatedResponse";
import { CustomFile } from "~/models/CustomFile";
import { ITemplate } from "~/models/_interfaces/ITemplate";
import { CreateTemplate, Template } from "~/models/Template";
import { CreateOrder, Order } from "~/models/Order";
import { IOrder } from "~/models/_interfaces/IOrder";
import { FriendlyStatus } from "~/enums/Status";
import { Format } from "~/enums/Format";
import { AxiosHTTPHandler } from "~/AxiosHttpHandler";
import { CreateCsvOrder, CsvOrder } from "~/models/CsvOrder";
import { ICsvOrder } from "~/models/_interfaces/ICsvOrder";
import { Batch, CreateBatch } from "~/models/Batch";
import { IBatch } from "~/models/_interfaces/IBatch";
import { BatchStatus } from "~/enums/BatchStatus";
import * as crypto from "crypto";
import { Webhook } from "~/models/Webhook";
import { CreateWebhook, IWebhook } from "~/models/_interfaces/IWebhook";
import { WebhookRequest, webhookRequestFactory } from "~/models/WebhookRequest";
import { IWebhookRequest } from "~/models/_interfaces/IWebhookRequest";
import { Coupon, CreateCoupon } from "~/models/Coupon";
import { ICoupon } from "~/models/_interfaces/ICoupon";

export type RequestHandler = new (
  token: string,
  options: Required<PrintOneOptions>,
  debug: PrintOneDebugger,
) => HttpHandler<{ headers: Record<string, string> }, unknown>;
export type PrintOneOptions = Partial<{
  url: string;
  version: "v2";

  /** Overwrite the default client */
  client?: RequestHandler;
}>;

const DEFAULT_OPTIONS: Required<PrintOneOptions> = {
  url: "https://api.print.one/",
  version: "v2",
  client: AxiosHTTPHandler,
};

export type PrintOneDebugger = (formatter: unknown, ...args: unknown[]) => void;

export type Protected = {
  client: HttpHandler<unknown, unknown>;
  options: Required<PrintOneOptions>;
  debug: PrintOneDebugger;
  printOne: PrintOne;
};

export type OrderPaginatedQuery = PaginationOptions<
  "createdAt" | "anonymizedAt" | "updatedAt" | "friendlyStatus" | "sendDate"
> & {
  filter?: {
    friendlyStatus?: InFilter<FriendlyStatus>;
    billingId?: InFilter;
    format?: InFilter<Format>;
    // finish?: InFilter<Finish>;
    isBillable?: boolean;
    createdAt?: DateFilter;
    anonymizedAt?: DateFilter | boolean;
    csvId?: InFilter;
    batchId?: EqualsFilter;
  };
};

export class PrintOne {
  private readonly _protected: Partial<Protected> = {
    debug: debug("print-one"),
    printOne: this,
  };

  protected get protected(): Protected {
    return this._protected as Protected;
  }

  protected get options(): Required<PrintOneOptions> {
    return this.protected.options;
  }

  protected get client(): HttpHandler<unknown, unknown> {
    return this.protected.client;
  }

  protected get debug(): PrintOneDebugger {
    return this.protected.debug;
  }

  // istanbul ignore next
  constructor(token: string, options: PrintOneOptions = {}) {
    this._protected.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    } as Required<PrintOneOptions>;
    this._protected.client = new this._protected.options.client(
      token,
      this.options,
      this.debug,
    );

    this.debug("Initialized");
  }

  /**
   * Get the currently logged in company.
   * @throws { PrintOneError }
   * @returns { Promise<Company> } Your company.
   */
  public async getSelf(): Promise<Company> {
    const data = await this.client.GET<ICompany>("companies/me");

    return new Company(this.protected, data);
  }

  /**
   * Get all custom files.
   * @param { PaginationOptions } options The options to use for pagination
   * @param options.limit The maximum amount of files to return.
   * @param options.page The page to return.
   * @param options.sortBy The fields to sort by, can be "createdAt", "fileName", "size", "id" or "fileExtension".
   * @throws { PrintOneError }
   * @returns { Promise<PaginatedResponse<CustomFile>> } The custom files.
   */
  public async getCustomFiles(
    options: PaginationOptions<
      "createdAt" | "fileName" | "size" | "id" | "fileExtension"
    > = {},
  ): Promise<PaginatedResponse<CustomFile>> {
    const data = await this.client.GET<IPaginatedResponse<ICustomFile>>(
      "customfiles",
      {
        params: sortToQuery(options),
      },
    );

    return PaginatedResponse.safe(
      this.protected,
      data,
      (data) => new CustomFile(this.protected, data),
    );
  }

  /**
   * Upload a custom file.
   * @param { string } fileName The name of the file.
   * @param { ArrayBuffer } file The file as an ArrayBuffer. Should be a font or image.
   * @throws { PrintOneError } If the file type is not supported.
   * @returns { Promise<CustomFile> } The uploaded file.
   */
  public async uploadCustomFile(
    fileName: string,
    file: ArrayBuffer,
  ): Promise<CustomFile> {
    const formData = new FormData();
    formData.append("file", new Blob([file]), fileName);

    const data = await this.client.POST<ICustomFile>("customfiles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return new CustomFile(this.protected, data);
  }

  /**
   * Create an template.
   */
  public async createTemplate(data: CreateTemplate): Promise<Template> {
    const response = await this.client.POST<ITemplate>("templates", {
      name: data.name,
      format: data.format,
      labels: data.labels ?? [],
      pages: data.pages?.map((page) => ({
        content: page,
      })),
    });

    return new Template(this.protected, response);
  }

  /**
   * Get all templates.
   * @param { PaginationOptions } options The options to use for pagination
   * @param options.limit The maximum amount of templates to return.
   * @param options.page The page to return.
   * @param options.sortBy The fields to sort by, can be "updatedAt".
   * @param options.filter The filters to apply.
   * @throws { PrintOneError }
   * @returns { Promise<PaginatedResponse<CustomFile>> } The templates.
   */
  public async getTemplates(
    options: PaginationOptions<"updatedAt"> & {
      filter?: {
        name?: InFilter;
        labels?: ContainsFilter;
        format?: InFilter<Format>;
        deleted?: boolean;
      };
    } = {},
  ): Promise<PaginatedResponse<Template>> {
    const data = await this.client.GET<IPaginatedResponse<ITemplate>>(
      "templates",
      {
        params: {
          ...sortToQuery(options),
          ...inFilterToQuery("name", options.filter?.name),
          ...containsFilterToQuery("labels", options.filter?.labels),
          ...inFilterToQuery("format", options.filter?.format),
          ...invertedFilterToQuery(
            "deletedAt",
            options.filter?.deleted,
            "$null",
            true,
          ),
        },
      },
    );

    return PaginatedResponse.safe(
      this.protected,
      data,
      (data) => new Template(this.protected, data),
    );
  }

  /**
   * Get a template by its id.
   * @param { string } id The id of the template.
   * @throws { PrintOneError } If the template could not be found.
   */
  public async getTemplate(id: string): Promise<Template> {
    const data = await this.client.GET<ITemplate>("templates/" + id);

    return new Template(this.protected, data);
  }

  //TODO: Add createTemplate

  /**
   * Create an order
   * @param data The order data
   */
  public async createOrder(data: CreateOrder): Promise<Order> {
    const template = data.templateId ?? data.template;
    const templateId = template instanceof Template ? template.id : template;

    const sendDateStr =
      data.sendDate instanceof Date
        ? data.sendDate.toISOString()
        : data.sendDate;

    const response = await this.client.POST<IOrder>("orders", {
      sender: data.sender,
      recipient: data.recipient,
      templateId: templateId,
      finish: data.finish,
      mergeVariables: data.mergeVariables,
      billingId: data.billingId,
      sendDate: sendDateStr,
    });

    return new Order(this.protected, response);
  }

  public async createCsvOrder(data: CreateCsvOrder): Promise<CsvOrder> {
    const template = data.templateId ?? data.template;
    const templateId = template instanceof Template ? template.id : template;

    const formData = new FormData();
    formData.append(
      "file",
      new Blob([data.file], { type: "text/csv" }),
      "upload.csv",
    );
    formData.append("mapping", JSON.stringify(data.mapping));
    formData.append(
      "orderData",
      JSON.stringify({
        sender: data.sender,
        templateId,
        finish: data.finish,
        billingId: data.billingId,
      }),
    );

    const response = await this.client.POST<{ id: string }>(
      "orders/csv",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const id = response.id;
    const csvInfo = await this.client.GET<ICsvOrder>(`orders/csv/${id}`);

    return new CsvOrder(this.protected, csvInfo);
  }

  /**
   * Get a csv order by its id.
   * @param { string } id The id of the csv order.
   * @param basePath The basePath to use for this request
   * @throws { PrintOneError } If the order could not be found.
   */
  public async getCsvOrder(id: string, basePath = "orders"): Promise<CsvOrder> {
    const data = await this.client.GET<ICsvOrder>(`${basePath}/csv/${id}`);

    return new CsvOrder(this.protected, data);
  }

  /**
   * Get an order by its id.
   * @param { string } id The id of the order.
   * @param basePath The basePath to use for this request
   * @throws { PrintOneError } If the order could not be found.
   */
  public async getOrder(id: string, basePath = "orders"): Promise<Order> {
    const data = await this.client.GET<IOrder>(`${basePath}/${id}`);

    return new Order(this.protected, data);
  }

  /**
   * Get all orders.
   * @param { PaginationOptions } options The options to use for pagination
   * @param options.limit The maximum amount of orders to return.
   * @param options.page The page to return.
   * @param options.sortBy The fields to sort by, can be "createdAt", "anonymizedAt", "updatedAt", "friendlyStatus", "sendDate".
   * @param options.filter The filters to apply.
   * @param basePath The basePath to use for this request
   * @throws { PrintOneError } If the order could not be found.
   */
  public async getOrders(
    options: OrderPaginatedQuery = {},
    basePath = "orders",
  ): Promise<PaginatedResponse<Order>> {
    let params = {
      ...sortToQuery(options),
      ...inFilterToQuery("friendlyStatus", options.filter?.friendlyStatus),
      ...inFilterToQuery("billingId", options.filter?.billingId),
      ...inFilterToQuery("format", options.filter?.format),
      // ...inFilterToQuery("finish", options.filter?.finish),
      ...dateFilterToQuery("createdAt", options.filter?.createdAt),
      ...inFilterToQuery("csvOrderId", options.filter?.csvId),
      ...equalsFilterToQuery("batchId", options.filter?.batchId),
    };

    if (typeof options.filter?.isBillable === "boolean") {
      params = {
        ...params,
        "filter.isBillable": `$eq:${options.filter.isBillable}`,
      };
    }

    if (typeof options.filter?.anonymizedAt === "boolean") {
      params = {
        ...params,
        ...invertedFilterToQuery(
          "anonymizedAt",
          options.filter.anonymizedAt,
          "$null",
          true,
        ),
      };
    } else {
      params = {
        ...params,
        ...dateFilterToQuery("anonymizedAt", options.filter?.anonymizedAt),
      };
    }

    const data = await this.client.GET<IPaginatedResponse<IOrder>>(basePath, {
      params,
    });

    return PaginatedResponse.safe(
      this.protected,
      data,
      (data) => new Order(this.protected, data),
    );
  }

  /**
   * Create a batch
   * @param data The batch data
   */
  public async createBatch(data: CreateBatch): Promise<Batch> {
    const ready =
      data.ready instanceof Date ? data.ready.toISOString() : data.ready;
    const templateId =
      typeof data.template === "string" ? data.template : data.template.id;

    const response = await this.client.POST<IBatch>("batches", {
      name: data.name,
      billingId: data.billingId,
      templateId: templateId,
      finish: data.finish,
      ready: ready ? ready : null,
      sender: data.sender,
    });

    return new Batch(this.protected, response);
  }

  /**
   * Get a batch by its id.
   * @param { string } id The id of the batch.
   * @throws { PrintOneError } If the batch could not be found.
   */
  public async getBatch(id: string): Promise<Batch> {
    const data = await this.client.GET<IBatch>(`batches/${id}`);

    return new Batch(this.protected, data);
  }

  /**
   * Get all batches.
   * @param { PaginationOptions } options The options to use for pagination
   * @param options.limit The maximum amount of batches to return.
   * @param options.page The page to return.
   * @param options.sortBy The fields to sort by, can be "createdAt", "updatedAt".
   * @param options.filter The filters to apply.
   * @throws { PrintOneError } If the batch could not be found.
   */
  public async getBatches(
    options: PaginationOptions<
      "createdAt" | "updatedAt" | "billingId" | "sendDate" | "name"
    > & {
      filter?: {
        billingId?: InFilter;
        name?: InFilter;
        createdAt?: DateFilter;
        updatedAt?: DateFilter;
        sendDate?: DateFilter | boolean;
        finish?: InFilter;
        templates?: InFilter<string | Template>;
        format?: InFilter;
        status?: InFilter<BatchStatus>;
        isBillable?: boolean;
      };
    } = {},
  ): Promise<PaginatedResponse<Batch>> {
    let params = {
      ...sortToQuery(options),
      ...inFilterToQuery("billingId", options.filter?.billingId),
      ...inFilterToQuery("name", options.filter?.name),
      ...dateFilterToQuery("createdAt", options.filter?.createdAt),
      ...dateFilterToQuery("updatedAt", options.filter?.updatedAt),
      ...inFilterToQuery("finish", options.filter?.finish),
      ...inFilterToQuery("format", options.filter?.format),
      ...inFilterToQuery(
        "status",
        mapInFilter(options.filter?.status, (v) => v.toUpperCase()),
      ),
    };

    if (typeof options.filter?.isBillable === "boolean") {
      params = {
        ...params,
        "filter.isBillable": `$eq:${options.filter.isBillable}`,
      };
    }

    if (options.filter?.templates) {
      if (!Array.isArray(options.filter.templates)) {
        options.filter.templates = [options.filter.templates];
      }

      params = {
        ...params,
        ...inFilterToQuery(
          "templateId",
          options.filter.templates.map((template) =>
            typeof template === "string" ? template : template.id,
          ),
        ),
      };
    }

    if (typeof options.filter?.sendDate === "boolean") {
      params = {
        ...params,
        ...invertedFilterToQuery(
          "sendDate",
          options.filter.sendDate,
          "$null",
          true,
        ),
      };
    } else {
      params = {
        ...params,
        ...dateFilterToQuery("sendDate", options.filter?.sendDate),
      };
    }

    const data = await this.client.GET<IPaginatedResponse<IBatch>>("batches", {
      params: params,
    });

    return PaginatedResponse.safe(
      this.protected,
      data,
      (data) => new Batch(this.protected, data),
    );
  }

  /**
   * Create a coupon
   * @param data The coupon data
   */
  public async createCoupon(data: CreateCoupon): Promise<Coupon> {
    const response = await this.client.POST<ICoupon>("coupons", {
      name: data.name,
    });

    return new Coupon(this.protected, response);
  }

  /**
   * Get all coupons.
   * @param { PaginationOptions } options The options to use for pagination
   * @param options.limit The maximum amount of coupons to return.
   * @param options.page The page to return.
   * @param options.sortBy The fields to sort by, can be "createdAt", "updatedAt".
   * @param options.filter The filters to apply.
   */
  public async getCoupons(
    options: PaginationOptions<"name"> & {
      filter?: {
        name?: InFilter;
        createdAt?: DateFilter;
      };
    } = {},
  ): Promise<PaginatedResponse<Coupon>> {
    const params = {
      ...sortToQuery(options),
      ...inFilterToQuery("name", options.filter?.name),
    };

    const data = await this.client.GET<IPaginatedResponse<ICoupon>>("coupons", {
      params: params,
    });

    return PaginatedResponse.safe(
      this.protected,
      data,
      (data) => new Coupon(this.protected, data),
    );
  }

  /**
   * Get a coupon by its id.
   * @param { string } id The id of the coupon.
   * @throws { PrintOneError } If the coupon could not be found.
   */
  public async getCoupon(id: string): Promise<Coupon> {
    const data = await this.client.GET<ICoupon>(`coupons/${id}`);

    return new Coupon(this.protected, data);
  }

  public isValidWebhook(
    body: string,
    headers: Record<string, string>,
    secret: string,
  ): boolean {
    const hmacHeader = headers["x-webhook-hmac-sha256"];

    const hmac = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("base64");

    return hmac === hmacHeader;
  }

  public validateWebhook(
    body: string,
    headers: Record<string, string>,
    secret: string,
  ): WebhookRequest {
    if (!this.isValidWebhook(body, headers, secret)) {
      throw new Error("Invalid webhook");
    }

    const webhook = JSON.parse(body) as IWebhookRequest;
    return webhookRequestFactory(this.protected, webhook);
  }

  public async getWebhooks(): Promise<PaginatedResponse<Webhook>> {
    const data =
      await this.client.GET<IPaginatedResponse<IWebhook>>("webhooks");

    return PaginatedResponse.safe(
      this.protected,
      data,
      (data) => new Webhook(this.protected, data),
    );
  }

  public async getWebhook(id: string): Promise<Webhook> {
    const data = await this.client.GET<IWebhook>(`webhooks/${id}`);

    return new Webhook(this.protected, data);
  }

  public async createWebhook(data: CreateWebhook): Promise<Webhook> {
    const response = await this.client.POST<IWebhook>("webhooks", {
      name: data.name,
      url: data.url,
      events: data.events,
      active: data.active,
      headers: data.headers,
      secretHeaders: data.secretHeaders,
    });

    return new Webhook(this.protected, response);
  }

  public async getWebhookSecret(): Promise<string> {
    const data = await this.client.POST<{
      secret: string;
    }>(`webhooks/secret`, {});

    return data.secret;
  }
}
