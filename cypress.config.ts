import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 400,
  viewportHeight: 900,

  e2e: {
    baseUrl: "http://localhost:3000",
  },
});
