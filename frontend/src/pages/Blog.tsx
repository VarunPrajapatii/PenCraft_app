// import React from 'react'
import { useBlog } from '../hooks'
import { useParams } from 'react-router-dom';
import { FullBlog } from '../components/FullBlog';
import { Spinner } from '../components/Spinner';

const Blog = () => {
  const {id} = useParams();
  const {loading, blog} = useBlog({
    id: id || ""
  });

  if (loading || !blog) {
    return <div>
    
        <div className="h-screen flex flex-col justify-center">
            
            <div className="flex justify-center">
                <Spinner />
            </div>
        </div>
    </div>
}

  return (
    <div>
      <FullBlog blog={blog} />
    </div>
  )
}

export default Blog
