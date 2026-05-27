import { Destination } from "~/enums/Destination";
import { Finish } from "~/enums/Finish";
import { Format } from "~/enums/Format";

export interface IBaseDestination {
  destination: Destination;
  threshold: number;
  product: Format;
  finish: Finish;
  designId?: string;
  variablesFallback?: Record<string, string | number | boolean>;
}

export type IContinuousDestination = IBaseDestination;

export type IOneOffDestination = IBaseDestination & {
  deliveryWeekIso: number;
  deliveryWeekYear: number;
  asapFallback?: boolean;
};
