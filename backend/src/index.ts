import { Hono } from 'hono'
import { authRouter } from './routes/auth';
import { blogRouter } from './routes/blog';
import { cors } from 'hono/cors'; 
import { userRouter } from './routes/user';


const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>();

app.use("/*", cors());
app.route("/api/v1/auth", authRouter);
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);


export default app
