import { Avatar } from "../components/BlogCard"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandsClapping } from '@fortawesome/free-solid-svg-icons'
import { faComment } from '@fortawesome/free-solid-svg-icons'
import { Blog } from "../hooks"
import axios from "axios"
import { BACKEND_URL } from "../config"
import { useState } from "react"

const clapIcon = <FontAwesomeIcon icon={faHandsClapping} />
const commentIcon = <FontAwesomeIcon icon={faComment} />

export const FullBlog = ({blog}: {blog: Blog}) => {
    const [claps, setClaps] = useState(blog.claps);
    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" };
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-GB", options).format(date);
    };
    
    const incClap = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/blog/${blog.id}/clap`, {}, {
                headers: {
                    Authorization: localStorage.getItem("pencraft_token")
                }
            });

            if (response.status === 200) {
                setClaps(prevClaps => prevClaps + 1); // Update state to reflect the increment
            }
        } catch (error) {
            console.error("Failed to increment claps", error);
            
        }
    }


    return (
        <div>
            <div className="flex justify-center">
                <div className="grid grid-cols-12 px-10 w-full pt-200 max-w-screen-xl pt-12">
                    <div className="col-span-8">
                        <div className="text-5xl py-2 font-extrabold">
                            {blog.title}
                        </div>
                        <div className="text-3xl text-gray-600 pb-4 font-semibold">
                            {blog.subtitle}
                        </div>
                        <div className="flex justify-between mb-2">
                            <div className="text-slate-500 pt-2">
                                Posted on - <span className="font-semibold">{formatDate(blog.publishedDate)}</span>
                            </div>
                            <div className="text-slate-500 pt-2 pr-96">
                                2 min read
                            </div>
                        </div>
                        <div className="flex text-xl border py-1 border-x-0 gap-20 w-full items-center font-medium text-gray-500">
                            <div className="hover:text-black hover:cursor-pointer" onClick={incClap}>
                                {clapIcon} <span className="text-lg items-center">{claps}</span>
                            </div>
                            <div className="hover:text-black hover:cursor-pointer">
                                {commentIcon} <span className="text-lg items-center">Nested comments Coming Soon</span>
                            </div>
                        </div>
                        <div className="pt-8 text-2xl ">
                            {blog.content}
                        </div>
                    </div>
                    <div className="col-span-4 pl-12">
                    <div className="text-slate-600 text-lg pb-5">
                        Written By -
                    </div>
                    <div className="flex w-full items-center">
                        <div className="pr-4 flex flex-col justify-center">
                            <Avatar size="big" name={blog.author.name || "Anonymous"} />
                        </div>
                        <div>
                            <div className="flex ">
                                <div className="text-2xl font-bold">
                                    {blog.author.name || "Anonymous    "}
                                </div>
                                <span className="px-3">
                                    {"."}
                                </span>
                                <div className="text-lg pt-1 text-gray-500 hover:text-black hover:cursor-pointer">
                                    Unfollow
                                </div>

                            </div>
                            <div className="pt-2 text-slate-700">
                                Coming soon - Random catch phrase about the author's ability to grab the user's attention
                            </div>
                        </div>
                    </div>
                    </div>
                </div>

            </div>
        </div>
    )
}