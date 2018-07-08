import typescript from "rollup-typescript";
import sourcemaps from "rollup-plugin-sourcemaps";
export default [
  {
    input: __dirname + "/dist/index.js",
    output: {
      file: "bundle.common.js",
      format: "cjs",
      sourcemap: true,
    },
    plugins: [sourcemaps()]
  },
  {
    input: __dirname + "/dist/index.js",
    output: {
      file: "bundle.es6.mjs",
      format: "es",
      sourcemap: true,
    },
    plugins: [sourcemaps()]
  }
]