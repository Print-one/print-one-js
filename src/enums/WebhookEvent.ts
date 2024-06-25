export const WebhookEvent = {
  order_status_update: "order_status_update",
  template_preview_rendered: "template_preview_rendered",
} as const;

export type WebhookEvent = (typeof WebhookEvent)[keyof typeof WebhookEvent];
