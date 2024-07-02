import {
  IBatchStatusUpdateWebhookRequest,
  IOrderStatusUpdateWebhookRequest,
  ITemplatePreviewRenderedWebhookRequest,
  IWebhookRequest,
} from "~/models/_interfaces/IWebhookRequest";
import { Batch } from "~/models/Batch";
import { Order } from "~/models/Order";
import { Protected } from "~/PrintOne";
import { PreviewDetails } from "~/models/PreviewDetails";

abstract class AbstractWebhookRequest<T, E extends IWebhookRequest> {
  constructor(
    protected readonly _protected: Protected,
    protected _data: E,
  ) {}

  abstract data: T;

  get event(): E["event"] {
    return this._data.event;
  }

  get createdAt(): Date {
    return new Date(this._data.createdAt);
  }
}

export type WebhookRequest =
  | OrderStatusUpdateWebhookRequest
  | TemplatePreviewRenderedWebhookRequest
  | BatchStatusUpdateWebhookRequest;

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
    default:
      throw new Error(`Unknown webhook event: ${event}`);
  }
}

export class OrderStatusUpdateWebhookRequest extends AbstractWebhookRequest<
  Order,
  IOrderStatusUpdateWebhookRequest
> {
  get data(): Order {
    return new Order(this._protected, this._data.data);
  }
}

export class TemplatePreviewRenderedWebhookRequest extends AbstractWebhookRequest<
  PreviewDetails,
  ITemplatePreviewRenderedWebhookRequest
> {
  get data(): PreviewDetails {
    return new PreviewDetails(this._protected, this._data.data);
  }
}

export class BatchStatusUpdateWebhookRequest extends AbstractWebhookRequest<
  Batch,
  IBatchStatusUpdateWebhookRequest
> {
  get data(): Batch {
    return new Batch(this._protected, this._data.data);
  }
}
