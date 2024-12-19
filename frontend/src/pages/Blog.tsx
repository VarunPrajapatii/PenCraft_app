// import React from 'react'
import { useBlog } from '../hooks'
import { Navigate, useParams } from 'react-router-dom';
import { FullBlog } from '../components/FullBlog';
import { Spinner } from '../components/Spinner';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/types';

const Blog = () => {
  const access_token = useSelector((store: RootState) => store.auth.access_token);
  const { id } = useParams();
  const { loading, blog } = useBlog({
    id: id || ""
  });

  if (!access_token) return (<Navigate to="/signup" replace />)

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
