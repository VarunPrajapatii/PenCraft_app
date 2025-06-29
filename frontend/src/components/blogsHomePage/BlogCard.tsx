import { Link } from "react-router-dom";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faHandsClapping } from '@fortawesome/free-solid-svg-icons'
// import { faComment } from '@fortawesome/free-solid-svg-icons'
import { ClapIcon } from "../Icons/ClapIcon";
import { CommentsIcon } from "../Icons/CommentsIcon";
import img2 from '/img2.jpg'; // Adjust the path as needed
import {blogImageSrcs} from "../../blogss"
import { OutputData } from "@editorjs/editorjs";

// const clapIcon = <FontAwesomeIcon icon={faHandsClapping} />  // Replace this with any icon you prefer
// const commentIcon = <FontAwesomeIcon icon={faComment} /> // Replace this with any icon you prefer


interface BlogCardProps {
    bannerImageUrl: string | null;
    profileImageUrl: string | null;
    blogId: string;
    authorName: string;
    title: string;
    subtitle: string;
    content: OutputData;
    publishedDate: string;
    claps: number;
    size: "small" | "large";
}

export const BlogCard = ({
    bannerImageUrl,
    profileImageUrl,
    blogId,
    authorName,
    title,
    subtitle,
    content,
    publishedDate,
    claps,
    size
}: BlogCardProps) => {
    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" };
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-GB", options).format(date);
    };

    return (
        <div>
            <Link to={`/blog/${blogId}`}>
            <div className={`
                pr-2 mb-2.5 flex
                ${size == "small" ? "w-full" : "w-300"} ${size == "small" ? "h-35" : "h-44"} overflow-hidden
                rounded-3xl border border-gray-200 shadow-xs 
                transition-all duration-200 hover:-translate-y-1 hover:shadow-lg
                `}
            >

        {/* Left: Image */}
        <div className={` ${size == "small" ? "w-[20%]" : "w-[30%]"} h-full`}>
          <img
            src={bannerImageUrl? bannerImageUrl : blogImageSrcs[Math.floor(Math.random() * blogImageSrcs.length)]} // Adjust path as needed
            alt="Blog"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: Content */}
        <div className="pl-3 pr-1 w-[70%] flex flex-col justify-between ">
          {/* title and subtitle */}
          <div className=''>
            <h2 className={`${size == "small" ? "text-xl" : "text-2xl"} font-semibold leading-[1.2]  py-3 `}>{title}</h2>
            <p className={`${size == "small" ? "text-base" : "text-lg"} leading-[1.2]`}>{subtitle.slice(0, 150) + "..."}</p>
          </div>

          <div className=" h-[1px] w-py bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

          {/* Author info and article info*/}
          <div className='flex justify-between '>
            {/* author info */}
            <div className={`${size == "small" ? "hidden" : ""} flex items-center `}>
              <div className="">
                <img
                  src={profileImageUrl ? profileImageUrl : img2}
                  className="w-12 h-12 rounded-full object-cover m-1"
                  alt="varun's img"
                  width={48}
                  height={48}
                  // loading="lazy"
                />
              </div>
              <div>
                <div className='ml-2 '>
                  {authorName}
                </div>
              </div>
            </div>

            {/* Readtime info */}
            <div className='flex items-center gap-2.5'>
              <div className="">{`${Math.ceil(content.toString().length / 1000)} minute(s) read`}</div>
              <div className=" text-2xl p-1">•</div>
              <div className="">Published on {formatDate(publishedDate)}</div>
            </div>

            {/* claps and comments */}
            <div className='flex text-lg gap-2.5'>
              <div className='flex  items-center'>
                <div><ClapIcon /></div>
                <div>{claps}</div>
              </div>
              <div className='flex  items-center'>
                <div><CommentsIcon /></div>
                <div>100</div>
              </div>
            </div>


          </div>
        </div>

      </div>

</Link>
    </div>
    )
}



export function Circle() {
    return (
        <div className="h-1 w-1 rounded-full bg-slate-700"></div>
    )
}

export function Avatar({name, size = "small"}: {name:string, size: "small" | "big" | "giant"}) {
    return (
        <div className={`relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-600 ${size === "giant" ? "w-40 h-40" : size === "small" ? "w-7 h-7" : "w-11 h-11"}`}>
            <span className={`font-medium ${size === "giant" ? "text-5xl" : size === "small" ? "text-xs" : "text-md" } text-gray-600 dark:text-gray-300`}>{name.split(" ")[0][0]}</span>
        </div>
    )
}