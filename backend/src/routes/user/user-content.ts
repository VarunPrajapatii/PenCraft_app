import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { authMiddleware } from "../middleware";
import { getPublicS3Url } from "../../lib/s3";

function createPrismaClient(databaseUrl: string) {
  const prisma = new PrismaClient({
    datasourceUrl: databaseUrl,
  });
  
  return prisma.$extends(withAccelerate()) as any;
}

export const userContentRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
    Variables: {
        userId: string;
    };
}>();

userContentRouter.use("/*", authMiddleware);



userContentRouter.get("/:username/userPublishedBlogs", async (c) => {
    try {
        const prisma = createPrismaClient(c.env.DATABASE_URL);

        const userId = c.req.param("username");

        const user = await prisma.user.findUnique({
            where: { username: userId },
            select: { userId: true }
        })

        if(!user) {
            return c.json({ error: "User not found" }, 404);
        }

        const blogs = await prisma.blog.findMany({
            where: { authorId: user.userId, published : true },
            orderBy: { publishedDate: "desc" },
            select: {
                blogId: true,
                title: true,
                subtitle: true,
                bannerImageKey: true,
                content: true,
                publishedDate: true,
                claps: true,
            },
        });

        const blogsWithUrls = blogs.map(blog => {
            let bannerImageUrl = null;
            if (blog.bannerImageKey) {
                bannerImageUrl = getPublicS3Url(c, blog.bannerImageKey);
            }
            
            return {
                ...blog,
                bannerImageUrl,
            };
        });
        return c.json({ blogs: blogsWithUrls });
    } catch (error) {
        c.status(500);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? "Something went wrong while processing your request" + String(error.message) 
        : "Something went wrong while processing your request";
        
      return c.text(errorMessage);
    }
});


userContentRouter.get("/:username/userDrafts", async (c) => {
    try {
        const prisma = createPrismaClient(c.env.DATABASE_URL);

        const userId = c.req.param("username");

        const user = await prisma.user.findUnique({
            where: { username: userId },
            select: { userId: true }
        })

        if(!user) {
            return c.json({ error: "User not found" }, 404);
        }

        const blogs = await prisma.blog.findMany({
            where: { authorId: user.userId, published : false },
            orderBy: { publishedDate: "desc" },
            select: {
                blogId: true,
                title: true,
                subtitle: true,
                bannerImageKey: true,
                content: true,
                claps: true,
            },
        });

        const blogsWithUrls = blogs.map(blog => {
            let bannerImageUrl = null;
            if (blog.bannerImageKey) {
                bannerImageUrl = getPublicS3Url(c, blog.bannerImageKey);
            }
            
            return {
                ...blog,
                bannerImageUrl,
            };
        });
        return c.json({ blogs: blogsWithUrls });
    } catch (error) {
        c.status(500);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? "Something went wrong while processing your request" + String(error.message) 
        : "Something went wrong while processing your request";
        
      return c.text(errorMessage);
    }
});

