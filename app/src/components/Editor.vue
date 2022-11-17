<script setup lang="ts">
import * as monaco from "monaco-editor";
import { debounce } from "radash";
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps<{
  modelValue: string;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const container = ref<HTMLElement>();

let editor: monaco.editor.IStandaloneCodeEditor | undefined = undefined;

function onResizeWithoutDebounce() {
  editor?.layout();
}

const onResize = debounce({ delay: 50 }, onResizeWithoutDebounce);

onMounted(() => {
  if (container.value === undefined) {
    return;
  }
  editor = monaco.editor.create(container.value, {
    value: props.modelValue,
    language: "bibim",
  });
  editor.onDidChangeModelContent(() => {
    emits("update:modelValue", editor?.getValue() ?? "");
  });

  window.addEventListener("resize", onResize);
  onResizeWithoutDebounce();
});

onUnmounted(() => {
  editor?.dispose();
  window.removeEventListener("resize", onResize);
});
</script>

<template>
  <div ref="container" class="w-full h-full"></div>
</template>
