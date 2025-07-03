import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { OutputData } from "@editorjs/editorjs";


export interface Blog {
    blogId: string;
    title: string;
    content: OutputData;
    subtitle: string;
    publishedDate: string | null;
    claps: number;
    bannerImageKey: string | null;
    bannerImageUrl: string | null;
    author: {
        name: string;
        profileImageKey: string | null;
        profileImageUrl: string | null;
        userId: string;
        username: string;
    };
}

export interface UserBlogs {
    blogId: string;
    authorname: string | null;
    authorName: string | null;
    authorUsername: string | null;
    profileImageUrl: string | null;
    title: string;
    subtitle: string;
    content: OutputData;
    publishedDate: string | null;
    claps: number;
    bannerImageKey: string | null;
    bannerImageUrl: string | null;
}

export interface UserProfileDetails {
    userId: string;
    profileImageUrl: string | null;
    name: string;
    bio: string;
    totalClaps: number;
    followersCount: number;
    followingCount: number;
    createdAt: string;
    profileImageKey: string | null;
    blogs: UserBlogs[];
}

export interface UserSmallCard {
    userId: string;
    name: string;
    username: string;
    profileImageKey?: string | null;
    profileImageUrl?: string | null;
    createdAt: string;
}



export const useFullBlog = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);

    const [fullBlogDetails, setFullBlogDetails] = useState<Blog>(); // Note: It was [] as default value before
    
    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
                headers: {
                    Authorization: localStorage.getItem("pencraft_token"),
                },
            })
            .then((response) => {
                setFullBlogDetails(response.data.blog);
                setLoading(false);
            });
    }, [id]);

    return {
        loading,
        fullBlogDetails,
    };
};


export const useBlogs = (limit: number = 8) => {
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${BACKEND_URL}/api/v1/blog/bulk?page=1&limit=${limit}`, {
                headers: {
                    Authorization: localStorage.getItem("pencraft_token"),
                },
            })
            .then((response) => {
                setBlogs(response.data.blogs);
                setCurrentPage(1);
                setHasMore(response.data.pagination.page < response.data.pagination.pages);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch blogs:", error);
                setLoading(false);
            });
    }, [limit]);

    const loadMore = () => {
        if (loadingMore || !hasMore) return;
        
        setLoadingMore(true);
        const nextPage = currentPage + 1;
        
        axios
            .get(`${BACKEND_URL}/api/v1/blog/bulk?page=${nextPage}&limit=${limit}`, {
                headers: {
                    Authorization: localStorage.getItem("pencraft_token"),
                },
            })
            .then((response) => {
                setBlogs(prevBlogs => [...prevBlogs, ...response.data.blogs]);
                setCurrentPage(nextPage);
                setHasMore(response.data.pagination.page < response.data.pagination.pages);
                setLoadingMore(false);
            })
            .catch((error) => {
                console.error("Failed to fetch more blogs:", error);
                setLoadingMore(false);
            });
    };

    return {
        loading,
        loadingMore,
        blogs,
        hasMore,
        loadMore,
    };
};


export const useAuthorBasicInfo = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [authorBasicInfo, setAuthorBasicInfo] = useState();
    const [isFollowing, setIsFollowing] = useState();

    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/api/v1/user/authorBasicInfo/${id}`, {
                headers: {
                    Authorization: localStorage.getItem("pencraft_token"),
                },
            })
            .then((response) => {
                setAuthorBasicInfo(response.data.author);
                setIsFollowing(response.data.isFollowing);
                setLoading(false);
            });
    }, [id]);

    return {
        authorBasicInfo,
        isFollowing,
        loading,
    };
};


export const useLoggedInUserDetails = () => {
    const [userProfileDetails, setUserProfileDetails] = useState<UserProfileDetails>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
              const response = await axios.get(`${BACKEND_URL}/api/v1/user/profile`, {
                headers: {
                  Authorization: localStorage.getItem("pencraft_token"),
                },
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

    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/api/v1/user/profile/${username.split("@")[1]}`, {
                headers: {
                    Authorization: localStorage.getItem("pencraft_token"),
                },
            })
            .then((response) => {
                setUserProfileDetails(response.data.user);
                setLoading(false);
            })
    }, [username])

    return {
        loading,
        userProfileDetails,
    };
}


export const useUserBlogs = ({username}: {username: string}) => {
    const [loading, setLoading] = useState(true);
    const [userPublishedBlogs, setUserPublishedBlogs] = useState<UserBlogs[]>([]);

    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/api/v1/user/${username.split("@")[1]}/userPublishedBlogs`, {
                headers: {
                    Authorization: localStorage.getItem("pencraft_token"),
                },
            })
            .then((response) => {
                setUserPublishedBlogs(response.data.blogs);
                setLoading(false);
            });
    }, [username]);

    return {
        loading,
        userPublishedBlogs,
    };
}


export const useUserDrafts = ({username}: {username: string}) => {
    const [loading, setLoading] = useState(true);
    const [userDrafts, setUserDrafts] = useState<UserBlogs[]>([]);

    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/api/v1/user/${username.split("@")[1]}/userDrafts`, {
                headers: {
                    Authorization: localStorage.getItem("pencraft_token"),
                },
            })
            .then((response) => {
                setUserDrafts(response.data.blogs);
                setLoading(false);
            });
    }, [username]);

    return {
        loading,
        userDrafts,
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
                    headers: {
                        Authorization: localStorage.getItem("pencraft_token"),
                    },
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
                headers: {
                    Authorization: localStorage.getItem("pencraft_token"),
                },
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
                headers: {
                    Authorization: localStorage.getItem("pencraft_token"),
                },
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
                headers: {
                    Authorization: localStorage.getItem("pencraft_token"),
                },
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
                headers: {
                    Authorization: localStorage.getItem("pencraft_token"),
                },
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


export const useDeleteBlog = () => {
    const [deleteLoading, setDeleteLoading] = useState(false);

    const deleteBlog = async (blogId: string) => {
        setDeleteLoading(true);
        try {
            const response = await axios.delete(`${BACKEND_URL}/api/v1/blog`, {
                data: { blogId }, // Send blogId in request body
                headers: {
                    Authorization: localStorage.getItem("pencraft_token"),
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting blog:", error);
            throw error;
        } finally {
            setDeleteLoading(false);
        }
    };

    return {
        deleteLoading,
        deleteBlog,
    };
}