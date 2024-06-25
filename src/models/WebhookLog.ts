import { Protected } from "~/PrintOne";
import {
  IWebhookLog,
  IWebhookLogResponse,
} from "~/models/_interfaces/IWebhookLog";
import { WebhookEvent } from "~/enums/WebhookEvent";
import { WebhookRequest, webhookRequestFactory } from "~/models/WebhookRequest";

export class WebhookLog {
  constructor(
    private readonly _protected: Protected,
    private _data: IWebhookLog,
  ) {}

  public get id(): string {
    return this._data.id;
  }

  public get status(): "success" | "failed" {
    return this._data.status;
  }

  public get event(): WebhookEvent {
    return this._data.event;
  }

  public get request(): WebhookRequest {
    return webhookRequestFactory(this._protected, this._data.request);
  }

  public get response(): IWebhookLogResponse {
    return this._data.response;
  }

  public get createdAt(): Date {
    return new Date(this._data.createdAt);
  }
}
