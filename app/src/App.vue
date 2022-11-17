<script setup lang="ts">
import Editor from "./components/Editor.vue";
import * as bibim from "rustbibim-wasm";
import { ref } from "vue";

let code = ref(`{
  [0; @:1 = {
    [0; 72]
    [1; 69]
    [2; 76]
    [3; 76]
    [4; 79]
    [5; 32]
    [6; 87]
    [7; 79]
    [8; 82]
    [9; 76]
    [10; 68]
    [11; 10]
  }]
}`);
let stdin_data = ref("");
let stdout_data = ref("");

function stdin(): Uint8Array {
  return new TextEncoder().encode(stdin_data.value);
}
function stdout(data: Uint8Array) {
  console.log(data);
  stdout_data.value += new TextDecoder().decode(data);
}

function runCode() {
  stdout_data.value = "";
  try {
    bibim.run_code(code.value, stdin, stdout);
  } catch (error) {
    stdout_data.value = "ERROR: " + error;
  }
}
</script>

<template>
  <div class="bg-white py-12 sm:py-16 lg:py-20">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="sm:text-center">
        <h1 class="text-3xl font-bold leading-8 text-gray-900">
          RustBibim Demo
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          <a
            class="text-blue-600 hover:text-blue-800 visited:text-purple-600"
            href="https://github.com/bibim-lang/rustbibim"
            >RustBibim</a
          >은
          <a
            class="text-blue-600 hover:text-blue-800 visited:text-purple-600"
            href="https://bibim-lang.github.io/"
            >Bibim</a
          >의 Rust 구현체입니다.<br />
          이 페이지는 RustBibim을 브라우저에서 실행해 볼 수 있는 데모
          페이지입니다.<br />
          더 많은 Bibim의 코드 예제는
          <a
            class="text-blue-600 hover:text-blue-800 visited:text-purple-600"
            href="https://github.com/bibim-lang/pybibim/tree/master/testcode"
            >PyBibim 테스트코드</a
          >에서 확인할 수 있습니다.
        </p>
      </div>
      <div class="h-[800px]">
        <Editor v-model="code"></Editor>
      </div>
      <div>
        <label for="stdin" class="block text-sm font-medium text-gray-700">
          STDIN
        </label>
        <div class="mt-1">
          <textarea
            :value="stdin_data"
            @input="stdin_data = ($event.target as HTMLInputElement).value"
            id="stdin"
            name="stdin"
            rows="1"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <div>
        <span class="block text-sm font-medium text-gray-700">STDOUT</span>
        <div class="mt-1">
          <pre
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >{{ stdout_data }}</pre
          >
        </div>
      </div>
      <button
        type="button"
        @click="runCode"
        class="mt-1 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        실행
      </button>
    </div>
  </div>
</template>
