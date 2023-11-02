export type ITemplate = {
  id: string;
  name: string;
  format: string;
  labels: string[];
  mergeVariables: string[];
  thumbnail: string;
  apiVersion: number;
  version: number;
  updatedAt: string;
  content: undefined;
};

export type ITemplatePage = {
  orderingKey: number;
  content: string;
};

export type IFullTemplate = ITemplate & {
  pages: ITemplatePage[];
};
