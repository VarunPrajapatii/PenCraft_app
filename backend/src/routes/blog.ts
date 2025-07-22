import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { createPostInput, updatePostInput } from '@varuntd/pencraft-common';
import { authMiddleware } from './middleware';
import { deleteS3Object, generateGETPresignedUrl, generatePOSTPresignedUrl, getPublicS3Url } from '../lib/s3';
import { blogMediaRouter } from './blog/blog-media';
import { blogInteractionsRouter } from './blog/blog-interactions';
import { blogCrudRouter } from './blog/blog-crud';

// Helper function to create Prisma client with Accelerate
function createPrismaClient(databaseUrl: string) {
  const prisma = new PrismaClient({
    datasourceUrl: databaseUrl,
  });
  
  // Always use Accelerate since we're using prisma:// URLs for both dev and prod
  return prisma.$extends(withAccelerate()) as any;
}


export const blogRouter = new Hono<{
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


blogRouter.use("/*", authMiddleware);

blogRouter.route("/", blogCrudRouter);
blogRouter.route("/", blogInteractionsRouter);
blogRouter.route("/", blogMediaRouter);