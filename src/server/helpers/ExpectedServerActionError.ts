/**
 * Custom error class for expected server action errors such as validation errors. The error message will be propagated directly to the client.
 */
export class ExpectedServerActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExpectedServerActionError";
  }
}
