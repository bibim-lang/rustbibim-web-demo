import { createApp } from "vue";
import App from "./App.vue";

import "./assets/style.css";

import * as monaco from "monaco-editor";

function initMonaco() {
  monaco.languages.register({ id: "bibim" });
  monaco.languages.setMonarchTokensProvider("bibim", {
    keywords: ["@"],
    operators: [
      "+",
      "-",
      "*",
      "/",
      "&",
      "|",
      "!",
      "?=",
      ">",
      "<",
      "=",
      "^",
      ":",
    ],
    brackets: [
      {
        open: "(",
        close: ")",
        token: "delimiter.parenthesis",
      },
      {
        open: "{",
        close: "}",
        token: "delimiter.curly",
      },
      {
        open: "[",
        close: "]",
        token: "delimiter.square",
      },
    ],
    symbols: /[=><!&|+\-*/^:]+/,
    delimiters: /[;@]/,
    tokenizer: {
      root: [
        { include: "@whitespace" },
        [/[{}()\[\]]/, "@brackets"], // eslint-disable-line no-useless-escape
        [
          /@symbols/,
          {
            cases: {
              "@keywords": "keyword",
              "@operators": "operator",
              "@default": "",
            },
          },
        ],
        [/\d[\d\s]*/, "number"],
        [
          /@delimiters/,
          {
            cases: {
              "@keywords": "keyword",
              "@default": "delimiter",
            },
          },
        ],
      ],
      whitespace: [
        [/\s+/, "white"],
        [/~\s*#/, "comment", "@comment"],
      ],

      comment: [
        [/[^~#]+/, "comment"],
        [/~\s*#/, "comment.invalid"],
        [/#\s*~/, "comment", "@pop"],
        [/[~#]/, "comment"],
      ],
    },
  });
}
initMonaco();

createApp(App).mount("#app");
