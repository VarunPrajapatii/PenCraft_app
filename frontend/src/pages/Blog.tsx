import { useFullBlog } from '../hooks/hooks'
import { Navigate, useParams } from 'react-router-dom';
import { FullBlog } from '../components/FullBlog';
import { Spinner } from '../components/loadingAndShimmers/Spinner';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/types';

const Blog = () => {
  const access_token = useSelector((store: RootState) => store.auth.access_token);
  const { id } = useParams();
  const { loading, fullBlogDetails } = useFullBlog({
    id: id || ""
  });

  
  if (!access_token) return (<Navigate to="/signup" replace />)

  if (loading || !fullBlogDetails) {
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
      <FullBlog blog={fullBlogDetails} />
    </div>
  )
}

export default Blog
