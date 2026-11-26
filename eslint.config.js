import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";

export default [
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
      },
    },
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
    },
  },
  {
    ignores: [".next", "node_modules", "dist", "build", ".git"],
  },
];
