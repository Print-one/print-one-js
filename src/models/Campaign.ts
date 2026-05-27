import { Address } from "~/models/Address";
import { Model } from "~/Model";
import {
  IContinuousDestination,
  IOneOffDestination,
} from "./_interfaces/IDestination";
import { CampaignScheduleType } from "~/enums/CampaignScheduleType";
import { ICampaign } from "./_interfaces/ICampaign";
import { CampaignStatus } from "~/enums/CampaignStatus";
import { ContinuousDestination, OneOffDestination } from "./Destination";
import { Protected, UnsafeCreationContext } from "~/types";
import { Design } from "./Design";
import { IDesign } from "./_interfaces/IDesign";
import { PaginatedResponseV3, ResponseV3 } from "./Response.v3";
import { IPaginatedResponseV3, IResponseV3 } from "./_interfaces/IResponse.v3";
import { Destination } from "~/enums/Destination";
import { CampaignItem, CreateCampaignItem } from "./CampaignItem";
import { ICampaignItem } from "./_interfaces/ICampaignItem";
import {
  DateFilter,
  dateFilterToQuery,
  equalsFilterToQuery,
  InFilter,
  inFilterToQuery,
  PaginationOptions,
  sortToQuery,
} from "~/utils";
import { CsvStatus, Finish, Format, FriendlyStatus } from "..";
import { ICampaignImport } from "./_interfaces/ICampaignImport";
import { CampaignImport, CreateCampaignImport } from "./CampaignImport";

export type UpdateCampaign = {
  name?: string;
  sender?: Address | null;
  npdrCategory?: string;
  /**
   * Discards the existing metadata
   */
  meta?: Record<string, unknown>;
};

export type ItemPaginatedQuery = PaginationOptions<
  "createdAt" | "anonymizedAt" | "updatedAt" | "friendlyStatus" | "sendDate"
> & {
  filter: {
    draft: boolean;
    friendlyStatus?: InFilter<FriendlyStatus>;
    format?: InFilter<Format>;
    finish?: InFilter<Finish>;
    billingId?: InFilter<string>;
    anonymizedAt?: DateFilter;
    importId?: InFilter<string>;
    destination?: InFilter<Destination>;
    createdAt?: DateFilter;
  };
};

export type ImportPaginatedQuery = PaginationOptions<
  "createdAt" | "status" | "originSource"
> & {
  filter?: {
    createdAt?: DateFilter;
    status?: InFilter<CsvStatus>;
    importId?: InFilter<string>;
    draft?: boolean;
  };
};

export class Campaign extends Model<ICampaign> {
  private _destinations: ContinuousDestination[] | OneOffDestination[] = [];
  private _designs: Design[] = [];
  private _designsLoaded: boolean = false;

  constructor(
    protected _protected: Protected,
    _data: ICampaign,
  ) {
    super(_protected, _data);
    this.destinations = _data.destinations;
  }

  /** @internal */
  public static createUnsafe(
    ctx: UnsafeCreationContext,
    campaignId: string,
  ): Campaign {
    // @ts-expect-error - We know the _protected is protected, but as an internal method we can access it just fine
    return new Campaign(ctx._protected, { id: campaignId } as ICampaign);
  }

  public get id(): string {
    return this._data.id;
  }

  public get identifier(): string {
    return this._data.identifier;
  }

  public get name(): string {
    return this._data.name;
  }

  public get description(): string | null {
    return this._data.description;
  }

  public get meta(): object | null {
    return this._data.meta;
  }

  public get mergeVariables(): string[] {
    return this._data.mergeVariables;
  }

  public get scheduleType(): CampaignScheduleType {
    return this._data.scheduleType;
  }

  public get stampId(): string | null {
    return this._data.stampId;
  }

  public get sender(): Address | null {
    return this._data.sender;
  }

  public get billingId(): string | null {
    return this._data.billingId;
  }

  public get status(): CampaignStatus {
    return this._data.status;
  }

  public get npdrCategory(): string | undefined {
    return this._data.npdrCategory;
  }

  public get createdAt(): Date {
    return new Date(this._data.createdAt);
  }

  public get updatedAt(): Date {
    return new Date(this._data.updatedAt);
  }

  public get destinations(): ContinuousDestination[] | OneOffDestination[] {
    return this._destinations;
  }

  private set destinations(
    destinations: IContinuousDestination[] | IOneOffDestination[],
  ) {
    switch (this.scheduleType) {
      case CampaignScheduleType.CONTINUOUS:
        this._destinations = destinations.map(
          (d) => new ContinuousDestination(this._protected, d, this.id),
        );
        break;
      case CampaignScheduleType.ONE_OFF:
        this._destinations = destinations.map(
          (d) =>
            new OneOffDestination(
              this._protected,
              d as IOneOffDestination,
              this.id,
            ),
        );
        break;
    }
  }

  public get designs(): Design[] {
    return this._designs;
  }

  /**
   * Load all the Designs in this campaign. Accessible via campaign.designs after loading.
   * @throws { PrintOneError } If the designs could not be loaded
   * @returns { Promise<void> }
   */
  public async loadDesigns(): Promise<void> {
    const newDesigns: Design[] = [];

    const data = await this._protected.clientV3.GET<
      IPaginatedResponseV3<IDesign>
    >(`campaigns/${this.id}/designs`);

    let response = PaginatedResponseV3.safe(
      this._protected,
      data,
      (d) => new Design(this._protected, d, this.id),
    );

    newDesigns.push(...response.data);

    while (true) {
      const next = await response.next();
      if (!next) break;

      response = next;
      newDesigns.push(...response.data);
    }

    this._designsLoaded = true;
    this._designs = newDesigns;
  }

  /**
   * Add variable fallbacks to the campaign's destinations.
   * NOT merging with existing fallbacks, so be sure to include all desired fallbacks for all destinations.
   * @param variablesFallback A record of destination to variable fallbacks
   * @throws { PrintOneError } If the variable fallbacks could not be added
   * @returns { Promise<void> } Updates the destinations in place
   */
  public async addVariablesFallback(
    variablesFallback: Partial<
      Record<Destination, Record<string, string> | null>
    >,
  ): Promise<void> {
    const response = await this._protected.clientV3.PATCH<
      IResponseV3<{
        fallbacks: Partial<
          Record<Destination, { values: Record<string, string> }>
        >;
      }>
    >(`campaigns/${this.id}/variable-fallback`, { variablesFallback });
    const data = ResponseV3.safe(this._protected, response, (d) => d);

    for (const dest of this._destinations) {
      const fallback = data.fallbacks[dest.destination];
      if (fallback) {
        dest.variablesFallback = fallback.values;
      }
    }
  }

  public async pause(): Promise<void> {
    const response = await this._protected.clientV3.POST<
      IResponseV3<ICampaign>
    >(`campaigns/${this.id}/pause`, {});
    await this._refresh(response);
  }

  public async resume(): Promise<void> {
    const response = await this._protected.clientV3.POST<
      IResponseV3<ICampaign>
    >(`campaigns/${this.id}/resume`, {});
    await this._refresh(response);
  }

  /**
   * Refresh the Campaign
   * @throws { PrintOneError } If the campaign could not be refreshed.
   */
  public async refresh(): Promise<void> {
    const response = await this._protected.clientV3.GET<IResponseV3<ICampaign>>(
      `campaigns/${this.id}`,
    );
    await this._refresh(response);
  }

  private async _refresh(response: IResponseV3<ICampaign>): Promise<void> {
    this._data = response.data;
    this.destinations = response.data.destinations;

    if (this._designsLoaded) {
      await this.loadDesigns();
    }
  }

  /**
   * @internal
   * @returns The created import, this return type fill change as the v3 import works differently than the v2 import, but for now it returns the plain data.
   */
  public async createImport(
    data: CreateCampaignImport,
  ): Promise<CampaignImport> {
    const formData = new FormData();
    formData.append(
      "file",
      new Blob([new Uint8Array(data.file)], { type: "text/csv" }),
      "upload.csv",
    );
    formData.append("mapping", JSON.stringify(data.mapping));

    const queryParams = {
      scheduleId: data.__source?.scheduleId,
      originSource: data.__source?.integrationType,
      originId: data.__source?.integrationId,
      draft: data.draft?.toString() ?? "true",
    };

    const queryString = new URLSearchParams(
      Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(queryParams).filter(([_, v]) => v) as [string, string][],
      ),
    ).toString();

    const response = await this._protected.clientV3.POST<
      ResponseV3<Pick<CampaignImport, "id">>
    >(`/campaigns/${this.id}/imports?${queryString}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const id = response.data.id;
    const importData = await this._protected.clientV3.GET<
      ResponseV3<ICampaignImport>
    >(`/campaigns/${this.id}/imports/${id}`);

    return new CampaignImport(this._protected, importData.data);
  }

  /** Get all imports for the campaign */
  public async getImports(
    args: ImportPaginatedQuery,
  ): Promise<PaginatedResponseV3<CampaignImport>> {
    const params = {
      ...sortToQuery(args),
      ...dateFilterToQuery("createdAt", args.filter?.createdAt),
      ...inFilterToQuery("status", args.filter?.status),
      ...inFilterToQuery("importId", args.filter?.importId),
      ...equalsFilterToQuery("draft", args.filter?.draft?.toString()),
    };

    const data = await this._protected.clientV3.GET<
      IPaginatedResponseV3<ICampaignImport>
    >(`campaigns/${this.id}/imports`, {
      params,
    });

    return PaginatedResponseV3.safe(
      this._protected,
      data,
      (d) => new CampaignImport(this._protected, d),
    );
  }

  /** Get a specific import from the campaign */
  public async getImport(id: string): Promise<CampaignImport> {
    const data = await this._protected.clientV3.GET<
      IResponseV3<ICampaignImport>
    >(`campaigns/${this.id}/imports/${id}`);

    return new CampaignImport(this._protected, data.data);
  }

  /**
   * Create a new item in the campaign
   * @param item The item to be created
   * @throws { PrintOneError } If the item could not be created.
   */
  public async addItem(item: CreateCampaignItem): Promise<CampaignItem> {
    const data = await this._protected.clientV3.POST<
      IResponseV3<ICampaignItem>
    >(`campaigns/${this.id}/items`, {
      recipient: item.recipient,
      mergeVariables: item.mergeVariables,
      sendDate: item.sendDate,
      draft: item.draft,
      metadata: item.metadata,
    });

    return new CampaignItem(this._protected, data.data);
  }

  /**
   * Get a specific item in the campaign by its id
   * @param id The id of the item to be retrieved
   * @returns The item with the specified id
   * @throws { PrintOneError } If the item could not be found.
   */
  public async getItem(id: string): Promise<CampaignItem> {
    const data = await this._protected.clientV3.GET<IResponseV3<ICampaignItem>>(
      `campaigns/${this.id}/items/${id}`,
    );

    return new CampaignItem(this._protected, data.data);
  }

  /**
   * Get all items in the campaign
   */
  public async getItems(
    args: ItemPaginatedQuery,
  ): Promise<PaginatedResponseV3<CampaignItem>> {
    const params = {
      ...sortToQuery(args),
      ...equalsFilterToQuery("draft", args.filter.draft.toString()),
      ...inFilterToQuery("destination", args.filter.destination),
      ...inFilterToQuery("friendlyStatus", args.filter.friendlyStatus),
      ...inFilterToQuery("format", args.filter.format),
      ...inFilterToQuery("finish", args.filter.finish),
      ...inFilterToQuery("billingId", args.filter.billingId),
      ...inFilterToQuery("importId", args.filter.importId),
      ...dateFilterToQuery("anonymizedAt", args.filter.anonymizedAt),
      ...dateFilterToQuery("createdAt", args.filter.createdAt),
    };

    const data = await this._protected.clientV3.GET<
      IPaginatedResponseV3<ICampaignItem>
    >(`campaigns/${this.id}/items`, {
      params,
    });

    return PaginatedResponseV3.safe(
      this._protected,
      data,
      (d) => new CampaignItem(this._protected, d),
    );
  }
}
