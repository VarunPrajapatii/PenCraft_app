import { Hono } from "hono";
import { authMiddleware } from "./middleware";
import { userProfileRouter } from "./user/user-profile";
import { userSocialRouter } from "./user/user-social";
import { userContentRouter } from "./user/user-content";


export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
    Variables: {
        userId: string;
    };
}>();


userRouter.use("/*", authMiddleware);

userRouter.route("/", userProfileRouter);
userRouter.route("/", userSocialRouter);
userRouter.route("/", userContentRouter);