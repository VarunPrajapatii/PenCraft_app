import { useSelector } from "react-redux";
import { Avatar } from "../components/blogsHomePage/BlogCard";
import { RootState } from "../redux/types";
import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import bg_top from "/images/backgroundTopProfilePage.jpg";
import img2 from "/img2.jpg";
import BlogCardShimmer from "./../components/shimmers/BlogCardShimmer";


const ProfileLayout = () => {
  const [activeTab, setActiveTab] = useState('Published');
  const loggedInUserDetails = useSelector((store: RootState) => store.loggedInUserDetails);
  const baseUrl = `/@${loggedInUserDetails?.email.split('@')[0]}`;

  return (
    <>
      <div>
         <div className="relative min-h-screen">
            <div>
                {/* Background - responsive height */}
                <div className="absolute w-full h-50 top-0 -z-10">
                    <img
                        className="h-[130px] sm:h-[180px] md:h-[180px] w-full object-cover"
                        src={bg_top}
                        alt="Background"
                    />
                    <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                </div>

                {/* Main content with responsive layout */}
                <div className="pt-[20px] sm:pt-[120px] md:pt-[150px] px-4 sm:px-6 lg:px-8">
                    {/* Mobile: stacked, Desktop: grid */}
                    <div className="flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-8">
                        {/* Right part (profile image) - moves to top on mobile */}
                        <div className=" md:col-span-4 md:order-2 flex flex-col items-center">
                            {/* Profile image - responsive sizing */}
                            <div className="mt-10 md:-mt-10 ">
                                <img
                                    className="w-[130px] h-[130px] sm:w-[130px] sm:h-[130px] md:w-[180px] md:h-[180px]
                                            border-[8px] sm:border-[10px] md:border-[15px] border-solid border-white/20
                                            backdrop-blur-md object-cover rounded-3xl sm:rounded-4xl"
                                    src={img2}
                                    alt="Profile"
                                />
                            </div>

                            {/* Bio - responsive padding */}
                            <div className=" mt-4 sm:mt-5 md:mt-6 text-center max-w-xs">
                                <p className="text-sm sm:text-base text-gray-700">
                                    Passionate writer, avid reader, and lifelong learner. Sharing stories, insights, and inspiration one post at a time.
                                </p>
                            </div>

                            {/* Stats - responsive layout */}
                            <div className="w-full mt-4 sm:mt-5 text-base sm:text-lg md:text-xl flex sm:block lg:flex justify-around">
                              <Link to={`${baseUrl}/followers`}>
                                <div className="flex flex-col items-center">
                                    <div className="font-medium">Followers</div>
                                    <div className="mt-0.5">{loggedInUserDetails?.followersCount}</div>
                                </div>
                              </Link>
                              <Link to={`${baseUrl}/following`}>
                                <div className="flex flex-col items-center">
                                    <div className="font-medium">Following</div>
                                    <div className="mt-0.5">{loggedInUserDetails?.followingCount}</div>
                                </div>
                                </Link>
                                <div className="flex flex-col items-center">
                                    <div className="font-medium">Claps</div>
                                    <div className="mt-0.5">2000</div>
                                </div>
                            </div>

                            {/* Follow button - responsive spacing */}
                            <div className="mt-6 sm:mt-8">
                                <button className="px-4 py-2 sm:px-6 sm:py-2.5 bg-blue-500 text-white text-sm sm:text-base rounded-lg hover:bg-blue-600 transition-colors">
                                    Follow
                                </button>
                            </div>
                        </div>

                        {/* Left part (content) - moves to bottom on mobile */}
                        <div className="md:col-span-8 md:order-1">
                            {/* Profile Name - responsive text size */}
                            <div className="  text-center sm:-m-20 lg:-m-15">
                                <h1 className="md:pl-30 text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-800">
                                    {loggedInUserDetails?.name || "Anonymous"}
                                </h1>
                            </div>

                            {/* Tabs - responsive spacing and width */}
                            <div className="mt-6 sm:mt-23 lg:mt-13 border-b border-gray-200">
                                <div className="flex">
                                    <button
                                        className={`flex-1 md:flex-none md:mr-8 p-2 sm:p-3 text-center border-b-2 transition-colors
                                                ${activeTab === 'Published'
                                                ? 'border-purple-600 text-purple-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                        onClick={() => setActiveTab('Published')}
                                    >
                                        Published
                                    </button>
                                    <button
                                        className={`flex-1 md:flex-none p-2 sm:p-3 text-center border-b-2 transition-colors
                                                ${activeTab === 'Bookmarks'
                                                ? 'border-purple-600 text-purple-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                        onClick={() => setActiveTab('Bookmarks')}
                                    >
                                        Bookmarks
                                    </button>
                                </div>
                            </div>

                            {/* Tab content - responsive padding */}
                            <div className="p-2 sm:p-4 mt-4">
                                {activeTab === 'Published' && (
                                    <div>
                                        <Outlet />
                                    </div>
                                )}

                                {activeTab === 'Bookmarks' && (
                                    <BlogCardShimmer />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </>
  );
};

export default ProfileLayout;
