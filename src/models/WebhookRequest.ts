import {
  IWebhookRequest,
  IWebhookBody,
  IWebhookBaseRequest,
} from "~/models/_interfaces/IWebhookRequest";
import { Batch } from "~/models/Batch";
import { Order } from "~/models/Order";
import { Protected } from "~/PrintOne";
import { PreviewDetails } from "~/models/PreviewDetails";
import { CouponCode } from "~/models/CouponCode";
import { Model } from "~/Model";

abstract class AbstractWebhookRequest<
  T,
  E extends keyof IWebhookBody,
> extends Model<IWebhookBaseRequest<E>> {
  abstract data: T;

  get event(): IWebhookBaseRequest<E>["event"] {
    return this._data.event;
  }

  get createdAt(): Date {
    return new Date(this._data.createdAt);
  }
}

export type WebhookRequest =
  | OrderStatusUpdateWebhookRequest
  | TemplatePreviewRenderedWebhookRequest
  | BatchStatusUpdateWebhookRequest
  | CouponCodeUsedWebhookRequest
  | QrCodeScannedWebhookRequest;

export function webhookRequestFactory(
  _protected: Protected,
  data: IWebhookRequest,
): WebhookRequest {
  const event = data.event;

  switch (event) {
    case "order_status_update":
      return new OrderStatusUpdateWebhookRequest(_protected, data);
    case "template_preview_rendered":
      return new TemplatePreviewRenderedWebhookRequest(_protected, data);
    case "batch_status_update":
      return new BatchStatusUpdateWebhookRequest(_protected, data);
    case "coupon_code_used":
      return new CouponCodeUsedWebhookRequest(_protected, data);
    case "qr_code_scanned":
      return new QrCodeScannedWebhookRequest(_protected, data);
    default:
      throw new Error(`Unknown webhook event: ${event}`);
  }
}

export class OrderStatusUpdateWebhookRequest extends AbstractWebhookRequest<
  Order,
  "order_status_update"
> {
  get data(): Order {
    return new Order(this._protected, this._data.data);
  }
}

export class TemplatePreviewRenderedWebhookRequest extends AbstractWebhookRequest<
  PreviewDetails,
  "template_preview_rendered"
> {
  get data(): PreviewDetails {
    return new PreviewDetails(this._protected, this._data.data);
  }
}

export class BatchStatusUpdateWebhookRequest extends AbstractWebhookRequest<
  Batch,
  "batch_status_update"
> {
  get data(): Batch {
    return new Batch(this._protected, this._data.data);
  }
}

export class CouponCodeUsedWebhookRequest extends AbstractWebhookRequest<
  CouponCode,
  "coupon_code_used"
> {
  get data(): CouponCode {
    return new CouponCode(this._protected, this._data.data);
  }
}

export class QrCodeScannedWebhookRequest extends AbstractWebhookRequest<
  Order,
  "qr_code_scanned"
> {
  get data(): Order {
    return new Order(this._protected, this._data.data);
  }
}
