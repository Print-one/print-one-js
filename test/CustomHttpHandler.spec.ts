import PrintOne, { Batch, CustomFile, Preview, Protected } from "../src";
import { HttpHandler } from "../src/HttpHandler";
import { IBatch } from "../src/models/_interfaces/IBatch";

class CustomHttpHandler extends HttpHandler<unknown, unknown> {
  public override GET<T>(): Promise<T> {
    return Promise.reject(new Error("Custom GET request handler"));
  }
  public override GETBuffer(): Promise<Uint8Array> {
    return Promise.reject(new Error("Custom GETBuffer request handler"));
  }
  public override PATCH<T>(): Promise<T> {
    return Promise.reject(new Error("Custom PATCH request handler"));
  }
  public override POST<T>(): Promise<T> {
    return Promise.reject(new Error("Custom POST request handler"));
  }
  public override DELETE<T>(): Promise<T> {
    return Promise.reject(new Error("Custom DELETE request handler"));
  }
}

class TestPrintOne extends PrintOne {
  public get protected(): Protected {
    return super.protected;
  }
}

describe("custom HttpHandler is used when provided to PrintOne instance", () => {
  let printOne: TestPrintOne;

  beforeEach(() => {
    printOne = new TestPrintOne("some-magic-token", {
      client: CustomHttpHandler,
    });
  });

  it("custom GET method should be called", async () => {
    await expect(printOne.getSelf()).rejects.toThrow(
      "Custom GET request handler",
    );
  });

  it("custom GETBuffer method should be called", async () => {
    const customFile = new Preview(printOne.protected, {
      detailsUrl: "",
      orderingKey: 1,
      url: "",
    });
    await expect(customFile.download()).rejects.toThrow(
      "Custom GETBuffer request handler",
    );
  });

  it("custom POST method should be called", async () => {
    await expect(
      printOne.createTemplate({
        format: "GREETINGCARD_SQ14",
        name: "test",
        pages: ["", ""],
      }),
    ).rejects.toThrow("Custom POST request handler");
  });

  it("custom DELETE method should be called", async () => {
    const customFile = new CustomFile(printOne.protected, {
      createdAt: new Date().toISOString(),
      fileExtension: "png",
      fileName: "test",
      id: "",
      size: 1000,
    });
    await expect(customFile.delete()).rejects.toThrow(
      "Custom DELETE request handler",
    );
  });

  it("custom PATCH method should be called", async () => {
    const batch = new Batch(printOne.protected, {} as unknown as IBatch);
    await expect(
      batch.update({
        ready: true,
      }),
    ).rejects.toThrow("Custom PATCH request handler");
  });
});
