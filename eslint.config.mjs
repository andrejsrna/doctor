import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import nextPlugin from "@next/eslint-plugin-next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    plugins: {
      "@next/next": nextPlugin,
    },
  },
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/**",
      "postcss.config.mjs",
      "*.config.js",
      "*.config.ts"
    ]
  },
  ...compat.extends("next", "next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
