import { BlogCard } from '../components/BlogCard'
import { useBlogs } from '../hooks/hooks'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/types';
import { Navigate } from 'react-router-dom';
import BlogCardShimmer from '../components/shimmers/BlogCardShimmer';
import InfiniteScroll from 'react-infinite-scroll-component';

const Blogs = () => {
    const {loading, blogs, hasMore, loadMore} = useBlogs();
    const user = useSelector((store: RootState) => store.auth.user)


    if(!user) return(<Navigate to="/signup" />)

    if (loading) {
        return (
            <div
                className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat"
                
            >
                <div className="fixed top-0 -z-10 h-full w-full bg-white"><div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.5)] opacity-50 blur-[80px]"></div></div>
                {/* Semi-transparent overlay for better content readability */}
                
                <div className="min-h-screen bg-white/30 backdrop-blur-sm">
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
        className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat"
        >
        <div className="fixed top-0 -z-10 h-full w-full bg-blue-50"><div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(159,104,221,0.64)] opacity-50 blur-[80px]"></div></div>
        {/* SemiTransparent background */}
        <div className="min-h-screen bg-white/30 backdrop-blur-sm">
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
