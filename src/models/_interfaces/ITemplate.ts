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
  pages: undefined;
};

type _FullTemplate = {
  pages: ITemplatePage[];
};

export type IFullTemplate = Omit<ITemplate, keyof _FullTemplate> &
  _FullTemplate;

export type ITemplatePage = {
  /**
   * @deprecated Use index of the array instead
   */
  orderingKey: number;
  content: string;
};
