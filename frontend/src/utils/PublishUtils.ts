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
                headers: {
                    Authorization: localStorage.getItem("pencraft_token"),
                },
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
                headers: {
                    Authorization: localStorage.getItem("pencraft_token"),
                },
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

        // Update content with actual S3 URLs
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
        console.log(updatedContent);
        return updatedContent;
    } catch (error) {
        console.error("Failed to upload blog images:", error);
        throw new Error("Blog images upload failed");
    }
};

