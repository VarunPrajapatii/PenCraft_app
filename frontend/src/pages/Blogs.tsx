import { BlogCard } from '../components/BlogCard';
import { useBlogs } from '../hooks/blogHooks'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/types';
import { Navigate } from 'react-router-dom';
import bg_img from "/images/BG_homepage.jpg";

import BlogCardShimmer from '../components/shimmers/BlogCardShimmer';
import InfiniteScroll from 'react-infinite-scroll-component';
const Blogs = () => {
    const { loading, blogs, hasMore, loadMore } = useBlogs();
    const user = useSelector((store: RootState) => store.auth.user);


    if (!user) return (<Navigate to="/signup" />)

    if (loading) {
        return (
            <div
                className="min-h-screen "

            >
                <img
                    src={bg_img}
                    alt="bg-img"
                    className="-z-50 fixed top-0 left-0 w-screen h-screen object-cover object-center dark:brightness-[0.2] dark:opacity-70 opacity-50 brightness-70 m-0 p-0"
                />
                <div className='-z-40 fixed top-0 left-0 w-screen backdrop-blur-xs h-screen dark:bg-black/40'></div>

                <div className="w-full pt-10 px-4 sm:px-6 lg:px-8 text-white dark:bg-gradient-to-b dark:from-black/20 dark:to-transparent backdrop-blur-sm">
                    <div className="mt-15 max-w-4xl mx-auto text-center">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-title font-bold  mb-4">
                            Discover Amazing Stories
                        </h1>
                        <p className="text-lg md:text-xl font-subtitle mb-5 max-w-2xl mx-auto">
                            Explore thought-provoking articles from writers across the globe. Find inspiration, knowledge, and entertainment all in one place.
                        </p>
                        <div className="w-32 h-1 mx-auto bg-gradient-to-r from-blue-400 to-red-400"></div>
                    </div>
                </div>

                <div className="min-h-screen ">
                    <div className='flex justify-center pt-4'>
                        <div className='p-4 mx-72 w-full'>
                            {
                                [...Array(8)].map((_, index) => {
                                    return (
                                        <BlogCardShimmer
                                            key={index}
                                            size={"large"}
                                        />
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div
            className="min-h-screen "
        >
            <img
                src={bg_img}
                alt="bg-img"
                className="-z-50 fixed top-0 left-0 w-screen h-screen object-cover object-center dark:brightness-[0.2] dark:opacity-70 opacity-50 brightness-70 m-0 p-0"
            />
            <div className={`-z-40 fixed top-0 left-0 w-screen backdrop-blur-xs h-screen dark:bg-black/40`}></div>

            <div className="min-h-screen ">
                <div className="w-full pt-10 px-4 sm:px-6 lg:px-8 text-white dark:bg-gradient-to-b dark:from-black/20 dark:to-transparent backdrop-blur-sm">
                    <div className="mt-15 max-w-4xl mx-auto text-center">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-title font-bold  mb-4">
                            Discover Amazing Stories
                        </h1>
                        <p className="text-lg md:text-xl font-subtitle mb-5 max-w-2xl mx-auto">
                            Explore thought-provoking articles from writers across the globe. Find inspiration, knowledge, and entertainment all in one place.
                        </p>
                        <div className="w-32 h-1 mx-auto bg-gradient-to-r from-blue-400 to-red-400"></div>
                    </div>
                </div>

                <div className='flex justify-center pt-4'>
                    <div className='p-4 mx-72 w-full'>
                        <InfiniteScroll
                            dataLength={blogs.length}
                            next={loadMore}
                            hasMore={hasMore}
                            loader={
                                <div>
                                    <BlogCardShimmer size={"large"} />
                                    <BlogCardShimmer size={"large"} />
                                    <BlogCardShimmer size={"large"} />
                                </div>
                            }
                            endMessage={
                                <div className="text-center py-8 text-gray-100">
                                    <p>You've reached the end of all blogs!</p>
                                </div>
                            }
                        >
                            <BlogCardShimmer size={"large"} /><BlogCardShimmer size={"large"} /><BlogCardShimmer size={"large"} /><BlogCardShimmer size={"large"} /><BlogCardShimmer size={"large"} /><BlogCardShimmer size={"large"} />
                            {/* {blogs.map(blog =>
                                <BlogCard
                                    bannerImageUrl={blog.bannerImageUrl}
                                    profileImageUrl={blog.author.profileImageUrl}
                                    blogId={blog.blogId}
                                    key={blog.blogId}
                                    authorName={blog.author.name || "Anonymous"}
                                    authorUsername={blog.author.username}
                                    title={blog.title}
                                    subtitle={blog.subtitle}
                                    content={blog.content}
                                    publishedDate={blog.publishedDate || ""}
                                    claps={blog.claps}
                                    size={"large"}
                                />

                            )} */}
                        </InfiniteScroll>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Blogs
