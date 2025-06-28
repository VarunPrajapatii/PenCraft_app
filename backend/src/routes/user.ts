import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { authMiddleware } from "./middleware";
import { generatePOSTPresignedUrl, getPublicS3Url } from "../lib/s3";

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
    Variables: {
        userId: string;
    };
}>();

// Middleware to ensure that the user is logged in
userRouter.use("/*", authMiddleware);

// make a url to upload user profile image

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
        c.status(500);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? "Something went wrong while processing your request" + String(error.message) 
        : "Something went wrong while processing your request";
        
      return c.text(errorMessage);
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
        c.status(500);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? "Something went wrong while processing your request" + String(error.message) 
        : "Something went wrong while processing your request";
        
      return c.text(errorMessage);
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
                profileImageKey: true,
                followers: {
                    where: { followerId: loggedInUserId },
                    select: { relationId: true }, // Only fetch relationship ID
                },
            },
        });

        if (!author) {
            return c.json({ error: "Author not found" }, 404);
        }

        let profileImageUrl = null;
        if( author.profileImageKey) {
            profileImageUrl = getPublicS3Url(c, author.profileImageKey);
        }

        // Check if the logged-in user follows the author
        const isFollowing = author.followers.length > 0;
        return c.json({
            author: {
                userId: author.userId,
                email: author.email,
                name: author.name,
                profileImageUrl
            },
            isFollowing,
        });
        
    } catch (error) {
        c.status(500);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? "Something went wrong while processing your request" + String(error.message) 
        : "Something went wrong while processing your request";
        
      return c.text(errorMessage);
    }
});


userRouter.get("/profile/:userId", async (c) => {
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
                profileImageKey: true,
                totalClaps: true,
                followersCount: true,
                followingCount: true,
                createdAt: true,
                
            },
        });

        if (!user) {
            return c.json({ error: "User not found" }, 404);
        }

        let profileImageUrl = null
        if (user.profileImageKey) {
            profileImageUrl = getPublicS3Url(c, user.profileImageKey)
        }

        return c.json({
            user: {
                email: user.email,
                name: user.name,
                bio: user.bio,
                totalClaps: user.totalClaps,
                followersCount: user.followersCount,
                followingCount: user.followingCount,
                createdAt: user.createdAt,
                profileImageUrl,
            }
        })
    } catch (error) {
        c.status(500);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? "Something went wrong while processing your request" + String(error.message) 
        : "Something went wrong while processing your request";
        
      return c.text(errorMessage);
    }
});

// POST /profile/:userId/image
userRouter.post("/profile/:userId/image", async (c) => {
  try {
    const { filename, contentType } = await c.req.json() as {
      filename: string;
      contentType: string;
    };
    const userId = c.req.param("userId");

    // 1️⃣ Compute a unique S3 key
    const ext = filename.split(".").pop() ?? "";
    const key = `profiles/${userId}_${new Date().toISOString().slice(0, 10)}.${ext}`;

    // 2️⃣ Generate a presigned PUT URL
    const uploadUrl = await generatePOSTPresignedUrl(c, key, contentType);

    // 3️⃣ Save the key in the user’s record
    await new PrismaClient({ datasourceUrl: c.env.DATABASE_URL })
      .$extends(withAccelerate())
      .user.update({
        where: { userId },
        data: { profileImageKey: key },
      });

    // 4️⃣ Return the presigned URL and the key
    return c.json({ uploadUrl, key });
  } catch (error) {
    console.error(error);
    c.status(500);
    return c.text("Failed to generate upload URL");
  }
});



userRouter.get("/:userId/userBlogs", async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const userId = c.req.param("userId");

        const blogs = await prisma.blog.findMany({
            where: { authorId: userId },
            orderBy: { publishedDate: "desc" },
            select: {
                blogId: true,
                title: true,
                subtitle: true,
                content: true,
                publishedDate: true,
                claps: true,
            },
        });
        return c.json({ blogs });
    } catch (error) {
        c.status(500);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? "Something went wrong while processing your request" + String(error.message) 
        : "Something went wrong while processing your request";
        
      return c.text(errorMessage);
    }
})