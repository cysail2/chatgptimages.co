import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/library/lib/utils";

export type LogoVariant = "icon" | "icon-text" | "text";

export interface LogoServerProps {
  /**
   * Logo 显示模式
   * - "icon": 只显示图标
   * - "icon-text": 显示图标+文字（默认）
   * - "text": 只显示文字
   */
  variant?: LogoVariant;
  /**
   * Logo 图片路径
   */
  logoSrc?: string;
  /**
   * Logo 图片 alt 文本
   */
  logoAlt?: string;
  /**
   * 站点名称
   */
  siteName?: string;
  /**
   * Logo 图片宽度（像素）
   */
  logoWidth?: number;
  /**
   * Logo 图片高度（像素）
   */
  logoHeight?: number;
  /**
   * 点击跳转链接，默认为 "/"
   */
  href?: string;
  /**
   * 自定义 className
   */
  className?: string;
  /**
   * 图标容器的 className
   */
  iconClassName?: string;
  /**
   * 文字容器的 className
   */
  textClassName?: string;
  /**
   * 是否禁用链接
   */
  disableLink?: boolean;
  /**
   * 链接点击回调
   */
  onLinkClick?: () => void;
}

export function LogoServer({
  variant = "icon-text",
  logoSrc,
  logoAlt,
  siteName,
  logoWidth = 100,
  logoHeight = 100,
  href = "/",
  className,
  iconClassName,
  textClassName,
  disableLink = false,
  onLinkClick,
}: LogoServerProps) {
  const hasLogo = !!logoSrc;
  const hasText = !!siteName;

  // 根据 variant 决定显示内容
  const showIcon = variant === "icon" || variant === "icon-text";
  const showText = variant === "text" || variant === "icon-text";

  // 如果没有对应的资源，自动调整显示模式
  const finalShowIcon = showIcon && hasLogo;
  const finalShowText = showText && hasText;

  // 如果都没有，至少显示文字或占位
  if (!finalShowIcon && !finalShowText) {
    return null;
  }

  const content = (
    <div className={cn("flex items-center gap-2", className)}>
      {finalShowIcon && (
        <div className={cn("flex-shrink-0", iconClassName)}>
          <Image
            src={logoSrc!}
            alt={logoAlt || (siteName ? `${siteName} Logo` : "Logo")}
            width={logoWidth}
            height={logoHeight}
            className="object-contain"
            unoptimized
            style={{
              maxHeight: "100%",
              width: "auto",
            }}
          />
        </div>
      )}
      {finalShowText && (
        <span className={cn("text-xl font-bold text-primary", textClassName)}>
          {siteName}
        </span>
      )}
    </div>
  );

  if (disableLink) {
    return content;
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center"
      title={siteName || "Logo"}
      onClick={onLinkClick}
    >
      {content}
    </Link>
  );
}
