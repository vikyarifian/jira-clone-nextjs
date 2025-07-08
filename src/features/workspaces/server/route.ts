import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID } from "node-appwrite";
import { createWorkspaceSchema } from "../schemas";
import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";

const app = new Hono()
    .post(
        "/", zValidator("form", createWorkspaceSchema),
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const storage = c.get("storage");
            const user = c.get("user");

            const { name, image } = c.req.valid("form");

            let uploadedImageUrl: string | undefined;

            if (image instanceof File) {
                const file = await storage.createFile(
                    IMAGES_BUCKET_ID,
                    ID.unique(),
                    image,
                );

                // Get the file's ArrayBuffer and convert it to a base64 data URL
                const arrayBuffer = await storage.getFileView(IMAGES_BUCKET_ID, file.$id);
                const base64String = Buffer.from(arrayBuffer).toString("base64");
                uploadedImageUrl = `data:image/png;base64,${base64String}`;

                // Alternatively, you could use a Blob and URL.createObjectURL if serving in browser context
                // const blob = new Blob([arrayBuffer]);
                // uploadedImageUrl = URL.createObjectURL(blob);
            }
            
            const workspace = await databases.createDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                ID.unique(),
                {
                    name,
                    userId: user.$id,
                    imageUrl: uploadedImageUrl,
                }
            )

            return c.json({
                data: workspace,
            })
            
        }
    )

export default app;