import { useUserDrafts } from "../../hooks/blogHooks"
import { BlogCard } from "../BlogCard";
import BlogCardShimmer from "../shimmers/BlogCardShimmer";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/types";


const UserDrafts = () => {

  const { username } = useParams();
  const { loading, userDrafts } = useUserDrafts( username ? { username: username } : { username: "" });
  console.log("User Drafts coming in component: ", userDrafts);

  // Check if this is the logged-in user's own profile
  const loggedInUser = useSelector((store: RootState) => store.auth.username);
  // Remove @ symbol from username if present for comparison
  const cleanUsername = username?.startsWith('@') ? username.slice(1) : username;
  const isOwnProfile = Boolean(cleanUsername && loggedInUser && cleanUsername === loggedInUser.toLowerCase());
  console.log("UserDrafts Debug:", {
    username,
    loggedInUser,
    loggedInUserLower: loggedInUser?.toLowerCase(),
    isOwnProfile
  });
  if(loading) {
    return (
      <div className="flex flex-col max-h-[calc(100vh-150px)]  custom-scrollbar overflow-auto">
        <div>
          {[...Array(4)].map((_, index) => (
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
          {userDrafts.map(blog => <BlogCard
            blogId={blog.blogId}
            key={blog.blogId}
            authorName={blog.authorName || ""}
            authorUsername={cleanUsername || ""} // Use the username from URL instead of blog data
            profileImageUrl={blog.profileImageUrl || ""}
            bannerImageUrl={blog.bannerImageUrl || ""}
            title={blog.title}
            subtitle={blog.subtitle}
            content={blog.content}
            publishedDate={blog.publishedDate || ""}
            claps={blog.claps}
            size={"small"}
            showDeleteButton={isOwnProfile} // Show delete button only on own profile
          />)}        
        </div>
      </div>
    </>
  )
}

export default UserDrafts;
