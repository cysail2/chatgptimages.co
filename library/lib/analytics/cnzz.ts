export type CnzzEventParams = {
  category: string;
  action: string;
  label?: string;
  value?: string | number;
  nodeId?: string;
};

const buildCnzzPayload = ({
  category,
  action,
  label = "",
  value = "1",
  nodeId = "",
}: CnzzEventParams) => [
  "_trackEvent",
  category,
  action,
  label,
  String(value),
  nodeId,
] as const;

export const trackCnzzEvent = (params: CnzzEventParams) => {
  if (typeof window === "undefined") return false;
  const czc = (window as any)?._czc;
  if (!czc || typeof czc.push !== "function") return false;
  czc.push(buildCnzzPayload(params));
  return true;
};
