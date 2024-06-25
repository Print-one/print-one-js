import { WebhookEvent } from "~/enums/WebhookEvent";
import { IWebhookRequest } from "~/models/_interfaces/IWebhookRequest";

export type IWebhookLog = {
  id: string;
  status: "success" | "failed";
  event: WebhookEvent;
  request: IWebhookRequest;
  response: IWebhookLogResponse;
  createdAt: string;
};

export type IWebhookLogResponse = {
  status: number;
  body: string;
};
