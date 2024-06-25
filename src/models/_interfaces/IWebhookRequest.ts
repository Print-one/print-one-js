import { IOrder } from "~/models/_interfaces/IOrder";
import { IPreviewDetails } from "~/models/_interfaces/IPreviewDetails";

export type IWebhookRequest =
  | IOrderStatusUpdateWebhookRequest
  | ITemplatePreviewRenderedWebhookRequest;

export type IOrderStatusUpdateWebhookRequest = {
  data: IOrder;
  event: "order_status_update";
  createdAt: string;
};

export type ITemplatePreviewRenderedWebhookRequest = {
  data: IPreviewDetails;
  event: "template_preview_rendered";
  createdAt: string;
};
