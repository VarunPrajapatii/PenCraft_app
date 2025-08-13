import { useIsFollowing } from "../../hooks/userHooks";
import { useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/types"
import BlogContentRenderer from "./BlogContentRenderer"
import { ClickableClapIcon } from "../Icons/ClapIcon"
import defaultProfilePicture from "/images/default_profile_picture.jpg"
import bannerDark from "/images/default_banner_dark.jpeg"
import { Link, useNavigate } from "react-router-dom"
import { formatDate, handleFollowUnfollow, calculateReadingTime } from "../../utils/generalUtils"
import axios from "axios"
import { BACKEND_URL } from "../../config"
import { useDispatch } from "react-redux"
import { setDraftData } from "../../redux/slice/draftSlice"
import { Blog } from "../../hooks/hooksTypes";


const FullBlog = ({ blog }: { blog: Blog }) => {
    const [claps, setClaps] = useState(blog.claps);
    const { loading, isFollowing, updateFollowStatus } = useIsFollowing({ authorId: blog.author.userId || "" });
    const [followActionLoading, setFollowActionLoading] = useState(false);
    const loggedInUser = useSelector((store: RootState) => store.auth.user);
    const loggedInUserIsAuthor = loggedInUser === blog.author.userId;
    const navigate = useNavigate();
    const dispatch = useDispatch()
    // for UI conditional rendering
    const isDraft = !blog.publishedDate;

    
    const incrementClap = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/blog/${blog.blogId}/clap`, {}, {
                withCredentials: true
            });

            if (response.status === 200) {
                setClaps(prevClaps => prevClaps + 1);
            }
        } catch (error) {
            console.error("Failed to increment claps", error);

        }
    }

    const handleFollowUnfollowClick = async () => {
        setFollowActionLoading(true);
        try {
            await handleFollowUnfollow(
                blog.author.userId || "",
                isFollowing,
                updateFollowStatus
            );
        } catch (error) {
            console.error("Failed to follow/unfollow:", error);
        } finally {
            setFollowActionLoading(false);
        }
    }

    const handleClickEdit = async () => {
        try {
            let bannerFile: File | null = null;
            if(blog.bannerImageUrl) {
                try {
                    const response = await fetch(blog.bannerImageUrl);
                    const blob = await response.blob();
                    bannerFile = new File([blob], 'banner-image.jpg', { type: blob.type }); 
                } catch (error) {
                    console.warn("Could not convert banner URL to file:", error);
                }
            }
            dispatch(setDraftData({
                title: blog.title,
                subtitle: blog.subtitle,
                content: blog.content,
                bannerImageUrl: blog.bannerImageUrl || "",
                bannerFile: bannerFile,
                isEditingDraft: true,
                editingBlogId: blog.blogId
            }))
            
            navigate(`/draftEdit/${blog.blogId}`);
        } catch (error) {
            console.error("Failed to prepare draft for editing:", error);
            alert("Failed to load draft for editing. Please try again.");
        }
    }

    return (
        <div className=''>
            {/* Banner and author section */}
            <div className=' relative w-full h-[60vh] lg:h-[50vh]'>
                {/* Banner as background */}
                <div
                    className="w-full h-full brightness-80 contrast-80  bg-cover bg-center"
                    style={blog.bannerImageUrl ? { backgroundImage: `url(${blog.bannerImageUrl})` } : { backgroundImage: `url(${bannerDark})` }}
                ></div>

                {/* Content (title, author, etc.) absolutely positioned over the background */}
                <div className="z-10 absolute inset-0 flex flex-col justify-end">
                    {/* Gradient overlay at the bottom */}
                    <div className="h-full lg:h-50 absolute bottom-0 left-0 w-full  pointer-events-none z-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
                    <div className="pb-2 sm:pb-5  w-full sm:flex justify-between z-10 relative">
                        {/* Title and subtitle */}
                        <div className=' sm:ml-4 mb-6 sm:mb-0 sm:max-w-[65%] text-center sm:text-left'>
                            <div className='mb-3 text-xl sm:text-2xl lg:text-4xl lg:leading-12 font-title font-bold text-white'>
                                <h1>{blog.title}</h1>
                            </div>
                            <div className=''>
                                <h2 className='font-subtitle sm:max-w-[70%] text-sm lg:text-xl text-white/60'>{blog.subtitle}</h2>
                            </div>
                            {/* If draft, show Publish and Edit buttons, else show claps */}
                            {blog.publishedDate === null ? (
                                <div className="pt-4 flex gap-4 justify-center lg:justify-start">
                                    <button
                                        type="button"
                                        aria-label="Edit"
                                        onClick={() => {
                                            handleClickEdit();
                                        }}
                                        className={`font-subtitle group relative inline-flex items-center rounded-full bg-gray-200 dark:bg-gray-700
                                    px-4 py-2 sm:px-3 sm:py-2 md:px-5 md:py-2 text-sm sm:text-base md:text-lg
                                    font-semibold text-black dark:text-white shadow transition-all duration-200 cursor-pointer
                                    hover:bg-gradient-to-r hover:from-blue-400/30 hover:to-red-400/30
                                    dark:hover:from-blue-500/30 dark:hover:to-red-500/30
                                    hover:shadow-lg hover:scale-105
                                    active:scale-95 active:shadow
                                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-gray-500
                                  `}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="md:inline-block size-6 lg:mr-2 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-blue-700 dark:group-hover:text-blue-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L6.75 19.963l-4.5 1.318 1.318-4.5 13.294-13.294Z" />
                                        </svg>
                                        <span className={`hidden lg:block transition-transform duration-200 group-hover:translate-x-1 group-hover:text-blue-700 dark:group-hover:text-blue-400`}>
                                            Edit Draft
                                        </span>
                                    </button>
                                </div>
                            ) : (
                                <div className={`${isDraft && "sm:hidden"}  pt-4 hidden sm:block lg:hidden max-w-[10%] my-auto`}>
                                    <div className=" flex items-center">
                                        <div className='text-white' onClick={incrementClap}>
                                            <ClickableClapIcon />
                                        </div>
                                        <div className='ml-2 text-white/90 text-2xl font-bold'>
                                            {claps}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        <div className={`${isDraft ? "hidden lg:hidden" : "hidden lg:block"}  max-w-[10%] my-auto`}>
                            <div className=" flex items-center">
                                <div className='text-white' onClick={incrementClap}>
                                    <ClickableClapIcon />
                                </div>
                                <div className='ml-2 text-white/90 text-2xl font-bold'>
                                    {claps}
                                </div>

                            </div>
                        </div>

                        {/* author info */}
                        <div className={` ${isDraft && "hidden sm:hidden lg:hidden"} sm:max-w-[25%]  mr-5 text-center sm:text-left flex sm:block lg:flex  items-center gap-1 sm:gap-2 lg:gap-3`}>
                            <div>
                                <Link to={`/@${blog.author.username}`}>
                                    <img src={blog.author.profileImageUrl || defaultProfilePicture} alt="Profile" className='w-12 h-12 sm:w-20 sm:h-20 rounded-full border-2 border-white/50' />
                                </Link>
                            </div>
                            <div className=''>
                                <Link to={`/@${blog.author.username}`} >
                                    <div className='font-body md:max-h-7 md:w-40 text-sm sm:text-lg overflow-auto no-scrollbar font-semibold text-white'>
                                        {blog.author.name}
                                    </div>
                                </Link>
                                <div className='font-body hidden sm:block text-xs sm:text-sm text-gray-300'>
                                    <span className="font-semibold">{blog.publishedDate ? formatDate(blog.publishedDate) : ""}</span> - {calculateReadingTime(blog.content)}
                                </div>
                                <div className='font-body block sm:hidden text-xs sm:text-sm text-gray-300'>
                                    <span className="font-semibold">{blog.publishedDate ? formatDate(blog.publishedDate) : ""}</span> - {calculateReadingTime(blog.content)}
                                </div>
                                {!loggedInUserIsAuthor && !loading && (
                                    <button
                                        type="button"
                                        aria-label="Follow"
                                        disabled={loading || followActionLoading}
                                        className={`group relative inline-flex items-center cursor-pointer rounded-full
                                            px-4 py-2 sm:px-3 sm:py-2 md:px-5 md:py-2 text-sm sm:text-base md:text-lg
                                            font-subtitle font-semibold shadow transition-all duration-200
                                            hover:shadow-lg hover:scale-105
                                            active:scale-95 active:shadow
                                            focus:outline-none focus:ring-2
                                            disabled:opacity-50 disabled:cursor-not-allowed justify-center mt-1
                                            ${isFollowing 
                                                ? 'bg-red-500/60 text-white hover:bg-red-600/80 hover:bg-gradient-to-r hover:from-red-400/30 hover:to-red-600/30' 
                                                : 'bg-red-600 text-white hover:bg-red-600 hover:bg-gradient-to-r hover:from-red-400/30 hover:to-red-700/30'
                                            }`}
                                        onClick={handleFollowUnfollowClick}
                                    >
                                        {(loading || followActionLoading) ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
                                            <span className="transition-transform duration-200 group-hover:translate-x-1">
                                                {isFollowing ? "Unfollow" : "Follow"}
                                            </span>
                                        )}
                                    </button>
                                )}
                            </div>
                            <div className={`${isDraft && "hidden"} pl-15 sm:hidden`}>
                                <div className='text-white ' onClick={incrementClap}>
                                    <ClickableClapIcon />
                                </div>
                                <div className='ml-2 text-white/90 text-2xl font-bold'>
                                    {claps}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                {/* Blog section */}
                <div className='px-4 sm:px-6 bg-gray-100 dark:bg-gradient-to-br dark:from-black/90 dark:to-gray-950/80'>
                    <BlogContentRenderer content={blog.content} />
                </div>
            </div>

        </div>
    )
}

export default FullBlog;