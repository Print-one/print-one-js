import { IBatch } from "~/models/_interfaces/IBatch";
import { IOrder } from "~/models/_interfaces/IOrder";
import { IPreviewDetails } from "~/models/_interfaces/IPreviewDetails";

export type IWebhookRequest =
  | IOrderStatusUpdateWebhookRequest
  | ITemplatePreviewRenderedWebhookRequest
  | IBatchStatusUpdateWebhookRequest;

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

export type IBatchStatusUpdateWebhookRequest = {
  data: IBatch;
  event: "batch_status_update";
  createdAt: string;
};
