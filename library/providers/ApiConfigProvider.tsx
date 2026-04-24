"use client";

import type { ReactNode } from "react";
import { setApiConfig } from "@/library/services/api-core";

interface ApiConfigProviderProps {
  apiBase?: string;
  appId?: string;
  children: ReactNode;
}

export function ApiConfigProvider({
  apiBase,
  appId,
  children,
}: ApiConfigProviderProps) {
  setApiConfig({
    apiBase,
    appId,
  });

  return <>{children}</>;
}
