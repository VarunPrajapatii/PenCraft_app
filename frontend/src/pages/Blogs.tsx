import { BlogCard } from '../components/BlogCard'
import { useBlogs } from '../hooks/hooks'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/types';
import { Navigate } from 'react-router-dom';
import bg_img from "/images/BG_homepage.jpg";

import BlogCardShimmer from '../components/shimmers/BlogCardShimmer';
import InfiniteScroll from 'react-infinite-scroll-component';

const Blogs = () => {
    const {loading, blogs, hasMore, loadMore} = useBlogs();
    const user = useSelector((store: RootState) => store.auth.user)


    if(!user) return(<Navigate to="/signup" />)

    if (loading) {
        return (
            <div
                className="min-h-screen "
                
            >
                <img
                    src={bg_img}
                    alt="bg-img"
                    className="-z-50 fixed top-0 left-0 w-full h-full object-cover object-center brightness-20 border-none opacity-70 blur-[5px]"
                />
                
                {/* Semi-transparent overlay for better content readability */}
                
                <div className="min-h-screen ">
                    <div className='flex justify-center pt-25'>
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
            className="-z-50 fixed top-0 left-0 w-full h-full object-cover object-center brightness-20 border-none opacity-70 blur-[5px]"
        />
                
        {/* SemiTransparent background */}
        <div className="min-h-screen ">
            <div className='flex justify-center pt-25'>
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
                        <div className="text-center py-8 text-gray-500">
                            <p>You've reached the end of all blogs!</p>
                        </div>
                    }
                >
                    {blogs.map(blog => 
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
                        
                    )}
                </InfiniteScroll>
            </div>
            </div>
        </div>
    </div>
  )
}

export default Blogs
