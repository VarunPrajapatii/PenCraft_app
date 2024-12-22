import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

export interface Blog {
    blogId: string;
    title: string;
    subtitle: string;
    content: string;
    publishedDate: string;
    claps: number;
    author: {
        name: string;
    };
}
export interface FullBlogDetails {
    blogId: string;
    title: string;
    subtitle: string;
    content: string;
    publishedDate: string;
    claps: number;
    author: {
        name: string;
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





export const useFullBlog = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);

    const [fullBlogDetails, setFullBlogDetails] = useState<FullBlogDetails>(); // Note: It was [] as default value before

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


export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/api/v1/blog/bulk`, {
                headers: {
                    Authorization: localStorage.getItem("pencraft_token"),
                },
            })
            .then((response) => {
                setBlogs(response.data.blogs);
                setLoading(false);
            });
    }, []);

    return {
        loading,
        blogs,
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