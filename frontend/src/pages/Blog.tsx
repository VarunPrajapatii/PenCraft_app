import { useFullBlog } from '../hooks/blogHooks'
import { Navigate, useParams } from 'react-router-dom';
import FullBlog from '../components/BlogPage/FullBlog';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/types';
import FullBlogShimmer from '../components/shimmers/FullBlogShimmer';

const Blog = () => {
  const user = useSelector((store: RootState) => store.auth.user);
  const { id } = useParams();
  const { loading, fullBlogDetails } = useFullBlog({
    id: id || ""
  });

  
  if (!user) return (<Navigate to="/signin" replace />)

  if (loading || !fullBlogDetails) {
    return <div>
      <div className="h-screen flex flex-col justify-center">
        <div className="flex justify-center">
          {/* Will add a full blog shimmer */}
          <FullBlogShimmer />
        </div>
      </div>
    </div>
  }

  return (
    <div>
      <FullBlog blog={fullBlogDetails} />
      {/* <FullBlogShimmer /> */}
    </div>
  )
}

export default Blog
