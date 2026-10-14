import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getSession } from "@/lib/auth/session";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  bookCover: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // Solo un admin con sesión puede subir portadas
      const session = await getSession();
      if (!session) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.userId };
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Portada subida", file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
