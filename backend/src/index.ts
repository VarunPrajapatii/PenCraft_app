import { Hono } from 'hono'
import { authRouter } from './routes/auth';
import { blogRouter } from './routes/blog';
import { cors } from 'hono/cors'; 
import { userRouter } from './routes/user';
import { imageRouter } from './routes/image';


const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>();

console.log("Backend server is running...");

app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'https://pencraft-app.pages.dev', 'https://*.workers.dev', 'https://pencraft.varuntd.com'],
  credentials: true,
}));

app.route("/api/v1/auth", authRouter);
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);
// app.route("/api/v1/image", imageRouter);


export default app
