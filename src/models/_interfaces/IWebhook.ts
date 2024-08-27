import { WebhookEvent } from "~/enums/WebhookEvent";

export type IWebhook = {
  id: string;
  name: string;
  events: WebhookEvent[];
  active: boolean;
  headers: Record<string, string>;
  secretHeaders: Record<string, string>;
  url: string;
  successRate: number | null;
};

export type CreateWebhook = Omit<
  IWebhook,
  "id" | "headers" | "secretHeaders" | "successRate"
> & {
  headers?: Record<string, string>;
  secretHeaders?: Record<string, string>;
};
