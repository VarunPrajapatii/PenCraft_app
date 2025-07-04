import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signinInput, signupInput } from '@varuntd/pencraft-common';
import { getPublicS3Url } from '../lib/s3';
import bcrypt from 'bcryptjs';

export const authRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }
}>();

const cookieOptions = `HttpOnly; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 2}`; // 2 days
// HttpOnly; Secure; SameSite=None; Path=/; Domain=.pencraft.varuntd.com


authRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
      const body = await c.req.json();

      if (!body || typeof body !== 'object' || !body.name || !body.username || !body.password) {
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

      // Check if username already exists
      const existingUser = await prisma.user.findUnique({
        where: { username: body.username }
      });

      if (existingUser) {
        c.status(409);
        return c.json({
          message: "Username already taken",
          field: "username"
        });
      }

      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(body.password, 10);
  
      const user = await prisma.user.create({
        data: {
          name: body.name,
          username: body.username,
          password: hashedPassword,
        },
      });
  
      const token = await sign({userId: user.userId }, c.env.JWT_SECRET);

      c.header('Set-Cookie', `token=${token}; ${cookieOptions}`);

      return c.json({
        message: 'Signed up',
        userId: user.userId,
        name: user.name,
        username: user.username,
      });
    } catch (error) {
        c.status(500);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? "Something went wrong while processing your request" + String(error.message) 
        : "Something went wrong while processing your request";
        
      return c.text(errorMessage);
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
      const user = await prisma.user.findUnique({
        where: {
          username: body.username
        }
      });
    
      if(!user) {
        c.status(403);
        return c.json({ message: "Incorrect Credentials" });
      }

      // Compare password hash
      const isPasswordValid = await bcrypt.compare(body.password, user.password);
      if (!isPasswordValid) {
        c.status(403);
        return c.json({ message: "Incorrect Credentials" });
      }
    
      const token = await sign({userId: user.userId}, c.env.JWT_SECRET);

      c.header('Set-Cookie', `token=${token}; ${cookieOptions}`);
      
      return c.json({
        message: 'Signed in',
        userId: user.userId,
        name: user.name,
        username: user.username,
        profileImageUrl: user.profileImageKey ? getPublicS3Url(c, user.profileImageKey) : null
      });
    } catch (error) {
        c.status(500);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? "Something went wrong while processing your request" + String(error.message) 
        : "Something went wrong while processing your request";
        
      return c.text(errorMessage);
    }
});

authRouter.post('/check-username', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
      const body = await c.req.json();
      
      if (!body || !body.username) {
        c.status(400);
        return c.json({ message: 'Username is required' });
      }

      const existingUser = await prisma.user.findUnique({
        where: { username: body.username }
      });

      return c.json({
        available: !existingUser,
        message: existingUser ? 'Username already taken' : 'Username is available'
      });
    } catch (error) {
      c.status(500);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? "Something went wrong while checking username: " + String(error.message) 
        : "Something went wrong while checking username";
        
      return c.text(errorMessage);
    }
});