// src/app/api/uploadthing/core.ts

import { auth } from "@/lib/auth/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const authenticate = async (req: Request) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not Authenticated");
  }
  return { userId: session.user.id, username: session.user.username };
};

export const TanglrFileRouter = {
  avatarUpload: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }: { req: Request }) => {
      const user = await authenticate(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return user;
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Avatar Uploaded by: ", metadata.username);
      console.log("File URL", file.ufsUrl);
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type TanglrFileRouter = typeof TanglrFileRouter;
