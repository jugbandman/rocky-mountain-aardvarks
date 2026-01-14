import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",
    schema: "./shared/schema.ts",
    dialect: "sqlite",
    driver: "d1-http",
});
