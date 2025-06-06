import { createUploadthing } from 'uploadthing/express';

const f = createUploadthing();

export const uploadRouter = {
  logoUpload: f({
    image: { maxFileSize: '100KB', maxFileCount: 1, minFileCount: 1 },
  })
    // .middleware(({ req }) => auth(req))
    .onUploadComplete(data => {}),

  // Scratch Card Background route - allows PNG, JPEG, WEBP with max file size of 500KB
  scratchCardBackground: f({
    image: { maxFileSize: '500KB', maxFileCount: 1, minFileCount: 1 },
  })
    // .middleware(({ req }) => auth(req))
    .onUploadComplete(data =>
    {
    }
    ),

  // Prize Image upload route - allows PNG, JPEG, WEBP with max file size of 1MB
  prizeImage: f({
    image: { maxFileSize: '1MB', maxFileCount: 1, minFileCount: 1 },
  })
    // .middleware(({ req }) => auth(req))
    .onUploadComplete(data => {}),
};

// export type OurFileRouter = typeof uploadRouter;
