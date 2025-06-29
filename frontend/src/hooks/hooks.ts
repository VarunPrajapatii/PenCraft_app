import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { OutputData } from "@editorjs/editorjs";


export interface Blog {
    blogId: string;
    title: string;
    content: OutputData;
    subtitle: string;
    publishedDate: string;
    claps: number;
    bannerImageKey: string | null;
    bannerImageUrl: string | null;
    author: {
        name: string;
        profileImageKey: string | null;
        profileImageUrl: string | null;
        userId: string;
    };
}

export interface AuthorBasicInfo {
    isFollowing: boolean;
    author: { userId: string; email: string; name: string; bio: string };
}

export interface UserProfileDetails {
    email: string;
    name: string;
    bio: string;
    followersCount: number;
    followingCount: number;
    createdAt: string;
}

export interface UserBlogsType {
    blogId: string;
    title: string;
    subtitle: string;
    content: OutputData;
    publishedDate: string;
    claps: number;
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
    const [authorBasicInfo, setAuthorBasicInfo] = useState<AuthorBasicInfo>();
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


export const useUserBlogs = ({id}: {id: string}) => {
    const [loading, setLoading] = useState(true);
    const [userBlogs, setUserBlogs] = useState<UserBlogsType[]>([]);

    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/api/v1/user/${id}/userBlogs`, {
                headers: {
                    Authorization: localStorage.getItem("pencraft_token"),
                },
            })
            .then((response) => {
                setUserBlogs(response.data.blogs);
                console.log(response.data.blogs);
                setLoading(false);
            });
    }, [id]);

    return {
        loading,
        userBlogs,
    };
}