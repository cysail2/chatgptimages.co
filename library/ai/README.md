# AI 生成器开发规范

本目录用于存放站点里的各类 AI 生成器。新增生成器时，目录结构、提交流程、任务中心接入方式尽量保持一致，这样工具栏、任务轮询、结果展示、深色模式等行为才会统一。

## 推荐目录结构

按模型或产品拆分，优先采用下面这类结构：

```text
library/ai/<model>/
├── components/           # 生成器 UI 入口组件
├── hooks/                # 提交流程、上传、轮询、派生状态
├── model/                # API 请求与类型定义
├── index.ts              # 可选，对外统一导出
└── README.md             # 可选，模型专属说明
```

约定：

- 偏 UI 的组织和页面交互放在 `components/`
- 可复用的生成逻辑、上传逻辑、轮询逻辑放在 `hooks/`
- 接口请求、响应类型、参数类型放在 `model/`
- 如果一个模型存在多种模式，不要把所有异步逻辑都堆在单个组件里

## 生成器基础要求

每个生成器至少要满足这些要求：

- 提交前校验必填参数
- 每次生成前清空本地错误状态
- 生成中禁用主按钮，避免重复提交
- 给用户明确的 pending 状态
- 后端失败时有可读的报错信息
- 在生成器内部保留必要的结果回显
- 生成异步任务时，必须接入工具栏任务中心

## 任务中心接入是必选项

只要生成器不是同步返回最终结果，而是创建异步任务，就必须接入全局任务中心。

相关文件：

- `library/providers/TaskCenterProvider.tsx`
- `library/providers/index.ts`

组件中统一这样接：

```ts
import { useTaskCenter } from "@/library/providers";

const { addTask, replaceTaskId, updateTask } = useTaskCenter();
```

## 标准提交流程

用户点击生成后，按下面顺序处理：

1. 先生成一个临时任务 id，例如 `temp-<model>-<timestamp>`
2. 立刻调用 `addTask(...)`
3. 传入 `{ open: true }`，让工具栏任务中心立即展开
4. 再提交真实后端请求
5. 后端返回真实 `task_id` 后，调用 `replaceTaskId(...)`
6. 进入轮询或订阅状态更新
7. 成功时调用 `updateTask(...)`，写入 `status: "success"` 和结果 URL
8. 失败或超时时调用 `updateTask(...)`，写入 `status: "failed"` 和 `statusMsg`

示例：

```ts
const tempTaskId = `temp-mureka-${Date.now()}`;

addTask(
  {
    taskId: tempTaskId,
    provider: "kie_music_v5",
    modelLabel: "Mureka V9",
    prompt: trimmedPrompt,
    isLocalPending: true,
  },
  { open: true }
);

const response = await apiCall();

replaceTaskId(tempTaskId, {
  taskId: response.data.task_id,
  provider: "kie_music_v5",
  modelLabel: "Mureka V9",
  prompt: trimmedPrompt,
});

updateTask(response.data.task_id, {
  status: "success",
  audioUrl: finalAudioUrl,
});
```

## Provider 注册规范

如果新生成器可以复用已有 provider，就不要新建 provider，保持一致即可。

例如：

- 同样走 Kie 音乐任务体系的音乐生成器，统一使用 `kie_music_v5`
- Wan 系视频任务统一走 `aliyun_wan2_6`

如果确实需要新增 provider，必须同步修改 `library/providers/TaskCenterProvider.tsx` 的这些位置：

- 在 `GenerationTaskProvider` 中加入新 provider
- 在 `inferProviderFromModel(...)` 中补模型名映射
- 在 `checkTaskStatus(...)` 中补该 provider 的轮询逻辑
- 正确返回输出字段，例如 `videoUrl`、`audioUrl`、`imageUrl`、`imageUrls`

不要出现“生成器已经能提交任务，但任务中心无法识别或无法轮询”的情况。

## 输出字段约定

任务完成后，要把主结果 URL 回写到任务中心的正确字段：

- 音频生成器：`audioUrl`
- 视频生成器：`videoUrl`
- 图片生成器：`imageUrl` 或 `imageUrls`

同时建议维护好 `statusMsg`，尤其是提交中、失败、超时等状态。

推荐中间态文案：

- `Submitting request...`
- `Processing input...`
- `Generating...`
- `Timed out. Please try again.`

## 轮询职责约定

优先级如下：

- 如果 provider 已经被任务中心支持，优先让 `TaskCenterProvider` 负责全局轮询
- 如果组件本身还需要做即时结果回显，也可以保留本地轮询

但即使保留本地轮询，也必须同步更新任务中心状态，不能只更新组件内部 UI。

## UI 规范

生成器 UI 建议遵循这些规则：

- 优先使用 `library/ui` 下的主题组件
- `input`、`textarea`、`select`、`outline button` 不能依赖浏览器默认文字颜色
- 主操作按钮保持单一且清晰
- 高级选项做明显分组
- 空状态、生成中、成功、失败都要有明确反馈

## 实现检查清单

- 已补齐 `model/` 下的 API 请求和类型定义
- 已补齐必要的导出
- 已更新页面或模块引用
- 已做输入校验和禁用态
- 已接入任务中心
- 成功结果已同步到预览区和任务中心
- 失败和超时状态已同步到任务中心
- 已检查深色模式下的文本可读性
- `typecheck` 通过

## 参考实现

可以直接参考这些现有实现：

- `library/ai/wan/hooks/useWanGeneration.ts`
- `library/ai/seedance/hooks/useSeedanceGeneration.ts`
- `library/ai/ltx/hooks/useLtxGeneration.ts`
- `library/ai/suno-v5/components/Composer.tsx`
- `library/ai/mureka/components/MurekaGenerate.tsx`
