import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandsClapping } from '@fortawesome/free-solid-svg-icons'
import { faComment } from '@fortawesome/free-solid-svg-icons'

const clapIcon = <FontAwesomeIcon icon={faHandsClapping} />  // Replace this with any icon you prefer
const commentIcon = <FontAwesomeIcon icon={faComment} /> // Replace this with any icon you prefer


interface BlogCardProps {
    id: string;
    authorName: string;
    title: string;
    content: string;
    publishedDate: string;
}

export const BlogCard = ({
    id,
    authorName,
    title,
    content,
    publishedDate
}: BlogCardProps) => {
    return (
        <div className="border-b border-slate-200 p-4 w-2/3 min-w-md">
            <div className="flex">
                <Avatar name={authorName} size={"small"} />
                <div className="pl-2 text-sm flex justify-center flex-col">
                    {authorName}
                </div>
                <div className="flex justify-center flex-col pl-2">
                    <Circle />
                </div>
                <div className="pl-2 font-thin text-sm flex justify-center flex-col">
                    {publishedDate}
                </div>
            </div>
            <Link to={`/blog/${id}`}>
                <div className="cursor-pointer"> 
                    <div className="text-2xl font-bold pt-2">
                        {title.length >= 100 ? title.slice(0,99) + "..." : title}
                    </div>
                    <div className="text-lg font-thin">
                        {content.slice(0, 150) + "..."}
                    </div>
                </div>
            </Link>
            <div className="flex pt-4 text-slate-500 items-center justify-between font-thin  ">
                <div className="flex ">
                    <div className="text-sm font-normal">
                        06 May 2024
                    </div>
                    <div className="px-4 text-sm ">
                        {`${Math.ceil(content.length / 1000)} minute(s) read`}
                    </div>
                    <div className="flex justify-between items-center  w-48  pr-20">
                        <div className="flex items-center">
                            {clapIcon} <div className="pl-2">14</div>
                        </div>
                        <div className="flex items-center">
                            {commentIcon} <div className="pl-1">24</div>

                        </div>
                    </div>
                </div>
                <div className="text-lg font-bold hover:text-black hover:cursor-pointer">Follow Author</div>
            </div>

        </div>
    )
}


export function Circle() {
    return (
        <div className="h-1 w-1 rounded-full bg-slate-700"></div>
    )
}

export function Avatar({name, size = "small"}: {name:string, size: "small" | "big"}) {
    return (
        <div className={`relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-600 ${size === "small" ? "w-6 h-6" : "w-8 h-8"}`}>
            <span className={`font-medium ${size === "small" ? "text-xs" : "text-md" } text-gray-600 dark:text-gray-300`}>{name.split(" ")[0][0]}</span>
        </div>
    )
}
