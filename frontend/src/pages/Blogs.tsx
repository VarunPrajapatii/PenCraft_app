import React from 'react'
import { BlogCard } from '../components/BlogCard'
import { AppBar } from '../components/AppBar'
import { useBlogs } from '../hooks'
import { BlogShimmer } from '../components/BlogShimmer'

const Blogs = () => {
    /**
     * Few ways we can store and show the blogs
     * * Store it in state
     * * Store it directly  here
     * * Store it in a context variables
     * * Create out own custom hook called useBlogs
     */

    const {loading, blogs} = useBlogs();

    if(loading) {
        return <div className='flex justify-center pt-24'>
            <div>
                <BlogShimmer />
                <BlogShimmer />
                <BlogShimmer />
                <BlogShimmer />
                <BlogShimmer />
                <BlogShimmer />
                <BlogShimmer />
                <BlogShimmer />
                <BlogShimmer />
                <BlogShimmer />
                <BlogShimmer />
            </div>
        </div>
    }

  return (
    <div>
        <AppBar />
        <div className='flex justify-center'>
            <div className='p-4 '>
                {blogs.map(blog => <BlogCard 
                    id={blog.id}
                    key={blog.id}
                    authorName={blog.author.name || "Anonymous"}
                    title={blog.title}
                    content={blog.content}
                    publishedDate={"6th May 2024"}
                />
                )}
            </div>
        </div>
    </div>
  )
}

export default Blogs
