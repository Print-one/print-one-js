import { DeliveryType } from "~/enums/DeliveryType";
import { Destination } from "~/enums/Destination";
import { Finish } from "~/enums/Finish";
import { Format } from "~/enums/Format";
import { MailingStatus } from "~/enums/MailingStatus";

export type IMailingCosts = {
  total: number;
  subtotal: number;
  tax: number;
};

export type IMailing = {
  id: string;

  status: MailingStatus;

  createdAt: string;

  destination: Destination;
  format: Format;
  finish: Finish;

  orderPageCount: number;
  orderCount: number;

  templateId: string;

  overlay: string;
  printingHouseId: string;
  deliveryType: DeliveryType;

  costs: IMailingCosts;
};
