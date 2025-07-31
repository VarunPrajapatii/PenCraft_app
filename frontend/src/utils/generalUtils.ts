import axios from "axios";
import { BACKEND_URL } from "../config";
import { OutputData } from "@editorjs/editorjs";

export const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", options).format(date);
};


/**
 * Utility function to handle follow/unfollow operations
 * @param targetUserId - The ID of the user to follow/unfollow
 * @param isCurrentlyFollowing - Current follow status
 * @param onSuccess - Callback function called on successful operation with new follow status
 * @param onError - Optional callback function called on error
 * @returns Promise<boolean> - Returns the new follow status on success
 */

// What an amazing way to write utility functions!
export const handleFollowUnfollow = async (
    targetUserId: string,
    isCurrentlyFollowing: boolean,
    onSuccess?: (newFollowStatus: boolean) => void,
    onError?: (error: unknown) => void
): Promise<boolean | null> => {
    try {
        const endpoint = isCurrentlyFollowing ? 'unfollow' : 'follow';
        const response = await axios.post(
            `${BACKEND_URL}/api/v1/user/${endpoint}/${targetUserId}`,
            {},
            {
                withCredentials: true,
            }
        );

        if (response.status === 200) {
            const newFollowStatus = !isCurrentlyFollowing;
            onSuccess?.(newFollowStatus);
            return newFollowStatus;
        }
        
        return null;
    } catch (error) {
        console.error(`Failed to ${isCurrentlyFollowing ? 'unfollow' : 'follow'} user`, error);
        onError?.(error);
        return null;
    }
};

/**
 * Custom hook-like utility for follow/unfollow functionality
 * Returns a function that handles the follow/unfollow operation
 * @param targetUserId - The ID of the user to follow/unfollow
 * @param updateFollowStatus - Function to update the follow status in the component's state
 * @returns Function to handle follow/unfollow click
 */
export const createFollowHandler = (
    targetUserId: string,
    updateFollowStatus: (newStatus: boolean) => void
) => {
    return async (isCurrentlyFollowing: boolean) => {
        await handleFollowUnfollow(
            targetUserId,
            isCurrentlyFollowing,
            updateFollowStatus
        );
    };
};

/**
 * Calculates estimated reading time for blog content
 * @param content - The blog content object (Editor.js OutputData format)
 * @param wordsPerMinute - Average reading speed (default: 200 words per minute)
 * @returns String representation of reading time (e.g., "1 minute read", "5 minutes read")
 */
export const calculateReadingTime = (content: OutputData, wordsPerMinute: number = 200): string => {
    if (!content || !content.blocks || !Array.isArray(content.blocks)) {
        return "1 minute read";
    }

    let totalText = "";

    // Extract text from different block types
    content.blocks.forEach((block) => {
        try {
            switch (block.type) {
                case "paragraph":
                case "header":
                    if (block.data && block.data.text) {
                        // Remove HTML tags and get plain text
                        const plainText = String(block.data.text).replace(/<[^>]*>/g, '');
                        totalText += plainText + " ";
                    }
                    break;
                case "list":
                    if (block.data && block.data.items && Array.isArray(block.data.items)) {
                        block.data.items.forEach((item: unknown) => {
                            // Handle different item types (string, object, etc.)
                            let itemText = "";
                            if (typeof item === 'string') {
                                itemText = item;
                            } else if (typeof item === 'object' && item !== null) {
                                // If item is an object, try to extract text from common properties
                                const itemObj = item as Record<string, unknown>;
                                itemText = String(itemObj.text || itemObj.content || JSON.stringify(item));
                            } else {
                                itemText = String(item);
                            }
                            const plainText = itemText.replace(/<[^>]*>/g, '');
                            totalText += plainText + " ";
                        });
                    }
                    break;
                case "quote":
                    if (block.data && block.data.text) {
                        const plainText = String(block.data.text).replace(/<[^>]*>/g, '');
                        totalText += plainText + " ";
                    }
                    break;
                case "code":
                    if (block.data && block.data.code) {
                        // Code blocks count as text too
                        totalText += String(block.data.code) + " ";
                    }
                    break;
                case "table":
                    if (block.data && block.data.content && Array.isArray(block.data.content)) {
                        block.data.content.forEach((row: unknown) => {
                            if (Array.isArray(row)) {
                                row.forEach((cell: unknown) => {
                                    const plainText = String(cell).replace(/<[^>]*>/g, '');
                                    totalText += plainText + " ";
                                });
                            }
                        });
                    }
                    break;
                default:
                    // For other block types, try to extract any text content
                    if (block.data && typeof block.data === 'object') {
                        const blockText = JSON.stringify(block.data).replace(/<[^>]*>/g, '');
                        totalText += blockText + " ";
                    }
                    break;
            }
        } catch (error) {
            // If there's an error processing a block, skip it and continue
            console.warn('Error processing block for reading time calculation:', error);
        }
    });

    // Count words (split by whitespace and filter out empty strings)
    const wordCount = totalText.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    // Calculate reading time in minutes
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
    
    // Return formatted string
    return readingTimeMinutes === 1 ? "1 minute read" : `${readingTimeMinutes} minutes read`;
};