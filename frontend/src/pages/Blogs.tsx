// import React from 'react'
import { BlogCard } from '../components/blogsHomePage/BlogCard'
import { useBlogs } from '../hooks/hooks'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/types';
import { Navigate } from 'react-router-dom';
import BlogCardShimmer from '../components/shimmers/BlogCardShimmer';
import InfiniteScroll from 'react-infinite-scroll-component';

const Blogs = () => {
    const {loading, blogs, hasMore, loadMore} = useBlogs();
    const access_token = useSelector((store: RootState) => store.auth.access_token)


    if(!access_token) return(<Navigate to="/signup" />)

    if(loading) {
        return <div className='flex justify-center '>
            <div className='p-5 mx-72 w-full'>
                <BlogCardShimmer size={"large"} />
                <BlogCardShimmer size={"large"} />
                <BlogCardShimmer size={"large"} />
                <BlogCardShimmer size={"large"} />
                <BlogCardShimmer size={"large"} />
                <BlogCardShimmer size={"large"} />
                <BlogCardShimmer size={"large"} />
                <BlogCardShimmer size={"large"} />
            </div>
        </div>
    }

  return (
    <div>
        <div className='flex justify-center'>
            <div className='p-5 mx-72 w-full'>
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
                            <p>🎉 You've reached the end of all blogs!</p>
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
                            title={blog.title}
                            subtitle={blog.subtitle}
                            content={blog.content}
                            publishedDate={blog.publishedDate}
                            claps={blog.claps}
                            size={"large"}
                        />
                    )}
                </InfiniteScroll>
            </div>
        </div>
    </div>
  )
}

export default Blogs
