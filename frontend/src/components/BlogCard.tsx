import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandsClapping } from '@fortawesome/free-solid-svg-icons'
import { faComment } from '@fortawesome/free-solid-svg-icons'

const clapIcon = <FontAwesomeIcon icon={faHandsClapping} />  // Replace this with any icon you prefer
const commentIcon = <FontAwesomeIcon icon={faComment} /> // Replace this with any icon you prefer


interface BlogCardProps {
    blogId: string;
    authorName: string;
    title: string;
    subtitle: string;
    content: string;
    publishedDate: string;
    claps: number;
}

export const BlogCard = ({
    blogId,
    authorName,
    title,
    subtitle,
    content,
    publishedDate,
    claps
}: BlogCardProps) => {
    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" };
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-GB", options).format(date);
    };

    return (
        <div className="border-b border-slate-200 p-4 w-2/3 min-w-full">
            <div className="flex">
                <Avatar name={authorName} size={"small"} />
                <div className="pl-2 text-sm flex justify-center flex-col">
                    {authorName}
                </div>
                <div className="flex justify-center flex-col pl-2">
                    <Circle />
                </div>
                {/* <div className="pl-2 font-thin text-sm flex justify-center flex-col">
                    {publishedDate}
                </div> */}
            </div>
            <Link to={`/blog/${blogId}`}>
                <div className="cursor-pointer"> 
                    <div className="text-3xl font-bold py-2">
                        {title.length >= 100 ? title.slice(0,99) + "..." : title}
                    </div>
                    <div className="text-lg text-gray-500">
                        {subtitle.slice(0, 150) + "..."}
                    </div>
                </div>
            </Link>
            <div className="flex pt-4 text-slate-500 items-center justify-between font-thin  ">
                <div className="flex ">
                    <div className="text-sm font-normal">
                        {formatDate(publishedDate)}
                    </div>
                    <div className="px-4 text-sm ">
                        {`${Math.ceil(content.length / 1000)} minute(s) read`}
                    </div>
                    <div className="flex justify-between items-center  w-48  pr-20">
                        <div className="flex items-center">
                            {clapIcon} <div className="pl-2">{claps}</div>
                        </div>
                        <div className="flex items-center">
                            {commentIcon} <div className="pl-1">soon</div>

                        </div>
                    </div>
                </div>
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
        <div className={`relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-600 ${size === "small" ? "w-7 h-7" : "w-11 h-11"}`}>
            <span className={`font-medium ${size === "small" ? "text-xs" : "text-md" } text-gray-600 dark:text-gray-300`}>{name.split(" ")[0][0]}</span>
        </div>
    )
}
