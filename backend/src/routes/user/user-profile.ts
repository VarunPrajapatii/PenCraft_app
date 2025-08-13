import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { authMiddleware } from "../middleware";
import { generatePOSTPresignedUrl, getPublicS3Url, deleteS3Object } from "../../lib/s3";
import bcrypt from "bcryptjs";

function createPrismaClient(databaseUrl: string) {
  const prisma = new PrismaClient({
    datasourceUrl: databaseUrl,
  });
  
  return prisma.$extends(withAccelerate()) as any;
}

export const userProfileRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
    Variables: {
        userId: string;
    };
}>();

userProfileRouter.use("/*", authMiddleware);


userProfileRouter.get("/profile/:username", async (c) => {
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

        return c.json({
            user: {
                ...user,
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


userProfileRouter.post("/profileImage/upload", async (c) => {
  try {
    const { filename, contentType } = await c.req.json() as {
      filename: string;
      contentType: string;
    };
    const userId = c.get("userId");

    const prisma = createPrismaClient(c.env.DATABASE_URL);


    // 1 Check if user already has a profile image and delete it from S3
    const existingUser = await prisma.user.findUnique({
      where: { userId },
      select: { profileImageKey: true },
    });

    if (existingUser?.profileImageKey) {
      await deleteS3Object(c, existingUser.profileImageKey);
    }

    //  Compute a unique S3 key for the new image
    const ext = filename.split(".").pop() ?? "";
    const key = `profiles/${userId}_${new Date().toISOString().slice(0, 10)}.${ext}`;

    //  Generate a presigned PUT URL
    const uploadUrl = await generatePOSTPresignedUrl(c, key, contentType);

    //  Save the key in the user’s record
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


userProfileRouter.post("/changeUsername", async (c) => {
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


userProfileRouter.post("/changePassword", async (c) => {
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


userProfileRouter.post("/changeBio", async (c) => {
    const { loggedInUser, bio } = await c.req.json();
    const userId = c.get("userId");

    if(userId !== loggedInUser) {
        return c.json({ success: false, message: "Unauthorized" }, 401);
    }

    try {
        const prisma = createPrismaClient(c.env.DATABASE_URL);

        // check if username exists and password matches
        const done = await prisma.user.update({
            where: { userId },
            data: { 
                bio: bio 
            }
        })

        if (done) {
            return c.json({ success: true, message: "Bio changed successfully" }, 200);
        } else {
            return c.json({ success: false, message: "Failed to change bio" }, 500);
        }

    } catch (error) {
        c.status(500);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? "Something went wrong while processing your request" + String(error.message) 
        : "Something went wrong while processing your request";
      return c.text(errorMessage);
    }
});