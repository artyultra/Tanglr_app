// src/app/api/uploadthing/route.ts

import { createRouteHandler } from "uploadthing/next";
import { TanglrFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: TanglrFileRouter,
});
