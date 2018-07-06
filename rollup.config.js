import typescript from "rollup-typescript";
import sourcemaps from "rollup-plugin-sourcemaps";
export default [
  {
    input: "build/index.ts",
    output: {
      file: "bundle.common.js",
      format: "cjs"
    },
    plugins: [sourcemaps()]
  },
  {
    input: "build/index.ts",
    output: {
      file: "bundle.es6.mjs",
      format: "es"
    },
    plugins: [sourcemaps()]
  }
]