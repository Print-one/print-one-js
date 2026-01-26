import { Destination } from "~/enums/Destination";
import { Format } from "~/enums/Format";

export type IDesign = {
  id: string;
  version: number;
  name: string;
  format: Format;
  overlay: string;
  labels: string[];
  mergeVariables: string[];
  thumbnail: string | null;
  apiVersion: number;
  updatedAt: Date;

  campaignId: string;
  destination: Destination;
  default: boolean;

  pages: undefined;
  serializedHelperCalls: undefined;
};

type _FullDesign = {
  pages: IDesignPage[];
  serializedHelperCalls: ISerializedHelperCall[];
};

export type IFullDesign = Omit<IDesign, keyof _FullDesign> & _FullDesign;

export type IDesignPage = {
  content: string;
  friendlyName: string;
  orderingKey: number;
};

export type ISerializedHelperCall = Record<string, unknown>;
