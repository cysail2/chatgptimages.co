# Page Builder 系统

基于模版数据结构的通用页面构建系统，支持多套模版风格和可视化编辑。

## 核心概念

### 1. 类型系统 (`src/types/webpage.ts`)
- `ComponentNode`: 组件节点，包含 id、type、template、props 和 children
- `PageSchema`: 页面结构，包含 metadata、theme 和 root 节点
- `ComponentType`: 支持的组件类型

### 2. 渲染器 (`src/components/page-builder/renderer.tsx`)
- `PageRenderer`: 递归渲染组件树
- 支持通过 `template` 属性选择不同的样式模版

### 3. 组件注册表 (`src/components/page-builder/registry.tsx`)
`ComponentRegistry` 注册所有可用的组件类型。

#### 基础组件

| 组件类型 | 描述 | 主要 Props |
| :--- | :--- | :--- |
| `container` | 基础容器 | `className`, `style` |
| `row` | 行布局 | `className`, `gap` (默认 `gap-4`), `alignItems`, `justifyContent` |
| `col` | 列布局 | `className`, `gap` (默认 `gap-4`), `alignItems`, `justifyContent` |
| `text` | 文本组件 | `content`, `tag` (默认 `p`), `className` |
| `html` | HTML 内容 | `content`, `className` |
| `button` | 按钮 | `label`, `variant`, `size`, `className`, `action`, `href` |
| `image` | 图片 | `src`, `alt`, `width`, `height`, `className`, `objectFit` |
| `card` | 卡片容器 | `title`, `description`, `footer`, `className` |
| `content-section`| 通用区块 | `heading`, `subtitle`, `className` |

#### 业务组件列表
- `hero` / `hero-with-generator`: 英雄区（支持 AI 生成器）
- `features-list` / `feature-card`: 特性列表
- `how-it-works` / `step-item`: 工作流程/步骤
- `faq-list` / `faq-item`: 常见问题
- `pricing`: 定价表格
- `cta`: 呼吁行动 (Call to Action)
- `video-cases`: 视频案例展示
- `use-cases` / `use-case-card`: 使用场景
- `testimonials` / `testimonial-card`: 用户评价
- `audio-examples`: 音频示例
- `video`: 视频组件
- `markdown`: Markdown 内容渲染

### 4. 业务块组件详情 (`src/components/page-builder/blocks/`)

每个业务块组件支持多套模版风格：

#### **HeroBlock** (`hero`, `hero-with-generator`)
- **Templates**: 
  - `default`: 标准样式
  - `minimal`: 极简样式
  - `centered`: 居中样式
  - `fullscreen`: 全屏样式
- **Props**: `heading`, `summary`, `generator` (seedance, vibevoice 等), `fullHeight`, `backgroundVideoUrl`, `showGenerator`

#### **FeatureBlocks** (`features-list`, `feature-card`)
- **Templates**: 
  - `default`: 默认网格
  - `minimal`: 极简网格
  - `cards`: 卡片样式
  - `grid`: 网格样式
- **Props**: `heading`, `subtitle`

#### **StepBlocks** (`how-it-works`, `step-item`)
- **Templates**: 
  - `default`: 默认卡片
  - `horizontal`: 水平布局
  - `minimal`: 极简
  - `process`: 流程图样式
  - `process-3-cols`: 三列流程
- **Props**: `heading`, `summary`

#### **FAQBlocks** (`faq-list`, `faq-item`)
- **Templates**: 
  - `default`: 默认列表
  - `minimal`: 极简列表
  - `cards`: 卡片展示
- **Props**: `heading`, `summary`

#### **CTABlock** (`cta`)
- **Templates**: 
  - `default`: 默认背景
  - `minimal`: 极简边框
  - `centered`: 居中强调
- **Props**: `heading`, `summary`, `link`, `linkText`, `comingSoon`

#### **TestimonialsBlock** (`testimonials`, `testimonial-card`)
- **Templates**: 
  - `default`: 默认网格
  - `minimal`: 极简
  - `centered`: 居中
  - `cards`: 卡片阴影
  - `horizontal`: 水平布局
- **Props**: `heading`, `summary`, `rating`, `avatarUrl`, `name`, `role`, `content`

#### **UseCasesBlock** (`use-cases`, `use-case-card`)
- **Templates**: 
  - `default`: 默认
  - `minimal`: 极简
  - `cards`: 卡片
- **Props**: `heading`, `summary`, `image`, `icon`, `title`, `description`

#### **VideoCasesBlock** (`video-cases`)
- **Templates**: 默认样式
- **Props**: `heading`, `summary`, `product` (wan2.6 等), `limit`

#### **AudioExamplesBlock** (`audio-examples`)
- **Templates**: 默认样式
- **Props**: `heading`, `summary`, `examples` (数组: id, title, audioUrl, language 等)

#### **MarkdownBlock** (`markdown`)
- **Templates**: 默认样式 (Prose)
- **Props**: `content`, `dataSource` (用于动态绑定数据)

## 使用方法

### 1. 创建页面模版数据结构

```typescript
import { PageSchema } from '@/types/webpage';

const pageSchema: PageSchema = {
  id: 'my-page',
  name: 'My Page',
  metadata: {
    title: 'My Page Title',
    description: 'Page description',
    keywords: 'keywords',
    robots: ['index', 'follow'],
    canonical: 'https://example.com/my-page'
  },
  root: {
    id: 'root',
    type: 'container',
    props: { className: 'min-h-screen' },
    children: [
      {
        id: 'hero',
        type: 'hero-with-generator',
        template: 'default', // 选择模版风格
        props: {
          heading: 'Welcome',
          summary: 'This is a page',
          showGenerator: true,
          generator: 'seedance',
        },
      },
      {
        id: 'features',
        type: 'features-list',
        template: 'cards',
        props: { heading: 'Features' },
        children: [
           // ... feature-card nodes
        ]
      }
    ],
  },
};
```

### 2. 渲染页面

```typescript
import { PageRenderer } from '@/library/components/page-builder/renderer';

export default function MyPage() {
  return <PageRenderer node={pageSchema.root} />;
}
```

## 编辑器

访问 `/website/pages/[pageId]/page-builder-editor` 可以预览和导出页面模版数据结构。

## 已迁移的页面

- ✅ `/wan-2-6` - 已迁移到 page-builder 系统
- ✅ `/seedance-2` - 已迁移到 page-builder 系统
- ⏳ `/` - 首页（待迁移）

## 扩展组件

要添加新的组件类型：

1. 在 `src/types/webpage.ts` 中添加新的 `ComponentType`。
2. 在 `src/components/page-builder/blocks/` 中创建组件实现。
3. 在 `src/components/page-builder/registry.tsx` 中注册组件。

## 扩展模版

要为新组件添加模版风格：

1. 在组件文件中定义 `templates` 对象。
2. 在组件渲染时根据 `node.template` 选择对应的样式。
