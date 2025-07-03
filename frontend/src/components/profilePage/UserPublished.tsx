import { useUserBlogs } from "../../hooks/hooks"
import { BlogCard } from "../BlogCard";
import BlogCardShimmer from "../shimmers/BlogCardShimmer";
import { useParams } from "react-router-dom";


const UserPublished = () => {

  const { username } = useParams();
  const { loading, userPublishedBlogs } = useUserBlogs( username ? { username: username } : { username: "" });

  if(loading) {
    return (
      <div className="flex flex-col max-h-[calc(100vh-150px)]  custom-scrollbar overflow-auto">
        <div>
          {[...Array(3)].map((_, index) => (
            <BlogCardShimmer size={"small"} key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="flex flex-col max-h-[calc(100vh-150px)]  custom-scrollbar overflow-auto ">
          {userPublishedBlogs.map(blog => <BlogCard
            blogId={blog.blogId}
            key={blog.blogId}
            authorName={blog.authorName || ""}
            authorUsername={blog.authorUsername || ""}
            profileImageUrl={blog.profileImageUrl || ""}
            bannerImageUrl={blog.bannerImageUrl || ""}
            title={blog.title}
            subtitle={blog.subtitle}
            content={blog.content}
            publishedDate={blog.publishedDate || ""}
            claps={blog.claps}
            size={"small"} //"small" or "large"
          />)}        
        </div>
      </div>
    </>
  )
}

export default UserPublished;
