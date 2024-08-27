import { Protected } from "~/PrintOne";
import { IWebhook } from "~/models/_interfaces/IWebhook";
import { WebhookLog } from "~/models/WebhookLog";
import { IWebhookLog } from "~/models/_interfaces/IWebhookLog";
import { WebhookEvent } from "~/enums/WebhookEvent";
import { PaginatedResponse } from "~/models/PaginatedResponse";
import { IPaginatedResponse } from "~/models/_interfaces/IPaginatedResponse";

export class Webhook {
  private _data: IWebhook;

  constructor(
    private readonly _protected: Protected,
    _data: IWebhook,
  ) {
    this._data = _data;
  }

  public get id(): string {
    return this._data.id;
  }

  public get name(): string {
    return this._data.name;
  }

  public get events(): WebhookEvent[] {
    return this._data.events;
  }

  public get active(): boolean {
    return this._data.active;
  }

  public get headers(): Record<string, string> {
    return this._data.headers;
  }

  public get secretHeaders(): Record<string, string> {
    return this._data.secretHeaders;
  }

  public get url(): string {
    return this._data.url;
  }

  public get successRate(): number | null {
    return this._data.successRate;
  }

  public async update(data: Partial<Omit<IWebhook, "id">>): Promise<void> {
    this._data = await this._protected.client.PATCH<IWebhook>(
      `/webhooks/${this.id}`,
      data,
    );
  }

  public async delete(): Promise<void> {
    await this._protected.client.DELETE<void>(`/webhooks/${this.id}`);
  }

  public async getLogs(): Promise<PaginatedResponse<WebhookLog>> {
    const logs = await this._protected.client.GET<
      IPaginatedResponse<IWebhookLog>
    >(`/webhooks/${this.id}/logs`);

    return PaginatedResponse.safe(
      this._protected,
      logs,
      (log) => new WebhookLog(this._protected, log),
    );
  }
}
