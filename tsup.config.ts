import { defineConfig } from 'tsup'
import { config } from "dotenv"

config({ quiet: true })
const IS_PROD = process.env.APP_ENVIRONMENT_STATE === "production" ? true : false

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false,
  splitting: true,
  sourcemap: false,
  clean: true,
  minify: IS_PROD,
  outDir: 'dist',
})
