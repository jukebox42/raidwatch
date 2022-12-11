import { StateCreator } from "zustand";
import { CreateToastFnReturn } from "@chakra-ui/react";
import { ServerResponse, PlatformErrorCodes } from "bungie-api-ts/destiny2";

export type ToastStore = {
  _toast: CreateToastFnReturn | undefined,
  apiDisabled: boolean,
  checkError: (response: any) => boolean,
  setToast: (toast: CreateToastFnReturn) => void,
  showToast: (description: string, id: string | number, error?: boolean) => void,
}

export const createToastStore: StateCreator<ToastStore, any, [], ToastStore> = (set, get) => ({
  apiDisabled: false,
  _toast: undefined,

  setToast: (toast: CreateToastFnReturn) => {
    console.log("toastStore:setToast");
    set({ _toast: toast });
  },

  checkError: (response: ServerResponse<any>) => {
    console.log("toastStore:checkError", response.ErrorCode, response.ErrorStatus);
    if (get().apiDisabled) {
      return true;
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

  showToast: (description: string, id: string | number, error: boolean = false) => {
    console.log("toastStore:showToast", description, id);
    const toast = get()._toast;
    if (!toast || toast.isActive(id.toString())) {
      return;
    }
    toast({
      id: id.toString(),
      title: "Bungie API Error",
      description,
      status: error ? "error" : "warning",
      isClosable: true,
      duration: null,
    });
  },
});