export type GptImageVersion = "gpt-image-2";

export type GptImageCreateTaskParams =
  | {
      mode: "text";
      version: GptImageVersion;
      params: {
        prompt: string;
        aspect_ratio: string;
        quality: "low" | "medium" | "high";
        resolution: "1k" | "2k";
      };
    }
  | {
      mode: "image";
      version: GptImageVersion;
      params: {
        prompt: string;
        images: string[];
        aspect_ratio?: string;
        quality: "low" | "medium" | "high";
        resolution: "1k" | "2k";
      };
    };

export type GptImageApiResponse = {
  code: number;
  msg: string;
  success?: boolean;
  data: {
    task_id: string;
    image_url?: string;
    image_urls?: string[] | Record<string, string>;
  };
};

export type GptImageCheckResponse = {
  code: number;
  msg: string;
  success?: boolean;
  data: {
    task_id: string;
    status: number;
    status_msg?: string;
    progress?: string;
    image_url?: string;
    image_urls?: string[] | Record<string, string>;
  };
};

export type GptImageTaskStatus = {
  taskId: string;
  status: number;
  statusMsg?: string;
  progress?: string;
  imageUrl?: string;
  imageUrls?: string[];
};
