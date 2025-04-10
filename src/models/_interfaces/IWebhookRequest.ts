import { IBatch } from "./IBatch";
import { IOrder } from "./IOrder";
import { IPreviewDetails } from "./IPreviewDetails";
import { ICouponCode } from "./ICouponCode";

export type IWebhookBody = {
  order_status_update: IOrder;
  template_preview_rendered: IPreviewDetails;
  batch_status_update: IBatch;
  coupon_code_used: ICouponCode;
  qr_code_scanned: IOrder;
};

export type IWebhookBaseRequest<TEvent extends keyof IWebhookBody> = {
  data: IWebhookBody[TEvent];
  event: TEvent;
  createdAt: string;
};

export type IWebhookRequest = {
  [K in keyof IWebhookBody]: IWebhookBaseRequest<K>;
}[keyof IWebhookBody];
