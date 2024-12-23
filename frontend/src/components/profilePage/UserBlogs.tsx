import { useSelector } from "react-redux"
import { useUserBlogs } from "../../hooks/hooks"
import { RootState } from "../../redux/types"
import { BlogCard } from "../blogsHomePage/BlogCard";


const UserBlogs = () => {

  const userId = useSelector((store: RootState) => store.auth.user);
  const { userBlogs } = useUserBlogs({ id: userId });
  console.log("blogs called from userbolgs", userBlogs);


  return (
    <>
      <div>
        <div className="">
          <div className="text-5xl font-bold mt-[8%]">
            Varun Prajapati
          </div>
          <div className="pt-8 pb-2 text-xl text-gray-600 border-b-2">
            Blogs
          </div>
          {userBlogs.map(blog => <BlogCard
            blogId={""}
            key={blog.blogId}
            authorName={""}
            title={blog.title}
            subtitle={blog.subtitle}
            content={blog.content}
            publishedDate={blog.publishedDate}
            claps={blog.claps}
          />)}
        </div>
      </div>
    </>
  )
}

export default UserBlogs
