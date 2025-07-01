import { Link } from "react-router-dom";
import { ClapIcon } from "./Icons/ClapIcon";
import { CommentsIcon } from "./Icons/CommentsIcon";
import img2 from '/img2.jpg'; // Adjust the path as needed
import { blogImageSrcs } from "../blogss"
import { OutputData } from "@editorjs/editorjs";



interface BlogCardProps {
  bannerImageUrl: string | null;
  profileImageUrl: string | null;
  blogId: string;
  authorName: string;
  authorUsername: string;
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
  authorUsername,
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
                sm:pr-2 mt-1 sm:mb-1.5 group
                ${size == "small" ? "w-full" : "w-[86vw] sm:w-[90vw] md:w-[95vw] lg:w-[85vw]"} 
                ${size == "small" ? "h-auto sm:h-28 md:h-32 lg:h-35" : "h-auto sm:h-36 md:h-40 lg:h-44"} 
                flex flex-col sm:flex-row overflow-hidden
                rounded-xl sm:rounded-2xl lg:rounded-3xl border border-gray-200/30 shadow-xs 
                bg-white/50 sm:bg-white/70 backdrop-blur-sm
                transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:bg-white/90
                `}
        >
          {/* Mobile: Upper part - Title and Subtitle */}
          <div className="sm:hidden p-3 pb-2">
            <h2 className={`${size == "small" ? "text-lg" : "text-lg"} text-center font-semibold leading-[1.2] mb-2 line-clamp-3 overflow-hidden text-ellipsis`}>{title}</h2>
            <p className={`${size == "small" ? "text-sm" : "text-sm"} text-center leading-[1.2] line-clamp-2 overflow-hidden text-ellipsis text-gray-600`}>{subtitle}</p>
          </div>

          {/* Mobile: Lower part - Image and Info */}
          <div className="sm:hidden flex p-1 pt-0">
            {/* Left: Image (40% width) */}
            <div className="w-[40%] h-24 overflow-hidden rounded-lg mr-2">
              <img
                src={bannerImageUrl ? bannerImageUrl : blogImageSrcs[Math.floor(Math.random() * blogImageSrcs.length)]}
                alt="Blog"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            {/* Right: Info (60% width) */}
            <div className="w-[60%] flex flex-col justify-between">
              {/* Top: Profile Info */}
              <div className={`${size == "small" ? "hidden" : ""} flex items-center mb-2`}>
                <Link to={`/@${authorUsername}`} className="flex items-center group/author">
                  <img
                    src={profileImageUrl ? profileImageUrl : img2}
                    className="w-9 h-9 rounded-full object-cover mr-2 transition-transform duration-200 group-hover/author:scale-105"
                    alt="author"
                  />
                  <div className='text-base transition-all duration-200 group-hover/author:underline group-hover/author:text-gray-400'>
                    {authorName}
                  </div>
                </Link>
              </div>

              {/* Bottom: Read time, Date, and Claps */}
              <div className="flex flex-col gap-1">
                <div className='text-xs text-gray-600'>
                  {`${Math.ceil(content.toString().length / 1000)} min read ${publishedDate ? "•" : ""} ${publishedDate ? formatDate(publishedDate) : ""}`}
                </div>
                <div className='flex text-sm gap-3'>
                  <div className='flex items-center gap-1'>
                    <ClapIcon />
                    <span>{claps}</span>
                  </div>
                  <div className='hidden lg:flex items-center gap-1'>
                    <CommentsIcon />
                    <span>100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Left - Image (hidden on mobile) */}
          <div className={`hidden sm:block ${size == "small" ? "w-[25%] sm:w-[22%] md:w-[20%]" : "w-[35%] sm:w-[32%] md:w-[30%]"} h-full overflow-hidden`}>
            <img
              src={bannerImageUrl ? bannerImageUrl : blogImageSrcs[Math.floor(Math.random() * blogImageSrcs.length)]}
              alt="Blog"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          {/* Desktop: Right - Content (hidden on mobile) */}
          <div className="hidden sm:flex pl-2 sm:pl-3 pr-1 w-[75%] sm:w-[78%] md:w-[70%] flex-col justify-between">
            {/* title and subtitle */}
            <div className=''>
              <h2 className={`${size == "small" ? "sm:text-lg md:text-xl" : "text-xl md:text-2xl lg:text-2xl"} font-semibold leading-[1.2] py-2 sm:py-3 line-clamp-2 overflow-hidden text-ellipsis`}>{title}</h2>
              <p className={`${size == "small" ? "text-sm lg:text-base" : "text-base lg:text-lg "} leading-[1.2] line-clamp-1 overflow-hidden text-ellipsis`}>{subtitle}</p>
            </div>

            <div className=" h-[1px] w-py bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

            {/* Author info and article info*/}
            <div className='flex flex-col sm:flex-row justify-between gap-2 sm:gap-0'>
              {/* author info */}
              <div className={`${size == "small" ? "hidden" : ""} flex items-center `}>
                <Link to={`/@${authorUsername}`} className="flex items-center group/author">
                  <div className="">
                    <img
                      src={profileImageUrl ? profileImageUrl : img2}
                      className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full object-cover m-1 transition-transform duration-200 group-hover/author:scale-105"
                      alt="varun's img"
                      width={48}
                      height={48}
                    />
                  </div>
                  <div>
                    <div className='ml-2 text-sm sm:text-base transition-all duration-200 group-hover/author:underline group-hover/author:text-gray-400'>
                      {authorName}
                    </div>
                  </div>
                </Link>
              </div>  

              {/* Readtime info */}
              <div className='flex items-center gap-1 sm:gap-2.5 text-xs lg:text-sm'>
                <div className="">{`${Math.ceil(content.toString().length / 1000)} minute(s) read`}</div>
                <div className="text-lg sm:text-2xl p-1">•</div>
                <div className="hidden sm:block"><span className="hidden lg:block">Published on</span> {formatDate(publishedDate)}</div>
                <div className="sm:hidden">{formatDate(publishedDate)}</div>
              </div>

              {/* claps and comments */}
              <div className='flex text-sm sm:text-lg gap-1.5 sm:gap-2.5'>
                <div className='flex items-center'>
                  <div><ClapIcon /></div>
                  <div>{claps}</div>
                </div>
                <div className='hidden lg:flex items-center'>
                  <div><CommentsIcon /></div>
                  <div>Soon</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </Link>
    </div>
  )
}