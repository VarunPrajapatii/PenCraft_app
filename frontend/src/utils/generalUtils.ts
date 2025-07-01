import axios from "axios";
import { BACKEND_URL } from "../config";

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
                headers: {
                    Authorization: localStorage.getItem("pencraft_token")
                }
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