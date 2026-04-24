type LoggableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | File
  | Blob
  | LoggableValue[]
  | { [key: string]: LoggableValue };

const BLOCK_MODEL_REQUESTS = false;

const serializeValue = (value: LoggableValue): LoggableValue => {
  if (value instanceof File) {
    return { name: value.name, size: value.size, type: value.type };
  }
  if (value instanceof Blob) {
    return { size: value.size, type: value.type };
  }
  if (Array.isArray(value)) {
    return value.map((item) => serializeValue(item as LoggableValue));
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    const mapped: Record<string, LoggableValue> = {};
    for (const [key, val] of entries) {
      mapped[key] = serializeValue(val as LoggableValue);
    }
    return mapped;
  }
  return value;
};

export const maybeBlockModelRequest = (
  label: string,
  payload: LoggableValue
) => {
  if (!BLOCK_MODEL_REQUESTS) return;
  console.warn(`[Blocked request] ${label}`, serializeValue(payload));
  throw new Error("Request blocked for parameter inspection.");
};
