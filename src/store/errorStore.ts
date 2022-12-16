import { StateCreator } from "zustand";
import { CreateToastFnReturn } from "@chakra-ui/react";
import { ServerResponse, PlatformErrorCodes } from "bungie-api-ts/destiny2";
import isInteger from "lodash/isInteger";

export type ErrorStore = {
  _toast: CreateToastFnReturn | undefined,
  apiDisabled: boolean,
  apiThrottle: number, // TODO
  checkApiError: (response: any) => boolean,
  setToast: (toast: CreateToastFnReturn) => void,
  showToast: (description: string, id: string | number, error?: boolean) => void,
}

export const createErrorStore: StateCreator<ErrorStore, any, [], ErrorStore> = (set, get) => ({
  apiDisabled: false,
  _toast: undefined,
  apiThrottle: 0,

  checkApiError: (response: ServerResponse<any>) => {
    console.log("errorStore:checkError", response.ErrorCode, response.ErrorStatus);
    if (get().apiDisabled) {
      return true;
    }

    if (response.ThrottleSeconds !== undefined) {
      console.log("errorStore:checkError throttle", response.ThrottleSeconds);
      set({ apiThrottle: response.ThrottleSeconds });
    }

    if (response.ErrorCode === PlatformErrorCodes.Success && response.Response) {
      return false;
    }

    // Handle a global error event.
    if (response.ErrorCode === PlatformErrorCodes.SystemDisabled) { 
      set({ apiDisabled: true });
      return true;
    }

    get().showToast(response.Message, response.ErrorCode, true);
    return true;
  },

  /* TODO: some day we need to wrap $http and handle throttle
  handleThrottle: (http) => {
    const throttle = get().apiThrottle;
    if (throttle === 0) {
      return http
    }
  }*/

  setToast: (toast: CreateToastFnReturn) => {
    console.log("errorStore:setToast");
    set({ _toast: toast });
  },

  showToast: (description: string, id: string | number, error: boolean = false) => {
    console.log("errorStore:showToast", description, id);
    const toast = get()._toast;
    if (!toast || toast.isActive(id.toString())) {
      return;
    }
    const title = isInteger(id) ? `Bungie Error: ${id}` : "Raid Watch Error";
    toast({
      id: id.toString(),
      title,
      description,
      status: error ? "error" : "warning",
      isClosable: true,
      duration: null,
    });
  },
});