import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { TanglrFileRouter } from "@/app/api/uploadthing/core";
import "@uploadthing/react/styles.css";

export const UploadButton = generateUploadButton<TanglrFileRouter>();
export const UploadDropzone = generateUploadDropzone<TanglrFileRouter>();
