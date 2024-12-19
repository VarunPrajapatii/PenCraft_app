import axios from "axios";
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config";


export interface Blog {
    content: string,
    title: string,
    subtitle: string,
    id: string,
    author: {
        name: string
    },
    publishedDate: string,
    claps: number,
}



export const useBlog = ({id}: {id:string}) => {
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    const [blog, setBlog] = useState<Blog>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization: localStorage.getItem("pencraft_token")
            }
        })
        .then(response => {
            setBlog(response.data.post);
            setLoading(false);
        })
    }, [id]);

    return {
        loading,
        blog
    }
}



export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
            headers: {
                Authorization: localStorage.getItem("pencraft_token")
            }
        })
        .then(response => {
            setBlogs(response.data.posts);
            setLoading(false);
        })
    }, []);

    return {
        loading,
        blogs
    }
}