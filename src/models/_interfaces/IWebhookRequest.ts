import { IBatch } from "~/models/_interfaces/IBatch";
import { IOrder } from "~/models/_interfaces/IOrder";
import { IPreviewDetails } from "~/models/_interfaces/IPreviewDetails";
import { ICouponCode } from "~/models/_interfaces/ICouponCode";

export type IWebhookRequest =
  | IOrderStatusUpdateWebhookRequest
  | ITemplatePreviewRenderedWebhookRequest
  | IBatchStatusUpdateWebhookRequest
  | ICouponCodeUsedWebhookRequest;

type IWebhookBaseRequest<TEvent extends string, TData> = {
  data: TData;
  event: TEvent;
  createdAt: string;
};

export type IOrderStatusUpdateWebhookRequest = IWebhookBaseRequest<
  "order_status_update",
  IOrder
>;
export type ITemplatePreviewRenderedWebhookRequest = IWebhookBaseRequest<
  "template_preview_rendered",
  IPreviewDetails
>;
export type IBatchStatusUpdateWebhookRequest = IWebhookBaseRequest<
  "batch_status_update",
  IBatch
>;
export type ICouponCodeUsedWebhookRequest = IWebhookBaseRequest<
  "coupon_code_used",
  ICouponCode
>;
