import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { authMiddleware } from "../middleware";
import { getPublicS3Url } from "../../lib/s3";

function createPrismaClient(databaseUrl: string) {
  const prisma = new PrismaClient({
    datasourceUrl: databaseUrl,
  });
  
  return prisma.$extends(withAccelerate()) as any;
}

export const userSocialRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
    Variables: {
        userId: string;
    };
}>();

userSocialRouter.use("/*", authMiddleware);



userSocialRouter.post("/follow/:targetUserId", async (c) => {
    try {
        const prisma = createPrismaClient(c.env.DATABASE_URL);

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
        c.status(500);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? "Something went wrong while processing your request" + String(error.message) 
        : "Something went wrong while processing your request";
        
      return c.text(errorMessage);
    }
});


userSocialRouter.post("/unfollow/:targetUserId", async (c) => {
    try {
        const prisma = createPrismaClient(c.env.DATABASE_URL);
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
        c.status(500);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? "Something went wrong while processing your request" + String(error.message) 
        : "Something went wrong while processing your request";
        
      return c.text(errorMessage);
    }
});


userSocialRouter.get("/checkIsFollowing/:targetUserId", async (c) => {
    try {
        const prisma = createPrismaClient(c.env.DATABASE_URL);

        const loggedInUserId = c.get("userId");
        const targetUserId = c.req.param("targetUserId");

        const existingRelation = await prisma.userRelation.findUnique({
            where: {
                followerId_followingId: {
                    followerId: loggedInUserId,
                    followingId: targetUserId,
                },
            },
        });
    
        if(existingRelation) {
            return c.json({
                isFollowing: true,
            });
        }
        return c.json({
            isFollowing: false,
        });
        
    } catch (error) {
        c.status(500);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? "Something went wrong while processing your request" + String(error.message) 
        : "Something went wrong while processing your request";
        
      return c.text(errorMessage);
    }
});


userSocialRouter.get("/followersList/:username", async (c) => {
    try {
        const prisma = createPrismaClient(c.env.DATABASE_URL);

        const targetUsername = c.req.param("username");
        const user = await prisma.user.findUnique({
            where: { username: targetUsername },
            select: { userId: true },
        });

        if (!user) {
            return c.json({ error: "User not found" }, 404);
        }

        // Find all users who follow the target user
        const followers = await prisma.userRelation.findMany({
            where: { followingId: user.userId || "" },
            select: {
                follower: {
                    select: {
                        userId: true,
                        name: true,
                        username: true,
                        profileImageKey: true,
                        createdAt: true,
                    },
                },
            },
        });

        // Map to just the follower info
        const followerInformation = followers.map(f => f.follower);
        
        const followersWithUrls = followerInformation.map(f => {
            let profileImageUrl = null;
            if(f.profileImageKey) {
                profileImageUrl = getPublicS3Url(c, f.profileImageKey);
            }
            return {
                ...f,
                profileImageUrl,
            };
        });

        return c.json({ followers: followersWithUrls });
    } catch (error) {
        c.status(500);
        const errorMessage = error && typeof error === 'object' && 'message' in error 
            ? "Something went wrong while processing your request" + String(error.message) 
            : "Something went wrong while processing your request";
        return c.text(errorMessage);
    }
});


userSocialRouter.get("/followingsList/:username", async (c) => {
    try {
        const prisma = createPrismaClient(c.env.DATABASE_URL);

        const targetUsername = c.req.param("username");
        const user = await prisma.user.findUnique({
            where: { username: targetUsername },
            select: { userId: true },
        });

        if (!user) {
            return c.json({ error: "User not found" }, 404);
        }

        // Find all users whom the target user is following
        const followings = await prisma.userRelation.findMany({
            where: { followerId: user.userId },
            select: {
                following: {
                    select: {
                        userId: true,
                        name: true,
                        username: true,
                        profileImageKey: true,
                        createdAt: true,
                    },
                },
            },
        });

        // Map to just the following info
        const followingInformation = followings.map(f => f.following);

        const followingsWithUrls = followingInformation.map(f => {
            let followingProfileImageUrl = null;
            if(f.profileImageKey) {
                followingProfileImageUrl = getPublicS3Url(c, f.profileImageKey);
            }

            return {
                ...f,
                profileImageUrl: followingProfileImageUrl,
            };
        });

        return c.json({ followings: followingsWithUrls });
    } catch (error) {
        c.status(500);
        const errorMessage = error && typeof error === 'object' && 'message' in error 
            ? "Something went wrong while processing your request" + String(error.message) 
            : "Something went wrong while processing your request";
        return c.text(errorMessage);
    }
});
