"use client";

export type FileUploadRules = {
  allowedExtensions: string[];
  allowedMimeTypes: string[];
  accept: string[];
  helperText: string[];
  maxSizeMb?: number;
  typeErrorMessage: string;
  sizeErrorMessage?: string;
};

type FileUploadRulesInput = {
  allowedExtensions: string[];
  allowedMimeTypes?: string[];
  extraMimeTypes?: string[];
  maxSizeMb?: number;
  helperText?: string[];
  label?: string;
};

const IMAGE_EXTENSION_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const DEFAULT_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const;
const DEFAULT_VIDEO_EXTENSIONS = [".mp4"] as const;

const normalizeExtension = (ext: string) => {
  const trimmed = ext.trim().toLowerCase();
  if (!trimmed) return "";
  return trimmed.startsWith(".") ? trimmed : `.${trimmed}`;
};

const uniqueStrings = (values: string[]) => Array.from(new Set(values));

const splitAllowedTypes = (types: string[]) => {
  const extensions: string[] = [];
  const mimeTypes: string[] = [];
  types.forEach((entry) => {
    const normalized = entry.trim().toLowerCase();
    if (!normalized) return;
    if (normalized.startsWith(".")) {
      extensions.push(normalizeExtension(normalized));
      return;
    }
    if (normalized.includes("/")) {
      mimeTypes.push(normalized);
      return;
    }
    extensions.push(normalizeExtension(normalized));
  });
  return {
    extensions: uniqueStrings(extensions).filter(Boolean),
    mimeTypes: uniqueStrings(mimeTypes).filter(Boolean),
  };
};

const formatAllowedTypesForDisplay = (
  extensions: string[],
  mimeTypes: string[]
) => {
  const display = new Set<string>();
  extensions
    .map((ext) => normalizeExtension(ext))
    .filter(Boolean)
    .forEach((ext) => {
      display.add(ext.slice(1).toUpperCase());
    });
  mimeTypes.forEach((mime) => {
    if (!mime.includes("/")) return;
    const suffix = mime.split("/")[1];
    if (suffix) display.add(suffix.toUpperCase());
  });
  return Array.from(display).join(", ");
};

const buildHelperText = (
  extensions: string[],
  mimeTypes: string[],
  maxSizeMb?: number
) => {
  const display = formatAllowedTypesForDisplay(extensions, mimeTypes);
  if (!display) return ["Click to upload"];
  const sizeText = maxSizeMb ? `, Max size ${maxSizeMb}MB.` : ".";
  return ["Click to upload", `Supports ${display}${sizeText}`];
};

const buildAcceptList = (extensions: string[], mimeTypes: string[]) =>
  uniqueStrings([...mimeTypes, ...extensions]).filter(Boolean);

const buildTypeErrorMessage = (extensions: string[], mimeTypes: string[]) => {
  const display = formatAllowedTypesForDisplay(extensions, mimeTypes);
  if (!display) return "Unsupported file type.";
  return `Only ${display} are supported.`;
};

const buildSizeErrorMessage = (maxSizeMb?: number, label = "file") => {
  if (!maxSizeMb) return undefined;
  return `Max ${label} size is ${maxSizeMb}MB.`;
};

export const getAllowedTypesDisplay = (rules: FileUploadRules) =>
  formatAllowedTypesForDisplay(
    rules.allowedExtensions,
    rules.allowedMimeTypes
  );

export const createFileUploadRules = ({
  allowedExtensions,
  allowedMimeTypes = [],
  extraMimeTypes = [],
  maxSizeMb,
  helperText,
  label = "file",
}: FileUploadRulesInput): FileUploadRules => {
  const normalizedExtensions = uniqueStrings(
    allowedExtensions.map(normalizeExtension).filter(Boolean)
  );
  const normalizedMimeTypes = uniqueStrings(
    [...allowedMimeTypes, ...extraMimeTypes].map((mime) => mime.toLowerCase())
  );
  const helperTextValue =
    helperText ?? buildHelperText(normalizedExtensions, normalizedMimeTypes, maxSizeMb);
  return {
    allowedExtensions: normalizedExtensions,
    allowedMimeTypes: normalizedMimeTypes,
    accept: buildAcceptList(normalizedExtensions, normalizedMimeTypes),
    helperText: helperTextValue,
    maxSizeMb,
    typeErrorMessage: buildTypeErrorMessage(
      normalizedExtensions,
      normalizedMimeTypes
    ),
    sizeErrorMessage: buildSizeErrorMessage(maxSizeMb, label),
  };
};

export const createFileUploadRulesFromAllowedTypes = ({
  allowedTypes,
  maxSizeMb,
  helperText,
  label = "file",
}: {
  allowedTypes: string[];
  maxSizeMb?: number;
  helperText?: string[];
  label?: string;
}): FileUploadRules => {
  const { extensions, mimeTypes } = splitAllowedTypes(allowedTypes);
  return createFileUploadRules({
    allowedExtensions: extensions,
    allowedMimeTypes: mimeTypes,
    maxSizeMb,
    helperText,
    label,
  });
};

export const createImageUploadRules = ({
  maxSizeMb = 10,
  allowedExtensions = DEFAULT_IMAGE_EXTENSIONS,
  helperText,
}: {
  maxSizeMb?: number;
  allowedExtensions?: readonly string[];
  helperText?: string[];
} = {}): FileUploadRules => {
  const normalizedExtensions = allowedExtensions
    .map(normalizeExtension)
    .filter(Boolean);
  const allowedMimeTypes = normalizedExtensions
    .map((ext) => IMAGE_EXTENSION_MIME[ext])
    .filter(Boolean);
  const extraMimeTypes = normalizedExtensions.includes(".jpg")
    ? ["image/jpg"]
    : [];
  return createFileUploadRules({
    allowedExtensions: normalizedExtensions,
    allowedMimeTypes,
    extraMimeTypes,
    maxSizeMb,
    helperText,
    label: "image",
  });
};

export const createVideoUploadRules = ({
  maxSizeMb = 100,
  allowedExtensions = DEFAULT_VIDEO_EXTENSIONS,
  helperText,
}: {
  maxSizeMb?: number;
  allowedExtensions?: readonly string[];
  helperText?: string[];
} = {}): FileUploadRules => {
  const normalizedExtensions = allowedExtensions
    .map(normalizeExtension)
    .filter(Boolean);
  const allowedMimeTypes = normalizedExtensions
    .map((ext) => {
      if (ext === ".mp4") return "video/mp4";
      return "";
    })
    .filter(Boolean);
  return createFileUploadRules({
    allowedExtensions: normalizedExtensions,
    allowedMimeTypes,
    maxSizeMb,
    helperText,
    label: "video",
  });
};

export const isFileTypeAllowed = (file: File, rules: FileUploadRules) => {
  const fileType = (file.type || "").toLowerCase();
  const fileName = (file.name || "").toLowerCase();
  if (fileType && rules.allowedMimeTypes.includes(fileType)) return true;
  return rules.allowedExtensions.some((ext) => fileName.endsWith(ext));
};

export const validateFileWithRules = (file: File, rules: FileUploadRules) => {
  if (!isFileTypeAllowed(file, rules)) {
    return { ok: false, message: rules.typeErrorMessage, reason: "type" };
  }
  if (rules.maxSizeMb && file.size > rules.maxSizeMb * 1024 * 1024) {
    return { ok: false, message: rules.sizeErrorMessage, reason: "size" };
  }
  return { ok: true as const };
};
