import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { authMiddleware } from '../middleware';

function createPrismaClient(databaseUrl: string) {
  const prisma = new PrismaClient({
    datasourceUrl: databaseUrl,
  });
  return prisma.$extends(withAccelerate()) as any;
}

export const blogInteractionsRouter = new Hono<{
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


// frontend send userid in the body too to increment its total claps
blogInteractionsRouter.post('/:blogId/clap', async (c) => {
    const body = await c.req.json();
    try {
        const prisma = createPrismaClient(c.env.DATABASE_URL);

        const blogId = c.req.param("blogId");
        

        const blog = await prisma.blog.findUnique({
            where: { blogId },
            select: { authorId: true }
        });

        if (!blog) {
            return c.json({ error: "Blog not found" }, 404);
        }

        const updatedBlog = await prisma.blog.update({
            where: { blogId },
            data: {
                claps: {
                    increment: 1,
                },
            },
            select: {
                blogId: true,
                claps: true,
            },
        });

        await prisma.user.update({
            where: {
                userId: blog.authorId,
            },
            data: {
                totalClaps: {
                    increment: 1,
                },
            },
        });

        return c.json({
            blogId: updatedBlog.blogId,
            claps: updatedBlog.claps,
        });
    } catch (error) {
        c.status(500);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? "Something went wrong while processing your request" + String(error.message) 
        : "Something went wrong while processing your request";
        
      return c.text(errorMessage);
    }
});
