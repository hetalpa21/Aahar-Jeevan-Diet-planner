import { c as createServerRpc } from "./createServerRpc-CwiB1qMI.mjs";
import { c as createServerFn } from "./server-BVPxk9Ny.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const verifyPassword_createServerFn_handler = createServerRpc({
  id: "9148d632394f7e1af801c872f3a8498973e241b0d2d8ef455868fa086f9fe6fd",
  name: "verifyPassword",
  filename: "src/lib/api/auth.functions.ts"
}, (opts) => verifyPassword.__executeServer(opts));
const verifyPassword = createServerFn({
  method: "POST"
}).handler(verifyPassword_createServerFn_handler, async ({
  data: password
}) => {
  const appPassword = process.env.APP_PASSWORD;
  if (!appPassword) {
    throw new Error("APP_PASSWORD not configured on server");
  }
  if (password !== appPassword) {
    throw new Error("Incorrect password");
  }
  return {
    success: true
  };
});
export {
  verifyPassword_createServerFn_handler
};
