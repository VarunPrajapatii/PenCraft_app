import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { createPostInput, updatePostInput } from '@varuntd/pencraft-common';
import { authMiddleware } from '../middleware';
import { deleteS3Object, getPublicS3Url } from '../../lib/s3';

function createPrismaClient(databaseUrl: string) {
  const prisma = new PrismaClient({
    datasourceUrl: databaseUrl,
  });
  return prisma.$extends(withAccelerate()) as any;
}

export const blogCrudRouter = new Hono<{
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



// this endpoint is used to create a new blog post, frontend will send blogId, title, subtitle, content, bannerImageKey, published
blogCrudRouter.post("/", async (c) => {
    
    const body = await c.req.json();
    const loggedInUserId = c.get("userId");
    const { success } = createPostInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        });
    };

    try {
        const prisma = createPrismaClient(c.env.DATABASE_URL);
        
        const blog = await prisma.blog.create({
            data: {
                blogId: body.blogId,
                title: body.title,
                subtitle: body.subtitle,
                content: body.content,
                authorId: loggedInUserId,
                bannerImageKey: body.bannerImageKey || "",
                published: body.published,
                publishedDate: body.published ? new Date() : null,
            }
        });

        return c.json({
            blogId: blog.blogId
        });
    } catch (error) {
        c.status(500);
        const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? "Something went wrong while processing your request" + String(error.message) 
        : "Something went wrong while processing your request";
        
        return c.text(errorMessage);
    }
});

// this endpoint is used to delete a blog post, frontend will send blogId
blogCrudRouter.delete("/", async (c) => {
    const { blogId } = await c.req.json();
    const loggedInUserId = c.get("userId");

    try {
        const prisma = createPrismaClient(c.env.DATABASE_URL);

        // Find the blog post to verify ownership and get details
        const blog = await prisma.blog.findUnique({
            where: { blogId: blogId },
        });

        if (!blog || blog.authorId !== loggedInUserId) {
            return c.json({ error: "Blog not found or you are not the author" }, 404);
        }

        // Delete the banner image from S3 if it exists
        if (blog.bannerImageKey && blog.bannerImageKey.trim() !== "") {
            try {
                await deleteS3Object(c, blog.bannerImageKey);
                // console.log(`Successfully deleted banner image: ${blog.bannerImageKey}`);
            } catch (error) {
                console.error(`Failed to delete banner image ${blog.bannerImageKey}:`, error);
                // Continue with deletion even if banner image deletion fails
            }
        }

        // Extract and delete all content images from S3
        let imageKeys: string[] = [];
        if (blog.content) {
            try {
                let contentObj: any = blog.content;
                if (contentObj && Array.isArray(contentObj.blocks)) {
                    contentObj.blocks.forEach((block: any) => {
                        if (block.type === "image" && block.data?.file?.url) {
                            const imageKey = block.data.file.url;
                            imageKeys.push(imageKey);
                        }
                    });
                }
            } catch (error) {
                console.error("Error parsing blog content for image extraction:", error);
            }
        }

        // Delete all content images from S3
        if (imageKeys.length > 0) {
            try {
                const deletionResults = await Promise.allSettled(
                    imageKeys.map(imageKey => deleteS3Object(c, imageKey))
                );
                
                deletionResults.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        // console.log(`Successfully deleted content image: ${imageKeys[index]}`);
                    } else {
                        console.error(`Failed to delete content image ${imageKeys[index]}:`, result.reason);
                    }
                });
            } catch (error) {
                console.error("Error deleting content images:", error);
                // Continue with blog deletion even if some images fail to delete
            }
        }

        // Finally, delete the blog from database
        await prisma.blog.delete({
            where: {
                blogId: blogId
            }
        });

        // console.log(`Successfully deleted blog: ${blogId}`);
        return c.json({ 
            message: "Blog deleted successfully",
            deletedImages: {
                banner: blog.bannerImageKey ? 1 : 0,
                content: imageKeys.length
            }
        }, 200);

    } catch (error) {
        console.error("Error in blog deletion:", error);
        c.status(500);
        const errorMessage = error && typeof error === 'object' && 'message' in error 
            ? "Something went wrong while processing your request: " + String(error.message) 
            : "Something went wrong while processing your request";
            
        return c.text(errorMessage);
    }    
});


// this endpoint is used to get all the blogs with pagination
// eg: /api/v1/blog/bulk?page=1&limit=8
blogCrudRouter.get("/bulk", async (c) => {
    try {
        const page = Number(c.req.query('page')) || 1;
        const limit = Number(c.req.query('limit')) || 8;
        const skip = (page - 1) * limit;

        const prisma = createPrismaClient(c.env.DATABASE_URL);

        const totalBlogs = await prisma.blog.count({
            where: { published: true }
        });

        const blogs = await prisma.blog.findMany({
            where: { published: true },
            skip,
            take: limit,
            orderBy: {
                publishedDate: 'desc' // means the resent blog will be first
            },
            select: {
                bannerImageKey: true,
                content: true,
                title: true,
                subtitle: true,
                blogId: true,
                publishedDate: true,
                claps: true,
                author: {
                    select: {
                        name: true,
                        profileImageKey: true,
                        userId: true,
                        username: true,
                    }
                }
            }
        });
        
        const blogsWithUrls = blogs.map((blog: any) => {
            let bannerImageUrl = null;
            if (blog.bannerImageKey) {
                bannerImageUrl = getPublicS3Url(c, blog.bannerImageKey);
            }
            
            let profileImageUrl = null;
            if (blog.author?.profileImageKey) {
                profileImageUrl = getPublicS3Url(c, blog.author.profileImageKey);
            }
            
            return {
                ...blog,
                bannerImageUrl,
                author: {
                    ...blog.author,
                    profileImageUrl
                }
            };
        });
        
        return c.json({
            blogs: blogsWithUrls,
            pagination: {
                total: totalBlogs,
                page,
                limit,
                pages: Math.ceil(totalBlogs / limit)
            }
        })
    } catch (error) {
        c.status(500);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? "Something went wrong while processing your request" + String(error.message) 
        : "Something went wrong while processing your request";
        
      return c.text(errorMessage);
    }
})


// this endpoint is used to get blog by blogId
blogCrudRouter.get('/:blogId', async (c) => {
    try {
        const prisma = createPrismaClient(c.env.DATABASE_URL);

        const blogId = c.req.param("blogId");

        const blog = await prisma.blog.findFirst({
            where: {
                blogId
            },
            select: {
                blogId: true,
                title: true,
                subtitle: true,
                content: true,
                publishedDate: true,
                claps: true,
                bannerImageKey: true,
                author: {
                    select: {
                        name: true,
                        userId: true,
                        profileImageKey: true,
                        username: true,
                    }
                }
            }
        });

        let bannerImageUrl = null;
        if (blog?.bannerImageKey) {
            bannerImageUrl = getPublicS3Url(c, blog.bannerImageKey);
        }

        let profileImageUrl = null;
        if (blog?.author?.profileImageKey) {
            profileImageUrl = getPublicS3Url(c, blog.author.profileImageKey);
        }

        const blogWithUrls = blog ? {
            ...blog,
            bannerImageUrl,
            author: {
                ...blog.author,
                profileImageUrl
            }
        } : null;

        return c.json({
            blog: blogWithUrls
        });
    } catch (error) {
        c.status(500);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? "Something went wrong while processing your request" + String(error.message) 
        : "Something went wrong while processing your request";
        
      return c.text(errorMessage);
    }
});

// this endpoint is used to update a blog post, frontend will send blogId, title, subtitle, content, bannerImageKey, published
blogCrudRouter.put('/', async (c) => {
    const body = await c.req.json();
    const loggedInUserId = c.get("userId");
    const { success } = updatePostInput.safeParse(body);
    
    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        });
    }

    try {
        const prisma = createPrismaClient(c.env.DATABASE_URL);

        // Only allow updating blogs owned by the logged-in user
        // First find the blog to verify ownership
        const existingBlog = await prisma.blog.findUnique({
            where: { blogId: body.blogId },
            select: { authorId: true }
        });

        if (!existingBlog || existingBlog.authorId !== loggedInUserId) {
            c.status(404);
            return c.json({ error: "Blog not found or you are not the author" });
        }

        const blog = await prisma.blog.update({
            where: {
                blogId: body.blogId,
            },
            data: {
                title: body.title,
                subtitle: body.subtitle,
                content: body.content,
                bannerImageKey: body.bannerImageKey || "",
                published: body.published,
                publishedDate: body.published ? new Date() : null,
            }
        });

        return c.json({
            blogId: blog.blogId
        });
    } catch (error) {
        c.status(500);
        const errorMessage = error && typeof error === 'object' && 'message' in error 
            ? "Something went wrong while processing your request" + String(error.message) 
            : "Something went wrong while processing your request";
        return c.text(errorMessage);
    }
});