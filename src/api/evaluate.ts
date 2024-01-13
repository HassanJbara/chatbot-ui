import type { AxiosPromise } from "axios";
import { axiosAPI } from "@/api/axios";

const evaluate = {
  post: (
    chat: { content: string; role: "user" | "assistant" }[]
  ): AxiosPromise<{
    evaluation: "false" | "mixed" | "true" | null;
    message: string;
    proof: string;
  }> => {
    return axiosAPI.post("evaluate/", {
      chat: chat,
    });
  },
};

export default evaluate;
