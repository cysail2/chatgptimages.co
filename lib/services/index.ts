import { authApi } from "./auth";
import { payApi } from "./pay";

export const services = {
  auth: authApi,
  pay: payApi,
};

export type { SyncUserPayload } from "./auth";
