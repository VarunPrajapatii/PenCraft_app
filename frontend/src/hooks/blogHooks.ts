import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { Blog, UserBlogs } from "./hooksTypes";

export const useFullBlog = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);

    const [fullBlogDetails, setFullBlogDetails] = useState<Blog>(); // Note: It was [] as default value before
    
    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
                withCredentials: true,
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
                withCredentials: true,
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
                withCredentials: true,
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


export const useDeleteBlog = () => {
    const [deleteLoading, setDeleteLoading] = useState(false);

    const deleteBlog = async (blogId: string) => {
        setDeleteLoading(true);
        try {
            const response = await axios.delete(`${BACKEND_URL}/api/v1/blog`, {
                data: { blogId }, // Send blogId in request body
                withCredentials: true,
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


export const useAuthorBasicInfo = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [authorBasicInfo, setAuthorBasicInfo] = useState();
    const [isFollowing, setIsFollowing] = useState();

    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/api/v1/user/authorBasicInfo/${id}`, {
                withCredentials: true,
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


export const useUserBlogs = ({username}: {username: string}) => {
    const [loading, setLoading] = useState(true);
    const [userPublishedBlogs, setUserPublishedBlogs] = useState<UserBlogs[]>([]);

    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/api/v1/user/${username.split("@")[1]}/userPublishedBlogs`, {
                withCredentials: true,
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
                withCredentials: true,
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