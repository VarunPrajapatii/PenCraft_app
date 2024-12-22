import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { createPostInput, updatePostInput } from '@varuntd/pencraft-common';
import { authMiddleware } from './middleware';


export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string
    }
}>();


blogRouter.use("/*", authMiddleware);


blogRouter.post('/', async (c) => {
    const body = await c.req.json();
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

        const authorId = c.get("userId");

        const blog = await prisma.blog.create({
            data: {
                title: body.title,
                subtitle: body.subtitle,
                content: body.content,
                authorId: authorId
            }
        });

        return c.json({
            blogId: blog.blogId
        });
    } catch (error) {
        c.status(411);
        return c.json("Error while creating the blog post.")
    }
});

blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    const { success } = updatePostInput.safeParse(body);
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


        const blog = await prisma.blog.update({
            where: {
                blogId: body.blogId
            },
            data: {
                title: body.title,
                subtitle: body.subtitle,
                content: body.content
            }
        });

        return c.json({
            blogId: blog.blogId
        });
    } catch (error) {
        c.status(411);
        return c.json({
            message: "Error while updating the blog post."
        })
    }
});

// add pagination
blogRouter.get("/bulk", async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const blogs = await prisma.blog.findMany({
            select: {
                content: true,
                title: true,
                subtitle: true,
                blogId: true,
                publishedDate: true,
                claps: true,
                author: {
                    select: {
                        name: true,
                    }
                }
            }
        });
        return c.json({
            blogs
        })
    } catch (error) {
        c.status(411);
        return c.json({
            message: "Error while fetching the blog posts."
        })
    }
})

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
                author: {
                    select: {
                        name: true,
                        userId: true,
                    }
                }
            }
        });

        return c.json({
            blog
        });
    } catch (error) {
        c.status(411);
        return c.json({
            message: "Error while fetching the blog post."
        });
    }
});

blogRouter.post('/:blogId/clap', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const blogId = c.req.param("id");

        const updatedBlog = await prisma.blog.update({
            where: {
                blogId: blogId,
            },
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

        return c.json({
            blogId: updatedBlog.blogId,
            claps: updatedBlog.claps,
        });
    } catch (error) {
        c.status(411);
        return c.json({
            message: "Error while increasing claps for the blog post.",
        });
    }
});