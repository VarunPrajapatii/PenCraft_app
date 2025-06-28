import { PutObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { Context } from "hono"

// Create S3 client from context
function getS3Client(c: Context) {
    return new S3Client({
        region: c.env.AWS_REGION,
        credentials: {
            accessKeyId: c.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: c.env.AWS_SECRET_ACCESS_KEY,
        }
    });
}


// For upload (PUT/POST)
export const generatePOSTPresignedUrl = async (
    c: Context,
    key: string,
    contentType: string = 'image/jpeg'
) => {
    const s3Client = getS3Client(c);

    const command = new PutObjectCommand({
        Bucket: c.env.S3_BUCKET,
        Key: key,
        ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    return url;
}

// ----------- PUBLIC GET URL (profile & banner only) -----------
export function getPublicS3Url(c: Context, key: string) {
    // For public folders (profile, banner), you can construct the URL directly
    return `https://${c.env.S3_BUCKET}.s3.${c.env.AWS_REGION}.amazonaws.com/${key}`;
}


// ----------- PRIVATE GET PRESIGNED URL (blog only) -----------
export const generateGETPresignedUrl = async (
    c: Context,
    key: string
) => {
    const s3Client = getS3Client(c);

    const command = new GetObjectCommand({
        Bucket: c.env.S3_BUCKET,
        Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    return url;
}