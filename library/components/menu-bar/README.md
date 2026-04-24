# Menu Bar 组件

一个 macOS 风格的菜单栏组件系统，用于网站的顶部导航和移动端底部导航。

## 架构概览

```text
MenuBar (Server Component - 主入口)
├── ScrollAwareNav (Client - 滚动效果包装器)
│   ├── MenuBarNavigation (Client - Logo + 导航链接)
│   └── MenuBarControls (Client - 控制项组合)
│       ├── AudioPlayerExtra
│       ├── TaskCenterExtra
│       ├── ThemeExtra
│       ├── UserBalanceExtra
│       ├── UserAuthExtra
│       └── TrialToastExtra
└── MobileBottomNav (Client - iOS风格底部导航)
```

## 快速开始

```tsx
import { MenuBar } from "@/library/components/menu-bar";

// 在 layout.tsx 中使用
export default function Layout({ children }) {
  return (
    <>
      <MenuBar />
      {children}
    </>
  );
}
```

## 组件说明

### MenuBar

**类型**: Server Component  
**文件**: `MenuBar.tsx`

主入口组件，负责从服务端获取配置并渲染导航系统。

### ScrollAwareNav

**类型**: Client Component  
**文件**: `ScrollAwareNav.tsx`

滚动感知的导航容器，处理：

- 滚动时的背景透明度/毛玻璃效果
- 维护横幅的位置偏移

| 属性        | 类型        | 说明           |
|-------------|-------------|----------------|
| `children`  | `ReactNode` | 导航栏内容     |
| `className` | `string?`   | 自定义样式类   |

### MenuBarNavigation

**类型**: Client Component  
**文件**: `MenuBarNavigation.tsx`

Logo 和导航链接区域。

| 属性         | 类型                        | 说明       |
|--------------|----------------------------|------------|
| `siteConfig` | `SiteConfig`               | 站点配置   |
| `navConfig`  | `NavigationConfig \| null` | 导航配置   |
| `className`  | `string?`                  | 自定义样式 |

### MenuBarControls

**类型**: Client Component  
**文件**: `MenuBarControls.tsx`

右侧控制区域，组合多个 Extra Items。

| 属性         | 类型         | 说明       |
|--------------|--------------|------------|
| `siteConfig` | `SiteConfig` | 站点配置   |
| `className`  | `string?`    | 自定义样式 |

### MobileBottomNav

**类型**: Client Component  
**文件**: `MobileBottomNav.tsx`

iOS 风格的移动端底部导航栏。

| 属性        | 类型                        | 说明       |
|-------------|----------------------------|------------|
| `navConfig` | `NavigationConfig \| null` | 导航配置   |
| `className` | `string?`                  | 自定义样式 |

## MenuBar Extra Items

Extra Items 是独立的菜单栏控制项组件，类似 macOS 菜单栏扩展项。

### 设计规范

所有 Extra Items 遵循统一的设计规范：

```tsx
import {
  MENU_BAR_EXTRA_BUTTON_STYLES,
  MENU_BAR_EXTRA_POPOVER_STYLES,
  MenuBarDivider,
} from "@/library/components/menu-bar/extras";

// 按钮样式
MENU_BAR_EXTRA_BUTTON_STYLES.base     // 基础样式
MENU_BAR_EXTRA_BUTTON_STYLES.active   // 激活状态
MENU_BAR_EXTRA_BUTTON_STYLES.inactive // 未激活状态
MENU_BAR_EXTRA_BUTTON_STYLES.icon     // 图标样式

// Popover 样式
MENU_BAR_EXTRA_POPOVER_STYLES.content    // 内容容器样式
MENU_BAR_EXTRA_POPOVER_STYLES.align      // 对齐方式
MENU_BAR_EXTRA_POPOVER_STYLES.sideOffset // 偏移量
```

### 可用的 Extra Items

| 组件                | 说明                           | 可见条件       |
|---------------------|--------------------------------|----------------|
| `AudioPlayerExtra`  | 音频播放器开关                 | 配置启用或播放中 |
| `TaskCenterExtra`   | 任务中心开关                   | 用户已登录     |
| `ThemeExtra`        | 主题切换                       | 始终可见       |
| `UserBalanceExtra`  | 用户余额/试用券显示            | 用户已登录     |
| `UserAuthExtra`     | 认证按钮 + 免费试用按钮        | 始终可见       |
| `TrialToastExtra`   | 首次登录试用券提醒（非可视）   | 自动触发       |
| `MenuBarDivider`    | 分隔符                         | 始终可见       |

### 自定义组合

可以使用 Extra Items 创建自定义的控制栏：

```tsx
import {
  AudioPlayerExtra,
  TaskCenterExtra,
  ThemeExtra,
  MenuBarDivider,
} from "@/library/components/menu-bar/extras";

function CustomControls() {
  return (
    <div className="flex items-center gap-0.5">
      <AudioPlayerExtra forceShow />
      <TaskCenterExtra />
      <MenuBarDivider />
      <ThemeExtra />
    </div>
  );
}
```

### 创建新的 Extra Item

```tsx
"use client";

import React from "react";
import { cn } from "@/library/lib/utils";
import { Button } from "@/library/ui/button";
import { MyIcon } from "lucide-react";
import {
  MenuBarExtraItemProps,
  MENU_BAR_EXTRA_BUTTON_STYLES,
} from "./types";

export function MyCustomExtra({ className }: MenuBarExtraItemProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        MENU_BAR_EXTRA_BUTTON_STYLES.base,
        isActive
          ? MENU_BAR_EXTRA_BUTTON_STYLES.active
          : MENU_BAR_EXTRA_BUTTON_STYLES.inactive,
        className
      )}
      onClick={() => setIsActive(!isActive)}
    >
      <MyIcon className={MENU_BAR_EXTRA_BUTTON_STYLES.icon} />
    </Button>
  );
}
```

## 文件结构

```text
src/components/menu-bar/
├── index.ts                 # Barrel exports
├── README.md                # 本文档
├── MenuBar.tsx              # 服务端组件 - 主入口
├── ScrollAwareNav.tsx       # 客户端 - 滚动感知包装器
├── MenuBarNavigation.tsx    # 客户端 - Logo + 导航
├── MenuBarControls.tsx      # 客户端 - 控制项组合
├── MobileBottomNav.tsx      # 客户端 - 移动端底部导航
└── extras/                  # Extra Items 目录
    ├── index.ts             # Barrel exports
    ├── types.tsx            # 类型和共享样式
    ├── AudioPlayerExtra.tsx # 音频播放器
    ├── TaskCenterExtra.tsx  # 任务中心
    ├── ThemeExtra.tsx       # 主题切换
    ├── UserBalanceExtra.tsx # 用户余额
    ├── UserAuthExtra.tsx    # 用户认证
    └── TrialToastExtra.tsx  # 试用提醒
```

## 向后兼容

```tsx
// 旧方式 (deprecated)
import { Navbar } from "@/library/components/Navbar";

// 新方式 (推荐)
import { MenuBar } from "@/library/components/menu-bar";
```
