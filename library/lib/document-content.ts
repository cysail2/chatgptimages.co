function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function stripDocumentHeader(content: string, title: string) {
  let next = content.trimStart();
  const titlePattern = new RegExp(`^#\\s+${escapeRegExp(title)}\\s*\\r?\\n+`, "i");
  next = next.replace(titlePattern, "");
  next = next.replace(/^_Published:[^_\n]*_\s*\r?\n+/i, "");
  return next.trimStart();
}
