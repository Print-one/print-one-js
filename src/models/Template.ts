import { Protected } from "~/PrintOne";
import { IFullTemplate, ITemplate } from "~/models/_interfaces/ITemplate";
import { Format } from "~/enums/Format";
import { IPreview } from "~/models/_interfaces/IPreview";
import { Preview } from "~/models/Preview";

export type CreateTemplate = {
  name: string;
  format: Format;
  labels?: string[];
  pages: string[];
};

export class Template {
  private _data: IFullTemplate | ITemplate;
  private _loaded?: IFullTemplate;

  constructor(
    private readonly _protected: Protected,
    _data: ITemplate | IFullTemplate,
  ) {
    this._data = _data;
    if (_data.pages) this._loaded = _data as IFullTemplate;
  }

  public get id(): string {
    return this._data.id;
  }

  public get name(): string {
    return this._data.name;
  }

  public get format(): Format {
    return this._data.format as Format;
  }

  public get labels(): string[] {
    return this._data.labels;
  }

  public get mergeVariables(): string[] {
    return this._data.mergeVariables;
  }

  public get thumbnail(): string {
    return this._data.thumbnail;
  }

  public get apiVersion(): number {
    return this._data.apiVersion;
  }

  public get version(): number {
    return this._data.version;
  }

  public get updatedAt(): Date {
    return new Date(this._data.updatedAt);
  }

  /**
   * Load the full template, this includes the pages
   * @throws { PrintOneError } When the template could not be loaded
   */
  public async load(): Promise<void> {
    const data = await this._protected.client.GET<IFullTemplate>(
      "templates/" + this.id,
    );
    this._data = data;
    this._loaded = data;
  }

  /**
   * Get the pages of the template
   *
   * <b>NOTE: This method will throw an error if {@link load} has not been called</b>
   * @throws { Error } When the template is not loaded
   * @returns { ITemplatePage[] } The pages of the template
   */
  public get pages(): string[] {
    if (this._loaded === undefined) throw new Error("Template not loaded");

    return this._loaded.pages.map((page) => page.content);
  }

  /**
   * Preview the template
   * @throws { PrintOneError } When the preview could not be created
   */
  public async preview(
    mergeVariables: Record<string, unknown> = {},
  ): Promise<Preview[]> {
    const data = await this._protected.client.POST<IPreview[]>(
      "templates/preview/" + this.id,
      mergeVariables,
    );

    return data.map((preview) => new Preview(this._protected, preview));
  }

  /**
   * Delete the template
   * @throws { PrintOneError } When the template could not be deleted
   */
  public async delete(): Promise<void> {
    await this._protected.client.DELETE("templates/" + this.id);
  }

  //TODO: Add update method
}
