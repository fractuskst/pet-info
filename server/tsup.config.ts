import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  outDir: "dist",
  format: "esm",
  target: "node20",
  clean: true,
  minify: false,
  sourcemap: true,
  tsconfig: "tsconfig.json",
  dts: false,
  noExternal: [/^@pet-info\/.*/],
});
