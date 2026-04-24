import { NextRequest, NextResponse } from "next/server";
import { getConfig } from "@/library/services/config-api.server";
import {
  getFrontendConfig,
  FrontendConfigType,
} from "@/library/services/frontend-data.server";
import { ConfigType } from "@/types/siteConfig";

const VALID_CONFIG_TYPES: ConfigType[] = [
  "sites",
  "site",
  "navigation",
  "videos",
  "products",
  "pricing",
  "pages",
  "policies",
  "databases",
  "models",
];
const FRONTEND_CONFIG_TYPES: FrontendConfigType[] = [
  "site",
  "navigation",
  "videos",
  "products",
  "pricing",
  "pages",
  "policies",
];

// GET - 获取配置。如果请求来自前端（无 siteId），从 /data/ 读取；如果请求来自后台（有 siteId），从 /data/sites/{siteId}/ 读取
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ configType: string }> },
) {
  try {
    const { configType } = await params;

    if (!VALID_CONFIG_TYPES.includes(configType as ConfigType)) {
      return NextResponse.json(
        { error: "Invalid config type" },
        { status: 400 },
      );
    }

    let config;

    // 前端请求，从 /data/ 读取
    if (FRONTEND_CONFIG_TYPES.includes(configType as FrontendConfigType)) {
      config = await getFrontendConfig(configType as FrontendConfigType);
    } else {
      // sites 配置仍然从后台目录读取
      config = await getConfig(configType as ConfigType);
    }

    if (!config) {
      return NextResponse.json({ error: "Config not found" }, { status: 404 });
    }

    return NextResponse.json({
      code: 200,
      success: true,
      data: config,
    });
  } catch (error) {
    console.error("Error fetching config:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
