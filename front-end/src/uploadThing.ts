import { createUploadthing, type FileRouter } from 'uploadthing/express';

const f = createUploadthing();

export const uploadRouter = {
  logoUpload: f({
    //@ts-ignore
    image: { maxFileSize: '100KB', maxFileCount: 1, minFileCount: 1 },
  })
    // .middleware(({ req }) => auth(req))
    // @ts-ignore
    .onUploadComplete(data => {}),

  // Scratch Card Background route - allows PNG, JPEG, WEBP with max file size of 500KB
  scratchCardBackground: f({
    //@ts-ignore
    image: { maxFileSize: '500KB', maxFileCount: 1, minFileCount: 1 },
  })
    // .middleware(({ req }) => auth(req))
    // @ts-ignore
    .onUploadComplete(data => {}),

  // Prize Image upload route - allows PNG, JPEG, WEBP with max file size of 1MB
  prizeImage: f({
    image: { maxFileSize: '1MB', maxFileCount: 1, minFileCount: 1 },
  })
    // .middleware(({ req }) => auth(req))
    // @ts-ignore
    .onUploadComplete(data => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
export type OurFileRoutes = keyof OurFileRouter;
