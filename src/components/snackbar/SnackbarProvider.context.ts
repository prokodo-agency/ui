import {
  createContext,
} from "react"

import type { SnackbarPayload } from "./SnackbarProvider.model"

export interface SnackbarContextValue {
  enqueue: (p: SnackbarPayload) => string;
  close:   (id: string) => void;
}

/* default no-ops */
export const SnackbarCtx = createContext<SnackbarContextValue>({
  enqueue: () => "",
  close:   () => {},
});
