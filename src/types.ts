import { HttpHandler } from "~/HttpHandler";
import { PrintOne, PrintOneDebugger, PrintOneOptions } from "~/PrintOne";

export class Protected {
  clientV2: HttpHandler<unknown, unknown>;
  clientV3: HttpHandler<unknown, unknown>;
  options: Required<PrintOneOptions>;
  debug: PrintOneDebugger;
  printOne: PrintOne;

  constructor(
    token: string,
    debug: PrintOneDebugger,
    printOne: PrintOne,
    options: Required<PrintOneOptions>,
  ) {
    this.debug = debug;
    this.printOne = printOne;
    this.options = options;

    this.clientV2 = new this.options.client(
      token,
      {
        ...this.options,
        version: "v2",
      },
      this.debug,
    );
    this.clientV3 = new this.options.client(
      token,
      {
        ...this.options,
        version: "v3",
      },
      this.debug,
    );
  }

  public toJSON(): object {
    return {};
  }
}

export abstract class UnsafeCreationContext {
  protected abstract _protected: Protected;
}
