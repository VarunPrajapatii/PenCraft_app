import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { authMiddleware } from "./middleware";

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

userRouter.post("/follow/:targetUserId", async (c) => {


    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const targetUserId = c.req.param("targetUserId");
        const loggedInUserId = c.get("userId");

        // Self-following check
        if (loggedInUserId === targetUserId) {
            return c.json({ error: "You cannot follow yourself!" }, 400);
        }

        // Check if the follow relationship already exists
        const existingRelation = await prisma.userRelation.findUnique({
            where: {
                followerId_followingId: {
                    followerId: loggedInUserId,
                    followingId: targetUserId,
                },
            },
        });

        if (existingRelation) {
            return c.json(
                { error: "You are already following this user!" },
                400
            );
        }

        // Create new relationship and update counts in a single transaction
        await prisma.$transaction([
            prisma.userRelation.create({
                data: {
                    followerId: loggedInUserId,
                    followingId: targetUserId,
                },
            }),
            prisma.user.update({
                where: { userId: loggedInUserId },
                data: { followingCount: { increment: 1 } },
            }),
            prisma.user.update({
                where: { userId: targetUserId },
                data: { followersCount: { increment: 1 } },
            }),
        ]);

        return c.json({ message: "Successfully followed the user!" }, 200);
    } catch (error) {
        console.error("Error following user:", error);
        return c.json(
            { error: "Could not create the follow relationship!" },
            500
        );
    }
});

userRouter.post("/unfollow/:targetUserId", async (c) => {


    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
        const targetUserId = c.req.param("targetUserId");
        const loggedInUserId = c.get("userId");

        // self-unfollow check
        if (loggedInUserId == targetUserId) {
            return c.json({ error: "You cannot unfollow yourself!" }, 400);
        }

        // Check if the follow relationship exists
        const existingRelation = await prisma.userRelation.findUnique({
            where: {
                followerId_followingId: {
                    followerId: loggedInUserId,
                    followingId: targetUserId,
                },
            },
        });

        if (!existingRelation) {
            return c.json({ error: "You are not following this user!" }, 400);
        }

        // Delete relation and update the counts in a single transaction
        await prisma.$transaction([
            prisma.userRelation.delete({
                where: {
                    followerId_followingId: {
                        followerId: loggedInUserId,
                        followingId: targetUserId,
                    },
                },
            }),
            prisma.user.update({
                where: { userId: loggedInUserId },
                data: { followingCount: { decrement: 1 } },
            }),
            prisma.user.update({
                where: { userId: targetUserId },
                data: { followersCount: { decrement: 1 } },
            }),
        ]);

        return c.json({ message: "Successfully unfollowed the user!" }, 200);
    } catch (error) {
        console.error("Error unfollowing user:", error);
        return c.json(
            { error: "Could not remove the follow relationship!" },
            500
        );
    }
});

userRouter.get("/authorBasicInfo/:targetUserId", async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const loggedInUserId = c.get("userId"); // Ensure this is populated
        const authorId = c.req.param("targetUserId");

        // Fetch author details and follow status
        const author = await prisma.user.findFirst({
            where: { userId: authorId },
            select: {
                userId: true,
                email: true,
                name: true,
                bio: true,
                followers: {
                    where: { followerId: loggedInUserId },
                    select: { relationId: true }, // Only fetch relationship ID
                },
            },
        });

        if (!author) {
            return c.json({ error: "Author not found" }, 404);
        }

        // Check if the logged-in user follows the author
        const isFollowing = author.followers.length > 0;
        return c.json({
            author: {
                userId: author.userId,
                email: author.email,
                name: author.name,
                bio: author.bio,
            },
            isFollowing,
        });
        
    } catch (error) {
        console.error("Error fetching author info:", error);
        return c.json(
            { message: "Error while fetching the author's info." },
            500
        );
    }
});



userRouter.get("/profile", async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const userId = c.get("userId");

        const user = await prisma.user.findUnique({
            where: { userId },
            select: {
                email: true,
                name: true,
                bio: true,
                followersCount: true,
                followingCount: true,
                createdAt: true,
                
            },
        });

        return c.json({ user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return c.json(
            { message: "Error while fetching the user's profile." },
            500
        );
    }
});