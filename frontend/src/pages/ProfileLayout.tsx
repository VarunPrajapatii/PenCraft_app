import { Link, Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import profleInfo_top_bg from "/images/profleInfo_top_bg.jpg";
import defaultProfilePicture from "/images/default_profile_picture.jpg";
import { useUserProfileInfo, useIsFollowing } from "../hooks/userHooks";
import { useSelector } from "react-redux";
import { RootState } from "../redux/types";
import { handleFollowUnfollow } from "../utils/generalUtils";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useDispatch } from "react-redux";
import { authenticate } from "../redux/slice/authSlice";
import BioSection from "../components/profilePage/BioSection";
import ProfileLayoutShimmer from "../components/shimmers/ProfileLayoutShimmer";



const ProfileLayout = () => {
    // Profile image upload states
    const [uploadingImage, setUploadingImage] = useState(false);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { username: routeUsername } = useParams();
    const loggedInUser = useSelector((store: RootState) => store.auth.username);
    const loggedInUserId = useSelector((store: RootState) => store.auth.user);
    const isOwnProfile = Boolean(routeUsername && loggedInUser && routeUsername.split("@")[1] === loggedInUser.toLowerCase());
    const { userProfileDetails, loading: userProfileLoading, refetch: refetchUserProfile } = useUserProfileInfo(
        routeUsername ? { username: routeUsername } : { username: "" }
    );
    console.log("User Profile Details:", userProfileDetails);
    const { loading: followLoading, isFollowing, updateFollowStatus } = useIsFollowing({ authorId: !isOwnProfile && userProfileDetails?.userId ? userProfileDetails.userId : "" });


    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch()

    const handleFollowUnfollowClick = async () => {
        if (!userProfileDetails?.userId) return;

        await handleFollowUnfollow(
            userProfileDetails.userId,
            isFollowing,
            updateFollowStatus
        );
    };

    const handleProfileImageClick = () => {
        if (!isOwnProfile) return; // Only allow upload for own profile
        fileInputRef.current?.click();
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setUploadStatus('error');
            alert('Please select an image file');
            return;
        }

        // Validate file size (<5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            setUploadStatus('error');
            alert('File size must be less than 5MB');
            return;
        }

        try {
            setUploadingImage(true);
            setUploadStatus('idle');

            const uploadResponse = await axios.post(
                `${BACKEND_URL}/api/v1/user/profileImage/upload`,
                {
                    filename: file.name,
                    contentType: file.type
                },
                {
                    withCredentials: true,
                }
            );
            const { uploadUrl } = uploadResponse.data;

            await axios.put(uploadUrl, file, {
                headers: {
                    'Content-Type': file.type
                }
            });

            const previewUrl = URL.createObjectURL(file);
            setProfileImageUrl(previewUrl);
            setUploadStatus('success');
            
            setTimeout(async () => {
                try {
                    const userResponse = await axios.get(`${BACKEND_URL}/api/v1/auth/me`, {
                        withCredentials: true,
                    });
                    
                    dispatch(authenticate(userResponse.data));
                    
                    URL.revokeObjectURL(previewUrl);
                    window.location.reload();

                    
                } catch (error) {
                    console.error('Failed to refresh profile data:', error);
                    //if API call fails
                    window.location.reload();
                }
            }, 1500);

        } catch (error) {
            console.error('Failed to upload profile image:', error);
            setUploadStatus('error');
            
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    alert('Please log in again to upload an image');
                } else if (error.response?.status === 413) {
                    alert('File too large. Please select a smaller image');
                } else {
                    alert('Failed to upload image. Please try again.');
                }
            } else {
                alert('Failed to upload image. Please try again.');
            }
        } finally {
            setUploadingImage(false);
            // Clear the input so the same file can be selected again
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Determine active tab from route
    const isDrafts = location.pathname.endsWith("/drafts");

    // Show shimmer while loading user profile data
    if (userProfileLoading) {
        return <ProfileLayoutShimmer />;
    }

    return (
        <>
            <div>
                <div className="relative min-h-screen mt-4 sm:mt-0 dark:bg-black/85">
                    <div>
                        {/* Background - responsive height */}
                        <div className="absolute w-full h-50 top-0 -z-10">
                            <img
                                className="h-[130px] sm:h-[180px] md:h-[180px] w-full object-cover"
                                src={profleInfo_top_bg}
                                alt="Background"
                            />
                            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-600 to-transparent"></div>
                        </div>

                        {/* Main content with responsive layout */}
                        <div className="pt-[20px] sm:pt-[120px] md:pt-[150px] px-4 sm:px-6 lg:px-8">
                            {/* Mobile: stacked, Desktop: grid */}
                            <div className="flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-8">
                                {/* Right part (profile image) - moves to top on mobile */}
                                <div className=" md:col-span-4 md:order-2 flex flex-col items-center">
                                    {/* Profile image - responsive sizing */}
                                    <div className="mt-10 md:-mt-10 relative group">
                                        <img
                                            className="w-[130px] h-[130px] sm:w-[130px] sm:h-[130px] md:w-[180px] md:h-[180px]
                                            border-[8px] sm:border-[10px] md:border-[15px] border-solid border-white/20
                                            backdrop-blur-md object-cover rounded-3xl sm:rounded-4xl"
                                            src={profileImageUrl || userProfileDetails?.profileImageUrl || defaultProfilePicture}
                                            alt="Profile"
                                        />
                                        {/* Upload overlay - only show for own profile */}
                                        {isOwnProfile && (
                                            <div
                                                className={`absolute inset-0 flex items-center justify-center rounded-3xl sm:rounded-4xl 
                                                    ${uploadingImage ? 'opacity-80' : 'opacity-0 group-hover:opacity-80'} 
                                                    transition-opacity duration-200 cursor-pointer`}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    top: 0,
                                                    left: 0,
                                                    background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.10) 100%)",
                                                    backdropFilter: "blur(2px)",
                                                }}
                                                onClick={handleProfileImageClick}
                                            >
                                                {uploadingImage ? (
                                                    <svg
                                                        className="animate-spin w-14 h-14 text-black drop-shadow-sm"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.2"
                                                        stroke="currentColor"
                                                        className="w-14 h-14 text-black drop-shadow-sm"
                                                        style={{ filter: "blur(0.5px)" }}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                        )}
                                        
                                        {/* Hidden file input */}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />
                                    </div>

                                    {/* Bio - responsive padding */}
                                    <BioSection 
                                        userProfileDetails={userProfileDetails}
                                        isOwnProfile={isOwnProfile}
                                        loggedInUserId={loggedInUserId}
                                        onBioUpdate={refetchUserProfile}
                                    />

                                    {/* Upload status indicator */}
                                    {uploadStatus === 'success' && (
                                        <div className="font-body mt-2 text-xs text-green-600 font-medium">
                                            ✅ Profile image updated successfully!
                                        </div>
                                    )}
                                    {uploadStatus === 'error' && (
                                        <div className="font-body mt-2 text-xs text-red-600 font-medium">
                                            ❌ Failed to upload image
                                        </div>
                                    )}

                                    {/* Stats - responsive layout */}
                                    <div className="font-subtitle w-full mt-4 sm:mt-5 text-base sm:text-lg md:text-xl flex sm:block lg:flex justify-around text-gray-800 dark:text-gray-200">
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
                                            <div className="mt-0.5">{userProfileDetails?.totalClaps ? userProfileDetails.totalClaps : 0}</div>
                                        </div>
                                    </div>

                                    {/* Follow button - responsive spacing */}
                                    <button
                                        type="button"
                                        className={`font-subtitle
                                    ${(isOwnProfile || followLoading) ? 'hidden' : ''}
                                    rounded-full 
                                    px-6 py-1 mt-1 
                                    font-semibold text-black dark:text-white shadow transition-all duration-200
                                    hover:bg-gradient-to-r hover:from-blue-400/30 hover:to-red-400/30
                                    dark:hover:from-blue-500/30 dark:hover:to-red-500/30
                                    hover:shadow-lg hover:scale-105 hover:text-red-800 dark:hover:text-red-300
                                    active:scale-95 active:shadow
                                    focus:outline-none  ring-offset-1 
                                    ${isFollowing ? 'bg-white/40 dark:bg-gray-700/60 text-black/80 dark:text-white/90' : 'bg-gray-200 dark:bg-gray-700'}`}
                                        onClick={async () => {
                                            await handleFollowUnfollowClick()
                                            window.location.reload()
                                        }}
                                    >
                                        {isFollowing ? "Unfollow" : "Follow"}
                                    </button>
                                    {/* <Link to={`${routeUsername}/editProfile`}>
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
                                    </Link> */}
                                </div>

                                {/* Left part (content) - moves to bottom on mobile */}
                                <div className="md:col-span-8 md:order-1">
                                    {/* Profile Name - responsive text size */}
                                    <div className="  text-center sm:-m-20 lg:-m-15">
                                        <h1 className="font-title md:pl-30 text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-800 dark:text-gray-100">
                                            {userProfileDetails?.name || "Anonymous"}
                                        </h1>
                                    </div>

                                    {/* Tabs - responsive spacing and width */}
                                    <div className="mt-6 sm:mt-23 lg:mt-13 border-b border-gray-200 dark:border-gray-600">
                                        <div className="flex">
                                            <button
                                                className={`font-subtitle flex-1 md:flex-none md:mr-8 p-2 sm:p-3 text-center border-b-2 transition-colors
                                                
                                                ${(!isDrafts && !(
                                                    location.pathname === `/${routeUsername}/editProfile` ||
                                                    location.pathname === `/${routeUsername}/followers` ||
                                                    location.pathname === `/${routeUsername}/following`
                                                ))
                                                    ? 'border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400'
                                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'}`}
                                                onClick={() => navigate(`/${routeUsername}`)}
                                            >
                                                Published
                                            </button>
                                            <button
                                                className={`font-subtitle flex-1 md:flex-none p-2 sm:p-3 text-center border-b-2 transition-colors ${isOwnProfile ? '' : 'hidden'}
                                                ${isDrafts 
                                                        ? 'border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400'
                                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'}`}
                                                onClick={() => navigate(`/${routeUsername}/drafts`)}
                                            >
                                                Drafts
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tab content - responsive padding */}
                                    <div className="p-2 sm:p-4 mt-4">
                                        <div>
                                            <Outlet />
                                        </div>
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


