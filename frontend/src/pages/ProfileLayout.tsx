import { Link, Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import bg_top from "/images/backgroundTopProfilePage.jpg";
import img2 from "/img2.jpg";
import BlogCardShimmer from "./../components/shimmers/BlogCardShimmer";
import { useUserProfileInfo, useIsFollowing } from "../hooks/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../redux/types";
import { handleFollowUnfollow } from "../utils/generalUtils";


const ProfileLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { username: routeUsername } = useParams();
    const loggedInUser = useSelector((store: RootState) => store.auth.username);
    const isOwnProfile = routeUsername && loggedInUser && routeUsername.split("@")[1] === loggedInUser.toLowerCase();
    const { userProfileDetails } = useUserProfileInfo(
        routeUsername  ? { username: routeUsername } : { username: "" }
    );


    const { loading: followLoading, isFollowing, updateFollowStatus } = useIsFollowing({ authorId: !isOwnProfile && userProfileDetails?.userId ? userProfileDetails.userId : "" });

    const handleFollowUnfollowClick = async () => {
        if (!userProfileDetails?.userId) return;

        await handleFollowUnfollow(
            userProfileDetails.userId,
            isFollowing,
            updateFollowStatus
        );
    };

    // Determine active tab from route
    const isDrafts = location.pathname.endsWith("/drafts");


    return (
        <>
            <div>
                <div className="relative min-h-screen mt-4 sm:mt-0">
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
                                        <Link to={`${routeUsername}/followers`}>
                                            <div className="flex flex-col items-center">
                                                <div className="font-medium">Followers</div>
                                                <div className="mt-0.5">{userProfileDetails?.followersCount ? userProfileDetails.followersCount : 0}</div>
                                            </div>
                                        </Link>
                                        <Link to={`${routeUsername}/following`}>
                                            <div className="flex flex-col items-center">
                                                <div className="font-medium">Following</div>
                                                <div className="mt-0.5">{userProfileDetails?.followingCount ? userProfileDetails.followingCount : 0}</div>
                                            </div>
                                        </Link>
                                        <div className="flex flex-col items-center">
                                            <div className="font-medium">Claps</div>
                                            <div className="mt-0.5">2000</div>
                                        </div>
                                    </div>

                                    {/* Follow button - responsive spacing */}
                                    <button
                                        type="button"
                                        className={`
                                    ${(isOwnProfile || followLoading) ? 'hidden' : ''}
                                    rounded-full 
                                    px-6 py-1 mt-1 
                                    font-semibold text-black shadow transition-all duration-200
                                    hover:bg-gradient-to-r hover:from-blue-400/30 hover:to-red-400/30
                                    hover:shadow-lg hover:scale-105 hover:text-red-800
                                    active:scale-95 active:shadow
                                    focus:outline-none  ring-offset-1 
                                    ${isFollowing ? 'bg-white/40 text-black/80 ' : 'bg-gray-200'}`}
                                        onClick={handleFollowUnfollowClick}
                                    >
                                        {isFollowing ? "Unfollow" : "Follow"}
                                    </button>
                                    <Link to={`${routeUsername}/editProfile`}>
                                        <button
                                            type="button"
                                            className={`
                                        ${isOwnProfile ? '' : 'hidden'}
                                        rounded-full 
                                        px-6 py-1 mt-1 
                                        font-semibold text-black shadow transition-all duration-200
                                        hover:bg-gradient-to-r hover:from-blue-400/30 hover:to-red-400/30
                                        hover:shadow-lg hover:scale-105 hover:text-red-800
                                        active:scale-95 active:shadow
                                        focus:outline-none  ring-offset-1 
                                        ${isFollowing ? 'bg-white/40 text-black/80 ' : 'bg-gray-200'}`}
                                        >
                                            Edit Profile
                                        </button>
                                    </Link>
                                </div>

                                {/* Left part (content) - moves to bottom on mobile */}
                                <div className="md:col-span-8 md:order-1">
                                    {/* Profile Name - responsive text size */}
                                    <div className="  text-center sm:-m-20 lg:-m-15">
                                        <h1 className="md:pl-30 text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-800">
                                            {userProfileDetails?.name || "Anonymous"}
                                        </h1>
                                    </div>

                                    {/* Tabs - responsive spacing and width */}
                                    <div className="mt-6 sm:mt-23 lg:mt-13 border-b border-gray-200">
                                        <div className="flex">
                                            <button
                                                className={`flex-1 md:flex-none md:mr-8 p-2 sm:p-3 text-center border-b-2 transition-colors
                                                ${isOwnProfile ? '' : 'hidden'}
                                                ${(!isDrafts && !(
                                                    location.pathname === `/${routeUsername}/editProfile` ||
                                                    location.pathname === `/${routeUsername}/followers` ||
                                                    location.pathname === `/${routeUsername}/following`
                                                ))
                                                    ? 'border-purple-600 text-purple-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                                onClick={() => navigate(`/${routeUsername}`)}
                                            >
                                                Published
                                            </button>
                                            <button
                                                className={`flex-1 md:flex-none p-2 sm:p-3 text-center border-b-2 transition-colors
                                                ${isDrafts 
                                                        ? 'border-purple-600 text-purple-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                                onClick={() => navigate(`/${routeUsername}/drafts`)}
                                            >
                                                Drafts
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tab content - responsive padding */}
                                    <div className="p-2 sm:p-4 mt-4">
                                        {!isDrafts && (
                                            <div>
                                                <Outlet />
                                            </div>
                                        )}

                                        {isDrafts && (
                                            <BlogCardShimmer size={"small"} />
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
