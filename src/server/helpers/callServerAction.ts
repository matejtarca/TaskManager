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

/**
 * Calls a server action in a safe way, catching any errors and returning a consistent response.
 * @param action - The server action to call
 * @param data - The data to pass to the server action
 *
 * @returns object - containing the success status, a message (if success is false the message will contain the
 * error message), and the data returned from the server action (if success is true)
 */
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
