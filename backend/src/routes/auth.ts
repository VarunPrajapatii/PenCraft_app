import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'
import { signinInput, signupInput } from '@varuntd/pencraft-common';
import { authMiddleware } from './middleware';

export const authRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }
}>();

authRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    
    try {
      const body = await c.req.json();

      if (!body || typeof body !== 'object' || !body.name || !body.email || !body.password) {
        c.status(400);
        return c.json({ message: 'Invalid or missing inputs' });
      }

      const {success} = signupInput.safeParse(body);
      if(!success) {
        c.status(411);
        return c.json({
          message: "Inputs not correct"
        });
      };
  
      const user = await prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: body.password,
        },
      });
  
      const token = await sign({userId: user.userId }, c.env.JWT_SECRET);
      return c.json({
        jwt: token,
        userId: user.userId
      });
    } catch (error) {
      c.status(411);
      return c.text("Somethign went wrong!");
    }
});
  
authRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const body = await c.req.json();
    const {success} = signinInput.safeParse(body);
    if(!success) {
      c.status(411);
      return c.json({
        message: "Inputs not correct"
      });
    };
  
    try {
      const user = await prisma.user.findFirst({
        where: {
          email: body.email,
          password: body.password
        }
      });
    
      if(!user) {
        c.status(403);
        return c.json({ message: "Incorrect Credentials" });
      }
    
      const token = await sign({userId: user.userId}, c.env.JWT_SECRET);
      return c.json({
        jwt: token,
        userId: user.userId
      });
    } catch (error) {
      c.status(411);
      return c.text("Invalid");
    }  
});

authRouter.post('/checkAuth', authMiddleware ,async (c) => {
  const body = await c.req.json();
  const token = body.pencraft_token
  const loggedInUser = body.pencraft_user;
  if (!token) {
    c.status(401);
    return c.json({ message: 'Unauthorized' });
  }

  try {
    const { userId } = await verify(token, c.env.JWT_SECRET);
    if (userId === loggedInUser) {
      c.status(200);
      return c.json({ message: 'Authorized' });
    }
    c.status(401);
    return c.json({ message: 'Unauthorized' });
  } catch (error) {
    c.status(401);
    return c.json({ message: 'Error', error })
  }
})