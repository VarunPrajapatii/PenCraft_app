import { useSelector } from "react-redux";
import { Avatar } from "../components/blogsHomePage/BlogCard";
import { RootState } from "../redux/types";
import { Link, Outlet } from "react-router-dom";

const ProfileLayout = () => {
  const loggedInUserDetails = useSelector((store: RootState) => store.loggedInUserDetails);
  const baseUrl = `/@${loggedInUserDetails?.email.split('@')[0]}`;

  return (
    <>
      <div>

      </div>

      <div className=" mx-40">
        <div className="h-screen flex ">
          <div className="w-[75%]">
            <Outlet />
          </div>
          <div className="border-l-2 w-[25%] px-[3%]">
            <div className="justify-center items-center flex flex-col mt-10">
              <div>
                <Avatar name={loggedInUserDetails?.name || "Anonymous"} size="giant" />
              </div>
              <div className="text-2xl font-semibold pt-4">
                {loggedInUserDetails?.name || "Anonymous"}
              </div>
              <div className="text-lg folt-bold text-gray-500 hover:text-black hover:cursor-pointer mt-4">
                <Link to={`${baseUrl}/followers`}>{loggedInUserDetails?.followersCount} {" "}Followers</Link>
              </div>
              <div className="text-lg folt-bold text-gray-500 hover:text-black hover:cursor-pointer mt-4">
                <Link to={`${baseUrl}/following`}>{loggedInUserDetails?.followingCount} {" "}Following </Link>
              </div>
              <div>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-green-700">
                  <Link to={`${baseUrl}/editProfile`}>Edit Profile</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileLayout;
