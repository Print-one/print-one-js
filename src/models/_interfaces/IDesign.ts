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
  updatedAt?: Date;
  destination: Destination;
};

export type IFullDesign = IDesign & {
  pages: IDesignPage[];
  serializedHelperCalls: ISerializedHelperCall[];
};

export type IDesignPage = {
  content: string;
  friendlyName: string;
  orderingKey: number;
};

export type ISerializedHelperCall = Record<string, unknown>;
