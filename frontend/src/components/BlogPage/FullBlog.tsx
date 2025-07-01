import { Blog, useIsFollowing } from "../../hooks/hooks"
import { useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/types"
import BlogContentRenderer from "./BlogContentRenderer"
import { ClickableClapIcon } from "../Icons/ClapIcon"
import profileImg from "/img2.jpg"
import bannerDark from "/img1.jpeg"
import { Link } from "react-router-dom"
import { formatDate, handleFollowUnfollow } from "../../utils/generalUtils"
import axios from "axios"
import { BACKEND_URL } from "../../config"


const FullBlog = ({blog}: {blog: Blog}) => {
    const [claps, setClaps] = useState(blog.claps);
    const { loading, isFollowing, updateFollowStatus } = useIsFollowing( {authorId : blog.author.userId || ""} );
    const loggedInUser = useSelector((store: RootState) => store.auth.user);
    const loggedInUserIsAuthor = loggedInUser === blog.author.userId;

    
    const incrementClap = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/blog/${blog.blogId}/clap`, {}, {
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

    const handleFollowUnfollowClick = async () => {
        await handleFollowUnfollow(
            blog.author.userId || "",
            isFollowing,
            updateFollowStatus
        );
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
                            <div className='mb-3 text-xl sm:text-2xl lg:text-4xl lg:leading-12 font-semibold text-white'>
                                <h1>{blog.title}</h1>
                            </div>
                            <div className=''>
                                <h2 className=' sm:max-w-[70%] text-sm lg:text-xl   text-white/60'>{blog.subtitle}</h2>

                            </div>
                            <div className='pt-4 hidden sm:block lg:hidden max-w-[10%] my-auto '>
                                <div className=" flex items-center">
                                    <div className='text-white' onClick={incrementClap}>
                                        <ClickableClapIcon />
                                    </div>
                                    <div className='ml-2 text-white/90 text-2xl font-bold'>
                                        {claps}
                                    </div>

                                </div>
                            </div>

                        </div>

                        <div className='hidden lg:block max-w-[10%] my-auto '>
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
                        <div className=' sm:max-w-[25%]  mr-5 text-center sm:text-left flex sm:block lg:flex  items-center gap-3 '>
                            <div>
                                <Link to={`/@${blog.author.username}`}>
                                    <img src={profileImg} alt="author" className='w-15 h-15 sm:w-20 sm:h-20 rounded-full border-2 border-white/50' />
                                </Link>
                            </div>
                            <div className=''>
                                <Link to={`/@${blog.author.username}`} >
                                    <div className='md:max-h-7 md:w-40 text-base sm:text-lg  overflow-auto no-scrollbar font-semibold text-white'>
                                        {blog.author.name}
                                    </div>
                                </Link>
                                <div className='text-xs sm:text-sm text-gray-300'>
                                    <span className="font-semibold">{formatDate(blog.publishedDate)}</span> - {`${Math.ceil(blog.content.toString().length / 700)} minute(s) read`}
                                </div>
                                <button
                                    type="button"
                                    aria-label="Follow"
                                    className={`
                                        ${(loggedInUserIsAuthor || loading) ? 'hidden' : ''}
                                        rounded-full 
                                        px-6 py-1 mt-1 
                                        font-semibold text-black shadow transition-all duration-200
                                        hover:bg-gradient-to-r hover:from-blue-400/30 hover:to-red-400/30
                                        hover:shadow-lg hover:scale-105 hover:text-red-800
                                        active:scale-95 active:shadow
                                        focus:outline-none  ring-offset-1 
                                        ${isFollowing ? 'bg-white/40 text-black/80 ' : 'bg-gray-200'}`}
                                    onClick={handleFollowUnfollowClick}
                                >
                                    {isFollowing ? "Unfollow" : "Follow"}
                                </button>
                            </div>
                            <div className="pl-15 sm:hidden">
                                <div className='text-white' onClick={incrementClap}>
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
                <div className='px-4 sm:px-6 bg-gray-100 '>
                    <BlogContentRenderer content={blog.content} />
                </div>
            </div>

        </div>
    )
}

export default FullBlog;