import { Company } from "./models/Company";
import debug from "debug";
import { HttpHandler } from "./HttpHandler";
import { ICompany } from "./models/_interfaces/ICompany";
import {
  ContainsFilter,
  containsFilterToQuery,
  DateFilter,
  dateFilterToQuery,
  InFilter,
  inFilterToQuery,
  invertedFilterToQuery,
  PaginationOptions,
  sortToQuery,
} from "./utils";
import { IPaginatedResponse } from "./models/_interfaces/IPaginatedResponse";
import { ICustomFile } from "./models/_interfaces/ICustomFile";
import { PaginatedResponse } from "./models/PaginatedResponse";
import { CustomFile } from "./models/CustomFile";
import { ITemplate } from "./models/_interfaces/ITemplate";
import { CreateTemplate, Template } from "./models/Template";
import { CreateOrder, Order } from "./models/Order";
import { IOrder } from "./models/_interfaces/IOrder";
import { FriendlyStatus } from "./enums/Status";
import { Format } from "./enums/Format";
import { AxiosHTTPHandler } from "./AxiosHttpHandler";

export type RequestHandler = new (
  token: string,
  options: Required<PrintOneOptions>,
  debug: debug.Debugger,
) => HttpHandler<unknown, unknown>;

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

export type Protected = {
  client: HttpHandler<unknown, unknown>;
  options: Required<PrintOneOptions>;
  debug: debug.Debugger;
  printOne: PrintOne;
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

  protected get debug(): debug.Debugger {
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
   */
  public async createOrder(data: CreateOrder): Promise<Order> {
    const templateId =
      typeof data.template === "string" ? data.template : data.template.id;
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

  /**
   * Get an order by its id.
   * @param { string } id The id of the order.
   * @throws { PrintOneError } If the order could not be found.
   */
  public async getOrder(id: string): Promise<Order> {
    const data = await this.client.GET<IOrder>(`orders/${id}`);

    return new Order(this.protected, data);
  }

  /**
   * Get all orders.
   * @param { PaginationOptions } options The options to use for pagination
   * @param options.limit The maximum amount of orders to return.
   * @param options.page The page to return.
   * @param options.sortBy The fields to sort by, can be "createdAt", "anonymizedAt", "updatedAt", "friendlyStatus", "sendDate".
   * @param options.filter The filters to apply.
   * @throws { PrintOneError } If the order could not be found.
   */
  public async getOrders(
    options: PaginationOptions<
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
      };
    } = {},
  ): Promise<PaginatedResponse<Order>> {
    let params = {
      ...sortToQuery(options),
      ...inFilterToQuery("friendlyStatus", options.filter?.friendlyStatus),
      ...inFilterToQuery("billingId", options.filter?.billingId),
      ...inFilterToQuery("format", options.filter?.format),
      // ...inFilterToQuery("finish", options.filter?.finish),
      ...dateFilterToQuery("createdAt", options.filter?.createdAt),
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

    const data = await this.client.GET<IPaginatedResponse<IOrder>>("orders", {
      params,
    });

    return PaginatedResponse.safe(
      this.protected,
      data,
      (data) => new Order(this.protected, data),
    );
  }
}
