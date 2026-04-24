
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useUserInfo } from "./UserProvider";
import { api } from "@/library/services/api";
import { qwen3TtsApi, kieaiMusicApi, viduQ3Api, seedanceApi, vibevoiceApi, klingApi, seedreamApi, wanApi, ltxApi, nanobananaApi, ernieImageApi, gptImageApi } from "@/library/ai/registry";
import { getModelLabel } from "@/library/lib/aimodel/utils";
import { parseAudioVariantsFromHistoryItem } from "@/library/components/profile/utils";

export type GenerationTaskProvider =
  | "aliyun_wan2_6"
  | "aliyun_wan2_7"
  | "seedance"
  | "seedance_1_5"
  | "ltx"
  | "kie_music_v5"
  | "qwen3_tts_text_to_speech"
  | "qwen3_tts_voice_clone"
  | "qwen3_tts_voice_design"
  | "vidu_q3"
  | "vibevoice"
  | "kling"
  | "seedream"
  | "nanobanana"
  | "ernie_image"
  | "gpt_image";

export type GenerationTaskStatus = "pending" | "success" | "failed";

export type GenerationTask = {
  taskId: string;
  provider: GenerationTaskProvider;
  modelLabel: string;
  topicTag?: number;
  createdAt: number; // ms
  updatedAt: number; // ms
  ownerId: string | null;
  status: GenerationTaskStatus;
  statusMsg?: string;
  videoUrl?: string;
  audioUrl?: string; // Added for music tasks
  audioUrls?: string[];
  imageUrl?: string;
  imageUrls?: string[];
  prompt?: string;
  isLocalPending?: boolean;
};

type AddTaskInput = Omit<
  GenerationTask,
  "createdAt" | "updatedAt" | "status" | "ownerId"
> & {
  createdAt?: number;
};

type UpdateTaskInput = Partial<
  Pick<
    GenerationTask,
    | "status"
    | "statusMsg"
    | "videoUrl"
    | "audioUrl"
    | "audioUrls"
    | "imageUrl"
    | "imageUrls"
    | "prompt"
    | "updatedAt"
    | "createdAt"
    | "isLocalPending"
  >
>;

type ReplaceTaskInput = Pick<GenerationTask, "taskId"> &
  Partial<
    Pick<GenerationTask, "provider" | "modelLabel" | "prompt" | "topicTag">
  >;

type TaskCenterContextValue = {
  tasks: GenerationTask[];
  isReady: boolean;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  isProgressDialogOpen: boolean;
  progressDialogTaskId: string | null;
  openProgressDialog: (taskId: string) => void;
  closeProgressDialog: () => void;
  addTask: (task: AddTaskInput, options?: { open?: boolean }) => void;
  updateTask: (taskId: string, updates: UpdateTaskInput) => void;
  replaceTaskId: (tempTaskId: string, task: ReplaceTaskInput) => void;
  removeTask: (taskId: string) => void;
  clearTasks: () => void;
};

const TaskCenterContext = createContext<TaskCenterContextValue | undefined>(
  undefined
);

const POLL_INTERVAL_MS = 5000;
const HISTORY_PAGE_SIZE = 10000;
const HISTORY_REFRESH_DEBOUNCE_MS = 300;
const HISTORY_REFRESH_AFTER_COMPLETE_DEBOUNCE_MS = 500;
const TASK_TIMEOUT_MS = 60 * 60 * 1000; // 1 hour timeout

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const toMs = (value: number) => (value > 1e12 ? value : value * 1000);

const inferProviderFromUrl = (url: string | undefined | null) => {
  const value = (url || "").toLowerCase();
  if (value.includes("seedance2") || value.includes("seedance-2") || value.includes("seedance_2")) {
    return { provider: "seedance" as const, modelLabel: "Seedance 2.0" };
  }
  if (value.includes("seedance")) {
    return { provider: "seedance_1_5" as const, modelLabel: "Seedance 1.5" };
  }
  if (value.includes("ltx")) {
    return { provider: "ltx" as const, modelLabel: "LTX 2.3" };
  }
  if (value.includes("vidu")) {
    return { provider: "vidu_q3" as const, modelLabel: "Vidu Q3" };
  }
  if (value.includes("vibevoice")) {
    return { provider: "vibevoice" as const, modelLabel: "VibeVoice" };
  }
  if (value.includes("kling")) {
    return { provider: "kling" as const, modelLabel: "Kling" };
  }
  if (value.includes("seedream")) {
    return { provider: "seedream" as const, modelLabel: "Seedream" };
  }
  // No specific URL patterns for Qwen3TTS models are provided,
  // so we rely on inferProviderFromModel for model-based inference.
  return { provider: "aliyun_wan2_6" as const, modelLabel: "unknown" };
};

const inferProviderFromModel = (model: string | undefined | null) => {
  const m = (model || "").toLowerCase();

  // Directly return unknown if model is empty, as requested
  if (!m) {
    return { provider: "aliyun_wan2_6" as const, modelLabel: "unknown" };
  }

  const defaultLabel = getModelLabel(model || undefined) || "unknown";

  if (m.includes("seedance-2") || m.includes("seedance2") || m.includes("seedance_2")) {
    return { provider: "seedance" as const, modelLabel: defaultLabel || "Seedance 2.0" };
  }
  if (m.includes("seedance")) {
    return { provider: "seedance_1_5" as const, modelLabel: defaultLabel };
  }
  if (m.includes("ltx")) {
    return { provider: "ltx" as const, modelLabel: defaultLabel || "LTX 2.3" };
  }
  if (m.includes("skyreels-v4") || m.includes("skyreels_v4")) {
    return { provider: "aliyun_wan2_6" as const, modelLabel: "SkyReels V4" };
  }
  if (m.includes("skyreels-v3") || m.includes("skyreels_v3")) {
    return { provider: "aliyun_wan2_6" as const, modelLabel: "SkyReels V3" };
  }
  if (m.includes("skyreels")) {
    return { provider: "aliyun_wan2_6" as const, modelLabel: defaultLabel || "SkyReels" };
  }
  if (m.includes("happyhorse")) {
    return { provider: "aliyun_wan2_7" as const, modelLabel: "HappyHorse 1.0" };
  }
  if (m.includes("wan2.6") || m.includes("wan2_6") || m.includes("wan2-6")) {
    return { provider: "aliyun_wan2_6" as const, modelLabel: "Wan 2.6" };
  }
  if (m.includes("wan2.7") || m.includes("wan2_7") || m.includes("wan2-7")) {
    return { provider: "aliyun_wan2_7" as const, modelLabel: "Wan 2.7" };
  }
  if (m.includes("wan2.5") || m.includes("wan2_5") || m.includes("wan2-5")) {
    return { provider: "aliyun_wan2_6" as const, modelLabel: "Wan 2.5" };
  }
  if (m.includes("wan")) {
    return { provider: "aliyun_wan2_6" as const, modelLabel: defaultLabel || "Wan" };
  }
  if (m.includes("kie") || m.includes("music") || m.includes("suno")) {
    return { provider: "kie_music_v5" as const, modelLabel: defaultLabel };
  }
  if (m.includes("qwen3-tts-voice-clone")) {
    return { provider: "qwen3_tts_voice_clone" as const, modelLabel: "Qwen3 Voice Clone" };
  }
  if (m.includes("qwen3-tts-voice-design")) {
    return { provider: "qwen3_tts_voice_design" as const, modelLabel: "Qwen3 Voice Design" };
  }
  if (m.includes("qwen3-tts-text-to-speech") || m.includes("qwen")) {
    // Fallback to text-to-speech if just "qwen" but try to be specific
    return { provider: "qwen3_tts_text_to_speech" as const, modelLabel: "Qwen3 TTS" };
  }
  if (m.includes("vidu")) {
    return { provider: "vidu_q3" as const, modelLabel: "Vidu Q3" };
  }
  if (m.includes("vibevoice")) {
    return { provider: "vibevoice" as const, modelLabel: defaultLabel };
  }
  if (m.includes("kling")) {
    return { provider: "kling" as const, modelLabel: "Kling" };
  }
  if (m.includes("seedream")) {
    return { provider: "seedream" as const, modelLabel: defaultLabel };
  }
  if (m.includes("ernie")) {
    return { provider: "ernie_image" as const, modelLabel: defaultLabel || "ERNIE Image" };
  }
  if (m.includes("gpt-image") || m.includes("gpt_image")) {
    return { provider: "gpt_image" as const, modelLabel: defaultLabel || "GPT Image 2.0" };
  }
  if (m.includes("nanobanana") || m.includes("nano-banana")) {
    return { provider: "nanobanana" as const, modelLabel: defaultLabel || "Nano Banana" };
  }
  return { provider: "aliyun_wan2_6" as const, modelLabel: defaultLabel };
};

const checkTaskStatus = async (task: GenerationTask) => {
  if (task.provider === "kie_music_v5") {
    if (!kieaiMusicApi) return { status: 0, statusMsg: "Module disabled" };
    const result = await (kieaiMusicApi as any).checkTask(task.taskId);
    // Kieai API returns data only on success/complete, but we check status first
    // result.data.status: 1 success, -1 failed, 0 pending
    let status = 0;
    if (result.data) {
      status = result.data.status;
    }

    return {
      status: status,
      statusMsg: result.data?.status_msg,
      videoUrl: undefined,
      audioUrl: result.data?.audio, // Use the first audio track
      audioUrls: [result.data?.audio, result.data?.audio2].filter(Boolean),
    };
  }

  if (
    task.provider === "qwen3_tts_text_to_speech" ||
    task.provider === "qwen3_tts_voice_clone" ||
    task.provider === "qwen3_tts_voice_design"
  ) {
    if (!qwen3TtsApi) return { status: 0, statusMsg: "Module disabled" };
    const result = await (qwen3TtsApi as any).checkStatus(task.taskId);
    // result.data.status: 1 success, -1 failed, 0 pending
    let status = 0;
    if (result.data) {
      status = result.data.status;
    }

    return {
      status: status,
      statusMsg: result.data?.status_msg,
      videoUrl: undefined,
      audioUrl:
        result.data?.video_url ||
        result.data?.generate_image ||
        result.data?.quality_image,
    };
  }

  if (task.provider === "aliyun_wan2_6" || task.provider === "aliyun_wan2_7") {
    if (!wanApi) return { status: 0, statusMsg: "Module disabled" };
    const result = await (wanApi as any).checkTaskStatus(task.taskId, task.provider);
    return {
      status: result.status,
      statusMsg: result.status_msg,
      videoUrl: result.video_url,
      audioUrl: undefined,
    };
  }

  if (task.provider === "vidu_q3") {
    if (!viduQ3Api) return { status: 0, statusMsg: "Module disabled" };
    const result = await (viduQ3Api as any).checkTaskStatus(task.taskId);
    return {
      status: result.status,
      statusMsg: result.statusMsg,
      videoUrl: result.videoUrl,
      audioUrl: undefined,
    };
  }

  if (task.provider === "vibevoice") {
    if (!vibevoiceApi) return { status: 0, statusMsg: "Module disabled" };
    const result = await (vibevoiceApi as any).checkVibeVoiceTaskStatus(
      task.taskId
    );
    // result.data.status: 1 success, -1 failed, 0 pending
    let status = 0;
    if (result.data) {
      status = result.data.status;
    }
    return {
      status: status,
      statusMsg: result.data?.status_msg,
      videoUrl: undefined,
      audioUrl: result.data?.audio_url || result.data?.image_url,
    };
  }

  if (task.provider === "kling") {
    if (!klingApi) return { status: 0, statusMsg: "Module disabled" };
    const result = await (klingApi as any).checkTaskStatus(task.taskId);
    return {
      status: result.status,
      statusMsg: result.statusMsg,
      videoUrl: result.videoUrl,
      audioUrl: undefined,
    };
  }

  if (task.provider === "seedream") {
    if (!seedreamApi) return { status: 0, statusMsg: "Module disabled" };
    const result = await (seedreamApi as any).checkTaskStatus(task.taskId);
    return {
      status: result.status,
      statusMsg: result.statusMsg,
      videoUrl: undefined,
      audioUrl: undefined,
      imageUrls: result.imageUrls,
      imageUrl: result.imageUrls?.[0]
    };
  }

  if (task.provider === "ernie_image") {
    if (!ernieImageApi) return { status: 0, statusMsg: "Module disabled" };
    const r = await ernieImageApi.checkTaskStatus(task.taskId);
    return {
      status: r.status,
      statusMsg: r.statusMsg,
      videoUrl: undefined,
      audioUrl: undefined,
      imageUrl: r.imageUrl,
      imageUrls: r.imageUrl ? [r.imageUrl] : undefined,
    };
  }

  if (task.provider === "nanobanana") {
    if (!nanobananaApi) return { status: 0, statusMsg: "Module disabled" };
    const r = await nanobananaApi.checkTaskStatus(task.taskId);
    return {
      status: r.status,
      statusMsg: r.statusMsg,
      videoUrl: undefined,
      audioUrl: undefined,
      imageUrl: r.imageUrl,
      imageUrls: r.imageUrl ? [r.imageUrl] : undefined,
    };
  }

  if (task.provider === "gpt_image") {
    if (!gptImageApi) return { status: 0, statusMsg: "Module disabled" };
    const r = await gptImageApi.checkTaskStatus(task.taskId);
    return {
      status: r.status,
      statusMsg: r.statusMsg,
      videoUrl: undefined,
      audioUrl: undefined,
      imageUrl: r.imageUrl,
      imageUrls: r.imageUrls,
    };
  }

  if (task.provider === "ltx") {
    if (!ltxApi) return { status: 0, statusMsg: "Module disabled" };
    const result = await ltxApi.checkTaskStatus(task.taskId);
    return {
      status: result.status,
      statusMsg: result.statusMsg,
      videoUrl: result.videoUrl,
      audioUrl: undefined,
    };
  }
  // Default to Seedance logic
  if (!seedanceApi) return { status: 0, statusMsg: "Module disabled" };
  const seedanceVersion =
    task.provider === "seedance" ? "seedance-2.0" : "seedance-1.5";
  const result = await (seedanceApi as any).checkTaskStatus(
    task.taskId,
    seedanceVersion,
  );
  return {
    status: result.status as number,
    statusMsg: result.status_msg as string | undefined,
    videoUrl: result.video_url as string | undefined,
    audioUrl: undefined,
  };
};

export function TaskCenterProvider({ children }: { children: ReactNode }) {
  const { isLoadingUserInfo, userInfo } = useUserInfo();
  const isLoaded = !isLoadingUserInfo;
  const userId = userInfo?.uuid;
  const ownerId = userId ?? null;

  const [tasks, setTasks] = useState<GenerationTask[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false);
  const [progressDialogTaskId, setProgressDialogTaskId] = useState<
    string | null
  >(null);
  const refreshTimerRef = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) {
        window.clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, []);

  const tasksRef = useRef(tasks);
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const mergeLatest = useCallback(
    (existing: GenerationTask[], incoming: GenerationTask[]) => {
      const map = new Map<string, GenerationTask>();
      for (const t of incoming) map.set(t.taskId, t);
      for (const t of existing) {
        if (!map.has(t.taskId)) map.set(t.taskId, t);
      }
      const merged = Array.from(map.values());
      merged.sort((a, b) => b.createdAt - a.createdAt);
      return merged.slice(0, HISTORY_PAGE_SIZE);
    },
    []
  );

  const refreshFromHistory = useCallback(async () => {
    if (!isLoaded || !ownerId) return;
    try {
      const result = await api.user.getUserOpusList(1, HISTORY_PAGE_SIZE);
      if (result.code !== 200 || !result.data) return;
      const list = Array.isArray(result.data.list) ? result.data.list : [];
      const now = Date.now();
      const next = list
        .map((item: any) => {
          if (!isRecord(item)) return null;
          const taskId = typeof item.task_id === "string" ? item.task_id : "";
          if (!taskId) return null;
          const createdAtRaw =
            typeof item.created_at === "number" ? item.created_at : NaN;
          const updatedAtRaw =
            typeof item.updated_at === "number"
              ? item.updated_at
              : createdAtRaw;
          if (!Number.isFinite(createdAtRaw)) return null;

          const createdAt = toMs(createdAtRaw);
          const isTimedOut = now - createdAt > TASK_TIMEOUT_MS;

          const generateImage =
            typeof item.generate_image === "string"
              ? item.generate_image
              : undefined;
          const audioVariants = parseAudioVariantsFromHistoryItem(item);
          const parsedAudioUrls = audioVariants.map((variant) => variant.url);
          const statusNum = typeof item.status === "number" ? item.status : 0;
          const status: GenerationTaskStatus =
            statusNum === 1
              ? "success"
              : statusNum === -1
                ? "failed"
                : isTimedOut
                  ? "failed"
                  : "pending";
          const statusMsg =
            typeof item.status_msg === "string"
              ? item.status_msg
              : isTimedOut && statusNum === 0
                ? "Task timed out"
                : undefined;
          const prompt =
            typeof item.prompt === "string" ? item.prompt : undefined;
          const topicTag =
            typeof item.topic_tag === "number" ? item.topic_tag : undefined;

          const rawModel =
            typeof item.model === "string" ? item.model : undefined;
          const inferred =
            inferProviderFromModel(rawModel) ??
            inferProviderFromUrl(generateImage || "");

          let videoUrl = generateImage;
          let audioUrl = undefined;
          let audioUrls: string[] | undefined = undefined;


          if (
            inferred.provider === "kie_music_v5" ||
            inferred.provider === "qwen3_tts_text_to_speech" ||
            inferred.provider === "qwen3_tts_voice_clone" ||
            inferred.provider === "qwen3_tts_voice_design" ||
            inferred.provider === "vibevoice"
          ) {
            audioUrl = parsedAudioUrls[0] || generateImage;
            audioUrls = parsedAudioUrls.length > 0 ? parsedAudioUrls : undefined;
            videoUrl = undefined;
          }

          return {
            taskId,
            provider: inferred.provider,
            modelLabel: inferred.modelLabel,
            topicTag,
            createdAt: toMs(createdAtRaw),
            updatedAt: Number.isFinite(updatedAtRaw)
              ? toMs(updatedAtRaw)
              : toMs(createdAtRaw),
            ownerId,
            status,
            statusMsg,
            videoUrl,
            audioUrl,
            audioUrls,
            imageUrl: generateImage, // Default mapping if no specific logic overrides
            prompt,
          } satisfies GenerationTask;
        })
        .filter(Boolean) as GenerationTask[];

      setTasks((prev) => mergeLatest(prev, next));
      setIsHydrated(true);
    } catch {
      setIsHydrated(true);
    }
  }, [isLoaded, mergeLatest, ownerId]);

  const scheduleRefreshFromHistory = useCallback(
    (delayMs: number) => {
      if (typeof window === "undefined") return;
      if (refreshTimerRef.current) window.clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = window.setTimeout(() => {
        refreshTimerRef.current = null;
        refreshFromHistory();
      }, delayMs);
    },
    [refreshFromHistory]
  );

  useEffect(() => {
    if (!isLoaded) return;
    if (!ownerId) {
      setIsHydrated(true);
      return;
    }
    setIsHydrated(false);
    const id = window.setTimeout(() => {
      refreshFromHistory();
    }, HISTORY_REFRESH_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [isLoaded, ownerId, refreshFromHistory]);

  const setOpen = useCallback((open: boolean) => setIsOpen(open), []);

  const openProgressDialog = useCallback((taskId: string) => {
    setProgressDialogTaskId(taskId);
    setIsProgressDialogOpen(true);
  }, []);

  const closeProgressDialog = useCallback(() => {
    setIsProgressDialogOpen(false);
  }, []);

  const addTask = useCallback(
    (task: AddTaskInput, options?: { open?: boolean }) => {
      const now = Date.now();
      const createdAt = task.createdAt ?? now;
      setTasks((prev) => {
        if (prev.some((t) => t.taskId === task.taskId)) return prev;
        const next: GenerationTask = {
          taskId: task.taskId,
          provider: task.provider,
          modelLabel: task.modelLabel,
          topicTag: task.topicTag,
          createdAt,
          updatedAt: now,
          ownerId,
          status: "pending",
          statusMsg: undefined,
          videoUrl: undefined,
          audioUrl: undefined,
          audioUrls: undefined,
          prompt: task.prompt,
          isLocalPending: task.isLocalPending,
        };
        return mergeLatest([next, ...prev], []);
      });
      if (options?.open) setIsOpen(true);
      scheduleRefreshFromHistory(HISTORY_REFRESH_DEBOUNCE_MS);
    },
    [mergeLatest, ownerId, scheduleRefreshFromHistory]
  );

  const updateTask = useCallback((taskId: string, updates: UpdateTaskInput) => {
    const now = Date.now();
    setTasks((prev) => {
      let changed = false;
      const next = prev.map((t) => {
        if (t.taskId !== taskId) return t;
        changed = true;
        return {
          ...t,
          ...updates,
          updatedAt: updates.updatedAt ?? now,
        };
      });
      return changed ? next : prev;
    });
  }, []);

  const replaceTaskId = useCallback(
    (tempTaskId: string, task: ReplaceTaskInput) => {
      const now = Date.now();
      setTasks((prev) => {
        const existingIndex = prev.findIndex((t) => t.taskId === tempTaskId);
        if (existingIndex === -1) return prev;
        if (prev.some((t) => t.taskId === task.taskId)) {
          return prev.filter((t) => t.taskId !== tempTaskId);
        }
        const existing = prev[existingIndex];
        const nextTask: GenerationTask = {
          ...existing,
          taskId: task.taskId,
          provider: task.provider ?? existing.provider,
          modelLabel: task.modelLabel ?? existing.modelLabel,
          prompt: task.prompt ?? existing.prompt,
          topicTag: task.topicTag ?? existing.topicTag,
          status: "pending",
          statusMsg: undefined,
          videoUrl: undefined,
          audioUrl: undefined,
          audioUrls: undefined,
          isLocalPending: false,
          createdAt: existing.createdAt,
          updatedAt: now,
        };
        const rest = prev.filter((t) => t.taskId !== tempTaskId);
        return mergeLatest([nextTask, ...rest], []);
      });
      setProgressDialogTaskId((prev) =>
        prev === tempTaskId ? task.taskId : prev
      );
      scheduleRefreshFromHistory(HISTORY_REFRESH_DEBOUNCE_MS);
    },
    [mergeLatest, scheduleRefreshFromHistory]
  );

  const removeTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.taskId !== taskId));
    setProgressDialogTaskId((prev) => {
      if (prev !== taskId) return prev;
      setIsProgressDialogOpen(false);
      return null;
    });
  }, []);

  const clearTasks = useCallback(() => {
    setTasks([]);
    setIsProgressDialogOpen(false);
    setProgressDialogTaskId(null);
  }, []);

  const isPollingRef = useRef(false);
  useEffect(() => {
    if (!isLoaded) return;
    const id = window.setInterval(async () => {
      if (isPollingRef.current) return;
      const pending = tasksRef.current.filter(
        (t) => t.status === "pending" && !t.isLocalPending
      );
      if (pending.length === 0) return;

      isPollingRef.current = true;
      try {
        const now = Date.now();
        const timedOutTasks: GenerationTask[] = [];
        const activeTasks: GenerationTask[] = [];

        for (const t of pending) {
          if (now - t.createdAt > TASK_TIMEOUT_MS) {
            timedOutTasks.push(t);
          } else {
            activeTasks.push(t);
          }
        }

        const results = await Promise.allSettled(
          activeTasks.map(async (t) => {
            const status = await checkTaskStatus(t);
            return { taskId: t.taskId, ...status };
          })
        );

        const updates = new Map<
          string,
          {
            status: number;
            statusMsg?: string;
            videoUrl?: string;
            audioUrl?: string;
            audioUrls?: string[];
            imageUrl?: string;
            imageUrls?: string[];
          }
        >();
        for (const res of results) {
          if (res.status !== "fulfilled") continue;
          updates.set(res.value.taskId, {
            status: res.value.status,
            statusMsg: res.value.statusMsg,
            videoUrl: res.value.videoUrl,
            audioUrl: res.value.audioUrl,
            audioUrls: (res.value as any).audioUrls,
            imageUrl: (res.value as any).imageUrl,
            imageUrls: (res.value as any).imageUrls,
          });
        }

        for (const t of timedOutTasks) {
          updates.set(t.taskId, {
            status: -1,
            statusMsg: "Task timed out",
            videoUrl: undefined,
            audioUrl: undefined,
            audioUrls: undefined,
            imageUrl: undefined,
            imageUrls: undefined,
          });
        }

        if (updates.size > 0) {
          const shouldRefreshHistory = Array.from(updates.values()).some(
            (u) => u.status === 1 || u.status === -1
          );
          const now = Date.now();
          setTasks((prev) => {
            const next = prev.map((t) => {
              const update = updates.get(t.taskId);
              if (!update) return t;
              const nextStatus: GenerationTaskStatus =
                update.status === 1
                  ? "success"
                  : update.status === -1
                    ? "failed"
                    : "pending";
              return {
                ...t,
                updatedAt: now,
                status: nextStatus,
                statusMsg: update.statusMsg ?? t.statusMsg,
                videoUrl: update.videoUrl ?? t.videoUrl,
                audioUrl: update.audioUrl ?? t.audioUrl,
                audioUrls: update.audioUrls ?? t.audioUrls,
                imageUrl: update.imageUrl ?? t.imageUrl,
                imageUrls: update.imageUrls ?? t.imageUrls,
              };
            });
            next.sort((a, b) => b.createdAt - a.createdAt);
            return next.slice(0, HISTORY_PAGE_SIZE);
          });
          if (shouldRefreshHistory) {
            scheduleRefreshFromHistory(
              HISTORY_REFRESH_AFTER_COMPLETE_DEBOUNCE_MS
            );
          }
        }
      } finally {
        isPollingRef.current = false;
      }
    }, POLL_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [isLoaded, scheduleRefreshFromHistory]);

  useEffect(() => {
    if (!isProgressDialogOpen) return;
    if (!progressDialogTaskId) return;
    const task = tasks.find((t) => t.taskId === progressDialogTaskId);
    if (!task) return;
    if (task.status !== "success") return;
    closeProgressDialog();
  }, [closeProgressDialog, isProgressDialogOpen, progressDialogTaskId, tasks]);

  const value = useMemo<TaskCenterContextValue>(
    () => ({
      tasks,
      isReady: isHydrated,
      isOpen,
      setOpen,
      isProgressDialogOpen,
      progressDialogTaskId,
      openProgressDialog,
      closeProgressDialog,
      addTask,
      updateTask,
      replaceTaskId,
      removeTask,
      clearTasks,
    }),
    [
      addTask,
      clearTasks,
      closeProgressDialog,
      isHydrated,
      isOpen,
      isProgressDialogOpen,
      openProgressDialog,
      progressDialogTaskId,
      replaceTaskId,
      removeTask,
      setOpen,
      tasks,
      updateTask,
    ]
  );

  return (
    <TaskCenterContext.Provider value={value}>
      {children}
    </TaskCenterContext.Provider>
  );
}

export function useTaskCenter() {
  const ctx = useContext(TaskCenterContext);
  if (!ctx) {
    throw new Error("useTaskCenter must be used within TaskCenterProvider");
  }
  return ctx;
}
