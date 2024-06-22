import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
import { createPostInput, updatePostInput } from '@varuntd/pencraft-common';


export const postRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string
    }
}>();


postRouter.use("/*", async (c, next) => {
    const authHeader = c.req.header("authorization") || "";
    const user = await verify(authHeader, c.env.JWT_SECRET);
    if(user) {
        // @ts-ignore
        c.set("userId", user.id);
        await next();
    } else {
        c.status(403);
        return c.json({
            message: "You are not logged in."
        })
    }
});


postRouter.post('/', async (c) => {
    const body = await c.req.json();
    const {success} = createPostInput.safeParse(body);
    if(!success) {
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
      
        const post = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: authorId
            }
        });
      
        return c.json({
            id: post.id
        });
    } catch (error) {
        c.status(411);
        return c.json("Error while creating the blog post.")
    }
});
  
postRouter.put('/', async (c) => {
    const body = await c.req.json();
    const {success} = updatePostInput.safeParse(body);
    if(!success) {
      c.status(411);
      return c.json({
        message: "Inputs not correct"
      });
    };
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
      
      
        const post = await prisma.post.update({
            where: {
                id: body.id
            },
            data: {
                title: body.title,
                content: body.content
            }
        });
      
        return c.json({
            id: post.id
        });
    } catch (error) {
        c.status(411);
        return c.json({
            message: "Error while updating the blog post."
        })
    }
});

// add pagination
postRouter.get("/bulk", async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const posts = await prisma.post.findMany({
            select: {
                content: true,
                title: true,
                id: true,
                author: {
                    select: {
                        name: true,
                    }
                }
            }
        });
        return c.json({
            posts: posts
        })
    } catch (error) {
        c.status(411);
        return c.json({
            message: "Error while fetching the blog posts."
        })
    }
})

postRouter.get('/:id', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
      
        const id = c.req.param("id");
      
        const post = await prisma.post.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                title: true,
                content: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        });
      
        return c.json({
            post
        });
    } catch (error) {
        c.status(411);
        return c.json({
            message: "Error while fetching the blog post."
        });
    }
});