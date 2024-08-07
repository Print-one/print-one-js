export const WebhookEvent = {
  order_status_update: "order_status_update",
  template_preview_rendered: "template_preview_rendered",
  batch_status_update: "batch_status_update",
  coupon_code_used: "coupon_code_used",
} as const;

export type WebhookEvent = (typeof WebhookEvent)[keyof typeof WebhookEvent];
