export class PrintOneError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly messages: string[],
  ) {
    super(messages?.[0]);
    this.name = "PrintOneError";
  }
}
