import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { createPostInput, updatePostInput } from '@varuntd/pencraft-common';
import { authMiddleware } from './middleware';
import { generateGETPresignedUrl, generatePOSTPresignedUrl, getPublicS3Url } from '../lib/s3';


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


// this endpoint is used to create a new blog post, frontend will send blogId, title, subtitle, content, bannerImageKey, published
blogRouter.post('/', async (c) => {
    
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
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
        
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


// this endpoint is used to update a blog post, frontend will send blogId, title, subtitle, content, bannerImageKey, published
blogRouter.put('/', async (c) => {
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
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        // Only allow updating blogs owned by the logged-in user
        const blog = await prisma.blog.update({
            where: {
                blogId: body.blogId,
                authorId: loggedInUserId,
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


// this endpoint is used to get all the blogs with pagination
// eg: /api/v1/blog/bulk?page=1&limit=8
blogRouter.get("/bulk", async (c) => {
    try {
        const page = Number(c.req.query('page')) || 1;
        const limit = Number(c.req.query('limit')) || 8;
        const skip = (page - 1) * limit;

        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

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
        
        const blogsWithUrls = blogs.map(blog => {
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
blogRouter.get('/:blogId', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

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


// frontend send userid in the body too to increment its total claps
blogRouter.post('/:blogId/clap', async (c) => {
    const body = await c.req.json();
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

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


// this endpoint is used to upload blog banner image
// POST /blogBanner/upload/:blogId
blogRouter.post("/blogBanner/upload/:blogId", async (c) => {
  try {
    const { filename, contentType } = await c.req.json() as {
      filename: string;
      contentType: string;
    };
    console.log("Received filename:", filename, "and contentType:", contentType);
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
blogRouter.post("/images/batch-upload/:blogId", async (c) => {
    try {
        const blogId = c.req.param('blogId');
        const { images } = await c.req.json();  // its array of { filename, contentType, fileId } objects
        
        if (!images || !Array.isArray(images)) {
            return c.json({ error: "Images array is required" }, 400);
        }
        console.log("Received images for batch upload:", images);

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
        console.log("Generated upload URLs:", uploadUrls);
        
        return c.json({ uploadUrls });
    } catch (error) {
        console.error("Batch upload error:", error);
        return c.json({ error: "Failed to generate upload URLs" }, 500);
    }
});


// this endpoint is used to get the image by key, it will generate a presigned URL and return it
blogRouter.get("/images/:key", async (c) => {
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