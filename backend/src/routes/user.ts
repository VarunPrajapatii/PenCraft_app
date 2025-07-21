import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { authMiddleware } from "./middleware";
import { generatePOSTPresignedUrl, getPublicS3Url, deleteS3Object } from "../lib/s3";
import bcrypt from "bcryptjs";

function createPrismaClient(databaseUrl: string) {
  const prisma = new PrismaClient({
    datasourceUrl: databaseUrl,
  });
  
  return prisma.$extends(withAccelerate()) as any;
}


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


userRouter.get("/profile/:username", async (c) => {
    try {
        const prisma = createPrismaClient(c.env.DATABASE_URL);

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

    const prisma = createPrismaClient(c.env.DATABASE_URL);


    // 1️⃣ Check if user already has a profile image and delete it from S3
    const existingUser = await prisma.user.findUnique({
      where: { userId },
      select: { profileImageKey: true },
    });

    if (existingUser?.profileImageKey) {
      await deleteS3Object(c, existingUser.profileImageKey);
    }

    // 2️⃣ Compute a unique S3 key for the new image
    const ext = filename.split(".").pop() ?? "";
    const key = `profiles/${userId}_${new Date().toISOString().slice(0, 10)}.${ext}`;

    // 3️⃣ Generate a presigned PUT URL
    const uploadUrl = await generatePOSTPresignedUrl(c, key, contentType);

    // 3️⃣ Save the key in the user’s record
    await prisma.user.update({
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


userRouter.post("/changeUsername", async (c) => {
    const { newUsername } = await c.req.json();
    const userId = c.get("userId");

    try {
        const prisma = createPrismaClient(c.env.DATABASE_URL);

        // If userId valid
        const existingUser = await prisma.user.findUnique({
            where: { userId },
            select: { usernameDatestamp: true }
        })

        if(!existingUser) {
            return c.json({ canChangeUsername: false, success: false, message: "UserNotFound" }, 404);
        }

        // if user trying to change username within 60 days of last change
        const diffTime = Math.abs(new Date().getTime() - existingUser.usernameDatestamp.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 60) {
            return c.json({ canChangeUsername: false, success: false, message: "You can only change your username once every 60 days." }, 200);
        }

        // Check if the new username already exists
        const existingUsername = await prisma.user.findUnique({
            where: { username: newUsername }
        });

        if(existingUsername) {
            return c.json({ canChangeUsername: true, success: false, message: "Username already exists" }, 200);
        }

        // update the username and datestamp into database
        const done = await prisma.user.update({
            where: { userId },
            data: {
                username: newUsername,
                usernameDatestamp: new Date(),
            },
        });

        if (done) {
            return c.json({ canChangeUsername: true, success: true, message: "Username changed!" }, 200);
        } else {
            return c.json({ canChangeUsername: false, success: false, message: "Failed to change username" }, 500);
        }

    } catch (error) {
        c.status(500);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? "Something went wrong while processing your request" + String(error.message) 
        : "Something went wrong while processing your request";
      return c.text(errorMessage);
    }
});


userRouter.post("/changePassword", async (c) => {
    const { currentPassword, newPassword } = await c.req.json();
    const userId = c.get("userId");

    try {
        const prisma = createPrismaClient(c.env.DATABASE_URL);

        // check if username exists and password matches
        const existingUser = await prisma.user.findUnique({
            where: { userId },
            select: { password: true }
        })

        if(!existingUser) {
            return c.json({ isPasswordCorrect: false, success: false, message: "UserId not found"}, 404);
        }

        // check if current password is correct
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, existingUser.password);

        if (!isCurrentPasswordValid) {
            return c.json({ isPasswordCorrect: false, success: false, message: "Current password is incorrect" }, 200);
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        
        const done = await prisma.user.update({
            where: { userId },
            data: {
                password: newHashedPassword,
            },
        });

        if (done) {
            return c.json({ isPasswordCorrect: true, success: true, message: "Password changed successfully" }, 200);
        } else {
            return c.json({ isPasswordCorrect: true, success: false, message: "Failed to change password" }, 500);
        }

    } catch (error) {
        c.status(500);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? "Something went wrong while processing your request" + String(error.message) 
        : "Something went wrong while processing your request";
      return c.text(errorMessage);
    }
});


userRouter.post("/follow/:targetUserId", async (c) => {
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


userRouter.post("/unfollow/:targetUserId", async (c) => {
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


userRouter.get("/checkIsFollowing/:targetUserId", async (c) => {
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


userRouter.get("/:username/userPublishedBlogs", async (c) => {
    try {
        const prisma = createPrismaClient(c.env.DATABASE_URL);

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
        const prisma = createPrismaClient(c.env.DATABASE_URL);

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


userRouter.get("/followingsList/:username", async (c) => {
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
