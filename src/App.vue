<script setup lang="ts">
import { ChatDemoView, TweetDemoView } from "@/views";
import { ref } from "vue";

const firstDemo = ref(true);
</script>

<template>
  <div>
    <button
      class="btn btn-ghost absolute top-4 left-4"
      @click="firstDemo = !firstDemo"
    >
      Change Demo
    </button>

    <ChatDemoView v-if="firstDemo" />

    <TweetDemoView v-else />
  </div>
</template>

<style>
/* Hide scrollbar for Chrome, Safari and Opera */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
