<script setup lang="ts">
import { ref } from "vue";
import InlineSvg from "vue-inline-svg";

import api from "@/api";

const loading = ref(false);

const messages = ref<
  {
    text: string;
    isUser: boolean;
    evaluationValue: "false" | "mixed" | "true" | null;
    evaluationText: string | null;
  }[]
>([]);

const getMessageColor = (evaluationValue: string) => {
  switch (evaluationValue) {
    case "false":
      return "bg-[#d64933]";
    case "mixed":
      return "bg-yellow-500";
    case "true":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const getMessageTextColor = (evaluationValue: string) => {
  switch (evaluationValue) {
    case "false":
      return "text-white";
    case "mixed":
      return "text-black";
    case "true":
      return "text-black";
    default:
      return "text-gray-500";
  }
};

const userInput = ref("");

function userSendInput() {
  if (!userInput.value) return;

  loading.value = true;
  // const tmp = userInput.value;

  messages.value.push({
    text: userInput.value,
    isUser: true,
    evaluationValue: null,
    evaluationText: null,
  });

  userInput.value = "";

  const chat = messages.value.map((m) => {
    return { content: m.text, role: m.isUser ? "user" : "assistant" };
  });

  // evaluate the message using the api
  api.evaluate.post(chat).then((response) => {
    loading.value = false;
    messages.value.push({
      text: response.data.message,
      isUser: false,
      evaluationValue: response.data.evaluation,
      evaluationText: response.data.proof,
    });
  });
}

const getEvaluationIcon = (evaluationValue: string) => {
  switch (evaluationValue) {
    case "false":
      return "/icons/cross.svg";
    case "mixed":
      return "/icons/warning.svg";
    case "true":
      return "/icons/check.svg";
    default:
      return "";
  }
};
</script>

<template>
  <!-- create chat interface -->
  <h1 class="text-center text-3xl font-bold mt-4">Chat Demo</h1>

  <div class="w-full h-full flex flex-col items-center p-4">
    <!-- iterate and display all messages, if it is from the user use chat-end -->
    <!-- if it is from the bot use chat-start -->
    <div class="w-2/3 max-h-[520px] overflow-scroll hide-scrollbar">
      <div
        class="chat my-2"
        v-for="message in messages"
        :key="message.text"
        :class="message.isUser ? 'chat-end' : 'chat-start'"
      >
        <div class="chat-image avatar">
          <div
            class="w-10 rounded-full flex flex-row items-center justify-center"
            :class="message.isUser ? '' : 'bg-white'"
          >
            <img
              v-if="message.isUser"
              alt="chat bubble component image"
              src="/images/user.png"
            />

            <div
              v-else
              class="w-full h-full flex flex-col items-center justify-center"
            >
              <inline-svg src="/icons/robot.svg" class="h-8 w-8 text-black" />
            </div>
          </div>
        </div>

        <div v-if="message.isUser" class="chat-bubble">
          {{ message.text }}
        </div>

        <div class="flex flex-col w-full" v-else>
          <div class="chat-bubble chat-bubble-primary">
            {{ message.text }}
          </div>

          <div
            tabindex="0"
            class="collapse collapse-arrow mt-1 overflow-visible"
            :class="getMessageColor(message.evaluationValue)"
            v-if="message.evaluationValue !== null"
          >
            <div
              class="collapse-title flex flex-row items-center gap-2 overflow-visible"
              :class="getMessageTextColor(message.evaluationValue)"
            >
              <inline-svg
                :src="getEvaluationIcon(message.evaluationValue)"
                class="h-5 w-5"
              />

              <p class="text-sm font-bold capitalize">
                {{ message.evaluationValue }}
              </p>

              <div
                class="tooltip tooltip-top capitalize"
                data-tip="AI models have bias and inaccuracies. Our LLM evaluation should help you be more aware of the mistakes AI systems make!"
              >
                <p class="text-xs italic font-semibold">
                  evaluated by GPT-4. What is this?
                </p>
              </div>
            </div>

            <div
              class="collapse-content"
              :class="getMessageTextColor(message.evaluationValue)"
            >
              <p>
                {{ message.evaluationText }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="chat chat-start mb-2" v-if="loading">
        <div class="chat-bubble">
          <span class="loading loading-dots loading-md" />
        </div>
      </div>
    </div>

    <div class="w-3/4 flex flex-row gap-2 absolute bottom-4">
      <input
        type="text"
        placeholder="Type here"
        class="input input-bordered input-lg w-full"
        v-model="userInput"
        @keyup.enter="userSendInput"
      />

      <button class="btn btn-square btn-lg" @click="userSendInput">
        <inline-svg src="/icons/send.svg" class="h-5 w-5 text-base-content" />
      </button>
    </div>
  </div>
</template>
