import { Hono } from 'hono'
import { authMiddleware } from './middleware';
import { generateGETPresignedUrl, generatePOSTPresignedUrl } from '../lib/s3';


export const imageRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
        AWS_REGION: string;
        AWS_ACCESS_KEY_ID: string;
        AWS_SECRET_ACCESS_KEY: string;
        S3_BUCKET: string;
    },
    Variables: {
        userId: string
    }
}>();

/**
 * S3 Key Patterns:
 * /profile/{userId}.{ext}
 * /banner/{blogId}.{ext}
 * /blog/{blogId}/{imageId}.{ext}
 * 
 * Interview Note:
 * - Single endpoint for all image types (profile, banner, blog images)
 * - Batch endpoint for multiple images (for blogs with many images)
 * - Dynamic content type support
 * - Robust error handling
 * - Auth middleware for security
 */


/**
 * How to Get the Content Type
When a user selects a file using an <input type="file" />, you can access the file’s MIME type:

    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        console.log(file.type); // e.g., "image/jpeg", "image/png"
    });

How to Reject Unnecessary Content Types
You can check the file type before uploading or requesting a presigned URL:


    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
        alert('Only JPG, PNG, and WEBP images are allowed.');
        return;
    }
 */

// Batch endpoint: Get presigned URLs for multiple images
imageRouter.post('/batch', async (c) => {
    try {
        const { keys } = await c.req.json();
        if (!Array.isArray(keys) || keys.length === 0) {
            c.status(400);
            return c.text('Keys array required');
        }
        const urls: Record<string, string> = {};
        for (const key of keys) {
            urls[key] = await generateGETPresignedUrl(c, key);
        }
        /** this is what frontend will receive
         * {
                "urls": {
                    "blog/123/img1.jpg": "https://s3-presigned-url-1",
                    "blog/123/img2.png": "https://s3-presigned-url-2",
                    "banner/123.jpg": "https://s3-presigned-url-3"
                }
            }
         */
        return c.json({ urls });
    } catch (error) {
        c.status(500);
        const errorMessage = error && typeof error === 'object' && 'message' in error
            ? "Something went wrong while processing your request: " + String(error.message)
            : "Something went wrong while processing your request";
        return c.text(errorMessage);
    }
});

// Single endpoint that handles all image types
// eg: user123.jpg for profile image, GET /api/v1/image/profile/user123.jpg?contentType=image/jpeg
imageRouter.post('/:type/:identifier/:imageId?', async (c) => {
    const type = c.req.param('type');        // 'profile', 'banner'
    const identifier = c.req.param('identifier'); // userId or blogId
    const imageId = c.req.param('imageId');   // optional, only for blog images
    const contentType = c.req.query('contentType') || 'image/jpeg';

    // Construct S3 key based on type
    let s3Key: string;

    switch (type) {
        case 'profile':
            s3Key = `profile/${identifier}`; // profile/userId.ext
            break;
        case 'banner':
            s3Key = `banner/${identifier}`; // banner/blogId.ext
            break;
        case 'blog':
            if (!imageId) {
                c.status(400);
                return c.text('Image ID required for blog images');
            }
            s3Key = `blog/${identifier}/${imageId}`; // blog/blogId/imageId.ext
            break;
        default:
            c.status(400);
            return c.text('Invalid image type');
    }

    try {
        const presignedUrl = await generatePOSTPresignedUrl(c, s3Key, contentType);
        return c.json({ url: presignedUrl });
    } catch (error) {
        c.status(500);
        const errorMessage = error && typeof error === 'object' && 'message' in error
            ? "Something went wrong while processing your request: " + String(error.message)
            : "Something went wrong while processing your request";
        return c.text(errorMessage);
    }
});



/**
 * 
 * "How would you handle multiple images in a blog endpoint?"
 * "I would consider the trade-offs between different approaches:

Option 1: Include all presigned URLs in blog response

Pros: Single API call, simpler frontend
Cons: Slow response time, expensive in serverless, large payload, generates URLs for unseen images
Option 2: Lazy load each image separately

Pros: Fast initial load, only load what's needed
Cons: Many API calls (N+1 problem), higher serverless costs
Option 3: Batch image endpoint

Pros: Reduces API calls, on-demand loading, good balance
Implementation: Parse content to extract image keys, make one batch request for multiple URLs
Option 4: Hybrid approach

Include URLs for above-the-fold images (banner + first 2-3 content images) in main response
Lazy load or batch load remaining images
Best user experience with optimized performance
My recommendation would be the hybrid approach because:

It prioritizes perceived performance (images user sees first load immediately)
Balances API efficiency with user experience
Scales well as content grows
Follows progressive loading best practices"
Key Interview Points:
Show you understand trade-offs (performance vs complexity vs cost)
Mention N+1 problem (shows database knowledge)
Consider serverless implications (shows cloud architecture awareness)
Think about user experience (above-the-fold content priority)
Suggest practical solutions (batching, hybrid approaches)
This demonstrates systems thinking and practical engineering judgment that interviewers look for.
 */