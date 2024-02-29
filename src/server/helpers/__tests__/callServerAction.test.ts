import { ExpectedServerActionError } from "@/server/helpers/ExpectedServerActionError";
import callServerAction from "@/server/helpers/callServerAction";

const functionWithNoData = async () => {};
const functionWithInput = async (data: string) => {};
const functionWithInputAndReturn = async (data: string) => {
  return data;
};
const functionWithReturn = async () => {
  return "test";
};
const functionThatThrowsUnexpected = async () => {
  throw new Error("Test error");
};
const functionThatThrowsExpected = async () => {
  throw new ExpectedServerActionError("Test error");
};
describe("callServerAction", () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  it("should call the function with no data", async () => {
    const res = await callServerAction(functionWithNoData, undefined);
    expect(res).toEqual({
      message: "ok",
      success: true,
    });
  });

  it("should call the function with input", async () => {
    const res = await callServerAction(functionWithInput, "test");
    expect(res).toEqual({
      message: "ok",
      success: true,
    });
  });

  it("should call the function with input and return", async () => {
    const res = await callServerAction(functionWithInputAndReturn, "test");
    expect(res).toEqual({
      message: "ok",
      success: true,
      data: "test",
    });
  });

  it("should call the function with return", async () => {
    const res = await callServerAction(functionWithReturn, undefined);
    expect(res).toEqual({
      message: "ok",
      success: true,
      data: "test",
    });
  });

  it("should call the function that throws unexpected", async () => {
    const res = await callServerAction(functionThatThrowsUnexpected, undefined);
    expect(res).toEqual({
      message: "An unexpected error occurred",
      success: false,
    });
  });

  it("should call the function that throws expected", async () => {
    const res = await callServerAction(functionThatThrowsExpected, undefined);
    expect(res).toEqual({
      message: "Test error",
      success: false,
    });
  });
});
