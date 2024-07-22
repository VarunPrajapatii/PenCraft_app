import { Link } from "react-router-dom";

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
        <div className="border-b border-slate-200 p-4 min-w-md">
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
                    <div className="text-xl font-semibold pt-2">
                        {title}
                    </div>
                    <div className="text-md font-thin">
                        {content.slice(0, 150) + "..."}
                    </div>
                </div>
            </Link>
            <div className="text-slate-500 text-sm font-thin pt-4">
                {`${Math.ceil(content.length / 1000)} minute(s) read`}
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