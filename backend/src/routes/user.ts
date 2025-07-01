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

userRouter.get("/profile/:username", async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const username = c.req.param("username");

        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                userId: true,
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

        // move this logic to separate route with pagination
        const blogs = await prisma.blog.findMany({
            where: {authorId: user.userId, published: true },
            orderBy: {
                publishedDate: 'desc'
            },
            select: {
                blogId: true,
                title: true,
                subtitle: true,
                bannerImageKey: true,
                content: true,
                publishedDate: true,
                claps: true,
            }
        });
        
        const blogsWithUrls = blogs.map(blog => {
            let bannerImageUrl = null;
            if (blog.bannerImageKey) {
                bannerImageUrl = getPublicS3Url(c, blog.bannerImageKey);
            }
            
            
            
            return {
                ...blog,
                bannerImageUrl,
            };
        });

        return c.json({
            user: {
                ...user,
                profileImageUrl,
                blogs: blogsWithUrls
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


userRouter.post("/profileImage/upload", async (c) => {
  try {
    const { filename, contentType } = await c.req.json() as {
      filename: string;
      contentType: string;
    };
    const userId = c.get("userId");

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


userRouter.get("/checkIsFollowing/:targetUserId", async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

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


userRouter.get("/:username/userPublishedBlogs", async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const userId = c.req.param("username");

        const user = await prisma.user.findUnique({
            where: { username: userId },
            select: { userId: true }
        })

        if(!user) {
            return c.json({ error: "User not found" }, 404);
        }

        const blogs = await prisma.blog.findMany({
            where: { authorId: user.userId, published : true },
            orderBy: { publishedDate: "desc" },
            select: {
                blogId: true,
                title: true,
                subtitle: true,
                bannerImageKey: true,
                content: true,
                publishedDate: true,
                claps: true,
            },
        });

        const blogsWithUrls = blogs.map(blog => {
            let bannerImageUrl = null;
            if (blog.bannerImageKey) {
                bannerImageUrl = getPublicS3Url(c, blog.bannerImageKey);
            }
            
            return {
                ...blog,
                bannerImageUrl,
            };
        });
        return c.json({ blogs: blogsWithUrls });
    } catch (error) {
        c.status(500);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? "Something went wrong while processing your request" + String(error.message) 
        : "Something went wrong while processing your request";
        
      return c.text(errorMessage);
    }
});


userRouter.get("/:username/userDrafts", async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const userId = c.req.param("username");

        const user = await prisma.user.findUnique({
            where: { username: userId },
            select: { userId: true }
        })

        if(!user) {
            return c.json({ error: "User not found" }, 404);
        }

        const blogs = await prisma.blog.findMany({
            where: { authorId: user.userId, published : false },
            orderBy: { publishedDate: "desc" },
            select: {
                blogId: true,
                title: true,
                subtitle: true,
                bannerImageKey: true,
                content: true,
                claps: true,
            },
        });

        const blogsWithUrls = blogs.map(blog => {
            let bannerImageUrl = null;
            if (blog.bannerImageKey) {
                bannerImageUrl = getPublicS3Url(c, blog.bannerImageKey);
            }
            
            return {
                ...blog,
                bannerImageUrl,
            };
        });
        return c.json({ blogs: blogsWithUrls });
    } catch (error) {
        c.status(500);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? "Something went wrong while processing your request" + String(error.message) 
        : "Something went wrong while processing your request";
        
      return c.text(errorMessage);
    }
});


userRouter.get("/followersList/:username", async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

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


userRouter.get("/followingsList/:username", async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

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