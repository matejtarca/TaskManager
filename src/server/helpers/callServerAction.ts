"use server";

import { ExpectedServerActionError } from "@/server/helpers/ExpectedServerActionError";

type ServerActionReturn<TReturn> =
  | {
      message: string;
      success: true;
      data: TReturn;
    }
  | {
      message: string;
      success: false;
    };

const callServerAction = async <TData, TReturn>(
  action: (data: TData) => Promise<TReturn>,
  data: TData,
): Promise<ServerActionReturn<TReturn>> => {
  try {
    const returnedData = await action(data);
    return {
      message: "ok",
      success: true,
      data: returnedData,
    };
  } catch (error) {
    if (error instanceof ExpectedServerActionError) {
      return {
        message: error.message,
        success: false,
      };
    }
    return {
      message: "An unexpected error occurred",
      success: false,
    };
  }
};

export default callServerAction;
