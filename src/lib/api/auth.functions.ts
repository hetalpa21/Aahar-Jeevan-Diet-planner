import { createServerFn } from "@tanstack/react-start";

export const verifyPassword = createServerFn({ method: "POST" })
  .handler(async ({ data: password }: { data: string }) => {
    const appPassword = process.env.APP_PASSWORD;
    if (!appPassword) {
      throw new Error("APP_PASSWORD not configured on server");
    }
    if (password !== appPassword) {
      throw new Error("Incorrect password");
    }
    return { success: true };
  });
