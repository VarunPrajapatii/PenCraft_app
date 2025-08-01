import { Link } from "react-router-dom";
import { ClapIcon } from "./Icons/ClapIcon";
import { CommentsIcon } from "./Icons/CommentsIcon";
import defaultProfilePicture from '/images/default_profile_picture.jpg';
import { OutputData } from "@editorjs/editorjs";
import { useState } from "react";
import { useDeleteBlog } from "../hooks/hooks";
import { getConsistentGradient } from "../utils/gradientUtils";
import { calculateReadingTime } from "../utils/generalUtils";
import { useSelector } from "react-redux";
import { RootState } from "../redux/types";


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
  showDeleteButton?: boolean; // New prop to control delete button visibility
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
  size,
  showDeleteButton = false // Default to false
}: BlogCardProps) => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { deleteLoading, deleteBlog } = useDeleteBlog();
  
  // Get current user from Redux store
  const currentUser = useSelector((store: RootState) => store.auth.username);
  const isAuthor = currentUser && authorUsername && currentUser.toLowerCase() === authorUsername.toLowerCase();
  
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", options).format(date);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeletePopup(true);
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteBlog(blogId);
      setShowDeletePopup(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete blog:", error);
      alert("Failed to delete blog. Please try again.");
    }
  };

  return (
    <div className="relative">
      {/* Delete Button - Show only when showDeleteButton is true and user is the author */}
      {showDeleteButton && isAuthor && (
        <button
          onClick={handleDeleteClick}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-red-500/80 hover:bg-red-600/90 text-white transition-all duration-200 hover:scale-105"
          aria-label="Delete blog"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={handleCancelDelete}
          />
          
          {/* Popup */}
          <div className="relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg shadow-lg rounded-2xl p-6 w-full max-w-sm mx-auto">
            <h3 className="font-title text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
              Delete {publishedDate ? "Published " : "Draft "}Blog
            </h3>
            <p className="font-body text-gray-700 dark:text-gray-300 mb-6 text-center">
              Are you sure you want to delete this {publishedDate ? "published " : "draft "}blog? 
              {publishedDate && " This will remove it from public view and"} This action cannot be undone.
            </p>
            
            <div className="flex items-center gap-4">
              {/* Cancel Button */}
              <button
                onClick={handleCancelDelete}
                disabled={deleteLoading}
                className="group relative inline-flex items-center cursor-pointer rounded-full bg-gray-200 dark:bg-gray-700
                          px-4 py-2 sm:px-3 sm:py-2 md:px-5 md:py-2 text-sm sm:text-base md:text-lg
                          font-subtitle font-semibold text-black dark:text-white shadow transition-all duration-200
                          hover:bg-gradient-to-r hover:from-blue-400/30 hover:to-red-400/30
                          dark:hover:from-blue-500/30 dark:hover:to-red-500/30
                          hover:shadow-lg hover:scale-105
                          active:scale-95 active:shadow
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400
                          disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
              >
                <span className="transition-transform duration-200 group-hover:translate-x-1 group-hover:text-red-700 dark:group-hover:text-red-400">
                  Cancel
                </span>
              </button>

              {/* Confirm Delete Button */}
              <button
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className="group relative inline-flex items-center cursor-pointer rounded-full bg-red-500
                          px-4 py-2 sm:px-3 sm:py-2 md:px-5 md:py-2 text-sm sm:text-base md:text-lg
                          font-subtitle font-semibold text-white shadow transition-all duration-200
                          hover:bg-red-600 hover:shadow-lg hover:scale-105
                          active:scale-95 active:shadow
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400
                          disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
              >
                {deleteLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    Delete
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Link to={`/blog/${blogId}`}>
        <div 
          className={`
                sm:pr-2 mt-1 sm:mb-1.5 group
                ${size == "small" ? "w-full" : "w-[90vw] sm:w-[90vw] md:w-[95vw] lg:w-[85vw]"} 
                ${size == "small" ? "h-auto sm:h-28 md:h-32 lg:h-35" : "h-auto sm:h-36 md:h-40 lg:h-44"} 
                flex flex-col sm:flex-row overflow-hidden
                rounded-xl sm:rounded-2xl lg:rounded-3xl border border-gray-200/30 dark:border-gray-700/30 shadow-xs 
                bg-white/75 dark:bg-black/50 backdrop-blur-sm
                transition-all duration-200 
                ${isHovered ? '-translate-y-1 shadow-lg bg-white/90 dark:bg-black/75' : ''}
                `}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Mobile: Upper part - Title and Subtitle */}
          <div className="sm:hidden p-3 pb-2">
            <h2 className={`${size == "small" ? "text-lg" : "text-lg"} font-title font-semibold leading-[1.2] mb-2 line-clamp-2 overflow-hidden text-ellipsis text-gray-900 dark:text-gray-100`}>{title}</h2>
            <p className={`${size == "small" ? "text-sm" : "text-sm"} font-subtitle leading-[1.2] line-clamp-1 overflow-hidden text-ellipsis text-gray-600 dark:text-gray-400`}>{subtitle}</p>
          </div>

          {/* Mobile: Lower part - Image and Info */}
          <div className="sm:hidden flex p-1 pt-0">
            {/* Left: Image (40% width) */}
            <div className="w-[40%] h-24 overflow-hidden rounded-lg mr-2">
              {bannerImageUrl ? (
                <img
                  src={bannerImageUrl}
                  alt="Blog"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div
                  className={`w-full h-full transition-transform duration-300 group-hover:scale-110 ${getConsistentGradient(blogId)}`}
                />
              )}
            </div>

            {/* Right: Info (60% width) */}
            <div className="w-[60%] flex flex-col justify-between">
              {/* Top: Profile Info */}
              <div className={`${size == "small" ? "hidden" : ""} flex items-center mb-2`}>
                <Link to={`/@${authorUsername}`} className="flex items-center group/author">
                  <img
                    src={profileImageUrl ? profileImageUrl : defaultProfilePicture}
                    className="w-9 h-9 rounded-full object-cover mr-2 transition-transform duration-200 group-hover/author:scale-105"
                    alt="author"
                  />
                  <div className='font-body text-base transition-all duration-200 group-hover/author:underline group-hover/author:text-gray-400 dark:text-gray-200 dark:group-hover/author:text-gray-500'>
                    {authorName}
                  </div>
                </Link>
              </div>

              {/* Bottom: Read time, Date, and Claps */}
              <div className="flex flex-col gap-1">
                <div className='font-body text-xs text-gray-600 dark:text-gray-400'>
                  {`${calculateReadingTime(content)} ${publishedDate ? "•" : ""} ${publishedDate ? formatDate(publishedDate) : ""}`}
                </div>
                <div className='font-body flex text-sm gap-3 text-gray-800 dark:text-gray-200'>
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
            {bannerImageUrl ? (
              <img
                src={bannerImageUrl}
                alt="Blog"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div
                className={`w-full h-full transition-transform duration-300 group-hover:scale-110 ${getConsistentGradient(blogId)}`}
              />
            )}
          </div>

            {/* Desktop: Right - Content (hidden on mobile) */}
            <div className="hidden sm:flex pl-2 sm:pl-3 pr-1 w-[75%] sm:w-[78%] md:w-[70%] flex-col justify-between">
              {/* title and subtitle */}
              <div className='py-2 sm:py-3'>
                <h2 className={`${size == "small" ? "sm:text-lg md:text-xl" : "text-xl md:text-2xl lg:text-2xl"} font-title font-bold leading-[1.2] line-clamp-2 overflow-hidden text-ellipsis mb-3 text-gray-900 dark:text-gray-100`}>{title}</h2>
                <p className={`${size == "small" ? "text-sm lg:text-sm" : "text-base lg:text-base "} font-subtitle leading-[1.2] line-clamp-1 overflow-hidden text-ellipsis text-gray-700 dark:text-gray-300`}>{subtitle}</p>
              </div>

              <div className=" h-[1px] w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-600 to-transparent"></div>            {/* Author info and article info*/}
            <div className='font-body flex flex-col sm:flex-row justify-between gap-2 sm:gap-0'>
              {/* author info */}
              <div className={`${size == "small" ? "hidden" : ""} flex items-center `}>
                <Link to={`/@${authorUsername}`} className="flex items-center group/author">
                  <div className="">
                    <img
                      src={profileImageUrl ? profileImageUrl : defaultProfilePicture}
                      className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full object-cover m-1 transition-transform duration-200 group-hover/author:scale-105"
                      alt="varun's img"
                      width={48}
                      height={48}
                    />
                  </div>
                  <div>
                    <div className='font-body ml-2 text-sm sm:text-base transition-all duration-200 group-hover/author:underline group-hover/author:text-gray-400 dark:text-gray-200 dark:group-hover/author:text-gray-500'>
                      {authorName}
                    </div>
                  </div>
                </Link>
              </div>  

              {/* Readtime info */}
              <div className='font-subtitle flex items-center gap-1 sm:gap-2.5 text-xs lg:text-sm text-gray-600 dark:text-gray-400'>
                <div className="">{calculateReadingTime(content)}</div>
                <div className="text-lg sm:text-2xl p-1">{publishedDate? "•" : ""}</div>
                <span className="hidden sm:block">{publishedDate? "Published on " : ""}{formatDate(publishedDate)}</span>
                <span className="sm:hidden">{formatDate(publishedDate)}</span>
              </div>

              {/* claps and comments */}
              <div className='font-subtitle flex text-sm sm:text-lg gap-1.5 sm:gap-2.5 text-gray-800 dark:text-gray-200'>
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