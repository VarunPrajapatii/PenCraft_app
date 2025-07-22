import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { authMiddleware } from '../middleware';
import { deleteS3Object, generateGETPresignedUrl, generatePOSTPresignedUrl } from '../../lib/s3';

function createPrismaClient(databaseUrl: string) {
  const prisma = new PrismaClient({
    datasourceUrl: databaseUrl,
  });
  return prisma.$extends(withAccelerate()) as any;
}

export const blogMediaRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
        AWS_REGION: string;
        S3_BUCKET: string;
        AWS_ACCESS_KEY_ID: string;
        AWS_SECRET_ACCESS_KEY: string;
    },
    Variables: {
        userId: string
    }
}>();




// this endpoint is used to upload blog banner image
// POST /blogBanner/upload/:blogId
blogMediaRouter.post("/blogBanner/upload/:blogId", async (c) => {
  try {
    const { filename, contentType } = await c.req.json() as {
      filename: string;
      contentType: string;
    };
    const blogId = c.req.param("blogId");

    const ext = filename.split(".").pop() ?? "";
    const key = `banner/${blogId}.${ext}`;

    const uploadUrl = await generatePOSTPresignedUrl(c, key, contentType);

    return c.json({ uploadUrl, key });
  } catch (error) {
    console.error(error);
    c.status(500);
    return c.text("Failed to generate upload URL");
  }
});


// this endpoint is used to get presigned URLs for uploading multiple blog images
// Batch endpoint for blog images
blogMediaRouter.post("/images/batch-upload/:blogId", async (c) => {
    try {
        const blogId = c.req.param('blogId');
        const { images } = await c.req.json();  // its array of { filename, contentType, fileId } objects
        
        if (!images || !Array.isArray(images)) {
            return c.json({ error: "Images array is required" }, 400);
        }

        const uploadUrls = [];
        
        for (const image of images) {
            const { filename, contentType, fileId } = image;
            const imageId = crypto.randomUUID();
            const key = `blog/${blogId}/${imageId}`;
            
            // Generate presigned URL
            const uploadUrl = await generatePOSTPresignedUrl(c, key, contentType);
            
            uploadUrls.push({
                fileId,
                uploadUrl,
                key,
                imageId,
            });
        }
        
        return c.json({ uploadUrls });
    } catch (error) {
        console.error("Batch upload error:", error);
        return c.json({ error: "Failed to generate upload URLs" }, 500);
    }
});


// this endpoint is used to get the image by key, it will generate a presigned URL and return it
blogMediaRouter.get("/images/:key", async (c) => {
    try {
        const key = c.req.param("key");
        if (!key) {
            return c.json({ error: "Image key is required" }, 400);
        }
        
        const signedUrl = await generateGETPresignedUrl(c, key);
        return c.json({ signedUrl });
    } catch (error) {
        console.error("Error generating signed URL:", error);
        return c.json({ error: "Failed to generate signed URL" }, 500);
    }
});


// Delete multiple images from S3
blogMediaRouter.delete("/images/batch-delete", async (c) => {
    try {
        const { keys } = await c.req.json();
        
        if (!keys || !Array.isArray(keys)) {
            return c.json({ error: "Keys array is required" }, 400);
        }


        const deletionResults = await Promise.all(
            keys.map(async (key: string) => await deleteS3Object(c, key))
        );

        // const deletePromises = keys.map(key => s3.deleteObject({ Bucket: c.env.S3_BUCKET, Key: key }).promise());
        // await Promise.all(deletePromises);
        
        return c.json({ deleted: keys.length });
    } catch (error) {
        console.error("Error deleting images:", error);
        return c.json({ error: "Failed to delete images" }, 500);
    }
});
