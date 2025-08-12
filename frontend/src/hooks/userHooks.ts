import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { BACKEND_URL } from "../config";
import { UserProfileDetails, UserSmallCard } from "./hooksTypes";

export const useLoggedInUserDetails = () => {
    const [userProfileDetails, setUserProfileDetails] = useState<UserProfileDetails>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
              const response = await axios.get(`${BACKEND_URL}/api/v1/user/profile`, {
                withCredentials: true,
              });
              setUserProfileDetails(response.data.user);
            } catch (error) {
              console.error("Failed to fetch user details:", error);
            } finally {
              setLoading(false);
            }
          };
      
          fetchUserProfile();
    }, []);

    return {
        userProfileDetails,
        loading,
    };
}


export const useUserProfileInfo = ({ username }: { username: string }) => {
    const [loading, setLoading] = useState(true);
    const [userProfileDetails, setUserProfileDetails] = useState<UserProfileDetails>();

    const fetchUserProfile = useCallback(async () => {
        if (!username) return;
        
        setLoading(true);
        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/user/profile/${username.split("@")[1]}`, {
                withCredentials: true,
            });
            setUserProfileDetails(response.data.user);
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
        } finally {
            setLoading(false);
        }
    }, [username]);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    const refetch = () => {
        fetchUserProfile();
    };

    return {
        loading,
        userProfileDetails,
        refetch,
    };
}


export const useIsFollowing = ({ authorId }: { authorId: string }) => {
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);

    useEffect(() => {
        const checkFollowStatus = async () => {
            if (!authorId) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${BACKEND_URL}/api/v1/user/checkIsFollowing/${authorId}`, {
                    withCredentials: true,
                });
                setIsFollowing(response.data.isFollowing);
            } catch (error) {
                console.error("Failed to check follow status:", error);
                setIsFollowing(false);
            } finally {
                setLoading(false);
            }
        };

        checkFollowStatus();
    }, [authorId]);

    const updateFollowStatus = (newStatus: boolean) => {
        setIsFollowing(newStatus);
    };

    const refetch = () => {
        setLoading(true);
        // Re-trigger the effect by updating the state
        setIsFollowing(false);
    };

    return {
        loading,
        isFollowing,
        updateFollowStatus,
        refetch,
    };
};


export const useUserFollowers = ({ username }: { username: string }) => {
    const [loading, setLoading] = useState(true);
    const [followers, setFollowers] = useState<UserSmallCard[]>([]);

    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/api/v1/user/followersList/${username}`, {
                withCredentials: true,
            })
            .then((response) => {
                setFollowers(response.data.followers);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch followers:", error);
                setLoading(false);
            });
    }, [username]);

    return {
        loading,
        followers,
    };
}


export const useUserFollowings = ({ username }: { username: string }) => {
    const [loading, setLoading] = useState(true);
    const [followings, setFollowings] = useState<UserSmallCard[]>([]);

    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/api/v1/user/followingsList/${username}`, {
                withCredentials: true,
            })
            .then((response) => {
                setFollowings(response.data.followings);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch followings:", error);
                setLoading(false);
            });
    }, [username]);

    return {
        loading,
        followings,
    };
}


export const useChangeUsername = () => {
    const [usernameChangeLoading, setUsernameChangeLoading] = useState(false);

    const changeUsername = async (newUsername: string) => {
        setUsernameChangeLoading(true);
        
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/changeUsername`, { newUsername }, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error("Error changing username:", error);
            throw error;
        } finally {
            setUsernameChangeLoading(false);
        }
    };

    return {
        usernameChangeLoading,
        changeUsername,
    };
}


export const useChangePassword = () => {
    const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);

    const changePassword = async (currentPassword: string, newPassword: string) => {
        setPasswordChangeLoading(true);
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/changePassword`, { currentPassword, newPassword }, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error("Error changing password:", error);
            throw error;
        } finally {
            setPasswordChangeLoading(false);
        }
    };

    return {
        passwordChangeLoading,
        changePassword,
    };
}


export const useChangeBio = () => {
    const [bioChangeLoading, setBioChangeLoading] = useState(false);

    const changeBio = async (loggedInUser: string, bio: string) => {
        setBioChangeLoading(true);
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/changeBio`, { loggedInUser, bio }, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error("Error changing Bio:", error);
            throw error;
        } finally {
            setBioChangeLoading(false);
        }
    };

    return {
        bioChangeLoading,
        changeBio,
    };
}