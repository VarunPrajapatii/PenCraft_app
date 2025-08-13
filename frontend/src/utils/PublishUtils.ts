import axios from "axios";
import { BACKEND_URL } from "../config";
import { OutputData } from "@editorjs/editorjs";

export const uploadBannerIfExists = async ({
    bannerFile,
    blogId,
}: {
    bannerFile: File | null;
    blogId: string;
}): Promise<string> => {
    if (!bannerFile) return "";

    try {
        // 1. Get presigned URL for banner upload
        const response = await axios.post(
            `${BACKEND_URL}/api/v1/blog/blogBanner/upload/${blogId}`,
            {
                filename: bannerFile.name,
                contentType: bannerFile.type,
            },
            {
                withCredentials: true,
            }
        );

        const { uploadUrl, key } = response.data;

        await axios.put(uploadUrl, bannerFile, {
            headers: {
                "Content-Type": bannerFile.type,
            },
        });

        return key;
    } catch (error) {
        console.error("Failed to upload banner:", error);
        throw new Error("Banner upload failed");
    }
};

// Define the type for uploadUrls items
type UploadUrlData = { fileId: string; uploadUrl: string; key: string };

// Extract and upload blog images
export const uploadBlogImages = async ({
    content,
    blogId,
}: {
    content: OutputData | null;
    blogId: string;
}): Promise<OutputData | null> => {
    if (!content) return null;

    const pendingImages = window.pendingBlogImages || new Map();
    // TODO: Remove logs
    const imagesToUpload: Array<{
        filename: string;
        contentType: string;
        fileId: string;
    }> = [];

    // made array of images to upload from content
    content.blocks.forEach((block) => {
        if (block.type === "image" && block.data.file?.fileId) {
            const fileId = block.data.file.fileId;
            const pendingImage = pendingImages.get(fileId);

            if (pendingImage && !pendingImage.uploaded) {
                imagesToUpload.push({
                    filename: pendingImage.file.name,
                    contentType: pendingImage.file.type,
                    fileId,
                });
            }
        }
    });

    if (imagesToUpload.length === 0) {
        return content;
    }

    try {
        // Get batch upload URLs
        const response = await axios.post(
            `${BACKEND_URL}/api/v1/blog/images/batch-upload/${blogId}`,
            {
                images: imagesToUpload,
            },
            {
                withCredentials: true,
            }
        );

        const { uploadUrls } = response.data as { uploadUrls: UploadUrlData[] };

        // Upload all images to S3
        await Promise.all(
            uploadUrls.map(async (uploadData: UploadUrlData) => {
                const pendingImage = pendingImages.get(uploadData.fileId);
                if (pendingImage) {
                    await axios.put(uploadData.uploadUrl, pendingImage.file, {
                        headers: {
                            "Content-Type": pendingImage.file.type,
                        },
                    });
                    pendingImage.uploaded = true;
                }
            })
        );

        // Update content with actual S3 keys
        const updatedContent = { ...content };
        updatedContent.blocks = content.blocks.map((block) => {
            if (block.type === "image" && block.data.file?.fileId) {
                const uploadData = (uploadUrls as UploadUrlData[]).find(
                    (u) => u.fileId === block.data.file.fileId
                );
                if (uploadData) {
                    return {
                        ...block,
                        data: {
                            ...block.data,
                            file: {
                                ...block.data.file,
                                url: uploadData.key,
                            },
                        },
                    };
                }
            }
            return block;
        });
        // TODO: Remove logs
        return updatedContent;
    } catch (error) {
        console.error("Failed to upload blog images:", error);
        throw new Error("Blog images upload failed");
    }
};

export const convertS3ImagesToBlobs = async (content: OutputData): Promise<OutputData> => {
  if (!content || !content.blocks) return content;

  const imagesToDelete: string[] = []; // Track S3 keys to delete

  const updatedBlocks = await Promise.all(
    content.blocks.map(async (block) => {
      if (block.type === 'image' && block.data.file?.url) {
        const s3Key = block.data.file.url;
        
        // Check if it's an S3 key (not already a blob URL)
        if (!s3Key.startsWith('blob:') && !s3Key.startsWith('http://') && !s3Key.startsWith('https://')) {
          try {
            
            // Fetch the image using your backend endpoint
            const response = await axios.get(
              `${BACKEND_URL}/api/v1/blog/images/${encodeURIComponent(s3Key)}`,
              {
                withCredentials: true,
              }
            );
            
            // Get the presigned URL and fetch the actual image
            const presignedUrl = response.data.signedUrl;
            const imageResponse = await fetch(presignedUrl);
            const blob = await imageResponse.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            // Generate a new fileId for tracking
            const fileId = crypto.randomUUID();
            
            // Store in pendingBlogImages (same as new uploads)
            window.pendingBlogImages = window.pendingBlogImages || new Map();
            window.pendingBlogImages.set(fileId, {
              file: new File([blob], block.data.file.name || 'existing-image.jpg', { 
                type: blob.type || 'image/jpeg' 
              }),
              blobUrl,
              uploaded: false // Mark as already uploaded since it came from S3
            });

            // Track this S3 key for deletion
            imagesToDelete.push(s3Key);

            return {
              ...block,
              data: {
                ...block.data,
                file: {
                  ...block.data.file,
                  url: blobUrl,
                  fileId: fileId
                }
              }
            };
          } catch (error) {
            console.error('Failed to convert S3 image to blob:', s3Key, error);
            // Return original block if conversion fails
            return block;
          }
        }
      }
      return block;
    })
  );

  // Delete the original S3 images after successful conversion
  if (imagesToDelete.length > 0) {
    try {
      await deleteS3Images(imagesToDelete);
    } catch (error) {
      console.error('Failed to delete some S3 images:', error);
      // Continue anyway - the conversion worked
    }
  }

  return {
    ...content,
    blocks: updatedBlocks
  };
};

// Helper function to delete S3 images
const deleteS3Images = async (s3Keys: string[]): Promise<void> => {
  try {
    // You'll need to create this endpoint in your backend
    await axios.delete(`${BACKEND_URL}/api/v1/blog/images/batch-delete`, {
      data: { keys: s3Keys },
      withCredentials: true,
    });
  } catch (error) {
    console.error('Failed to delete S3 images:', error);
    throw error;
  }
};