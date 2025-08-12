import { useIsFollowing, useUserFollowers } from "../../hooks/userHooks";
import { formatDate, handleFollowUnfollow } from "../../utils/generalUtils";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/types";
import defaultProfilePicture from "/images/default_profile_picture.jpg"; // fallback image
import UserCardShimmer from "../shimmers/UserCardShimmer";

const UserFollowers = () => {
  const { username } = useParams();
  const { loading, followers } = useUserFollowers({ username: username?.split('@')[1] || "" });

  if (loading) {
    return (
      <div className="max-h-[calc(100vh-150px)]  custom-scrollbar overflow-auto ">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 dark:text-gray-100">
          Following
        </div>
        {[...Array(5)].map((_, index) => (
          <UserCardShimmer key={index} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="max-h-[calc(100vh-150px)]  custom-scrollbar overflow-auto ">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 dark:text-gray-100">
          {followers.length} People Following
        </div>
        {followers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg dark:text-gray-400">No followers yet</div>
            <div className="text-gray-400 text-sm mt-2 dark:text-gray-500">This user doesn't have any followers</div>
          </div>
        ) : (
          followers.map(follower => (
            <UserCardFollower
              key={follower.userId}
              user={{
                userId: follower.userId,
                name: follower.name,
                username: follower.username,
                profileImageKey: follower.profileImageUrl || follower.profileImageKey,
                createdAt: formatDate(follower.createdAt),
              }}
            />
          ))
        )}
      </div>
    </div>
  )
};

export default UserFollowers;

type UserCardProps = {
  user: {
    userId: string;
    name: string;
    username: string;
    profileImageKey?: string | null;
    createdAt: string;
  };
};

export const UserCardFollower = ({ user }: UserCardProps) => {
  const { loading, isFollowing, updateFollowStatus } = useIsFollowing({
    authorId: user.userId,
  });
  const currentLoggedInUserId = useSelector((store: RootState) => store.auth.user);
  const isCurrentUser = currentLoggedInUserId === user.userId;

  const handleFollowUnfollowClick = async () => {
    await handleFollowUnfollow(
      user.userId,
      isFollowing,
      updateFollowStatus
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-black/50 rounded-lg shadow-md p-4 mb-3 gap-4 sm:gap-0">
      {/* Profile Image */}
      <div className="flex-shrink-0">
        <Link to={`/@${user.username}`}>
          <img
            src={
              user.profileImageKey
                ? user.profileImageKey
                : defaultProfilePicture
            }
            alt={user.name}
            className="w-16 h-16 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-gray-300 dark:border-gray-600 object-cover hover:border-blue-400 transition-colors"
          />
        </Link>
      </div>

      {/* Name and meta */}
      <div className="flex-1 flex flex-col justify-center text-center sm:text-left sm:ml-4">
        <Link
          to={`/@${user.username}`}
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <div className="font-semibold text-lg sm:text-base lg:text-lg text-gray-900 dark:text-gray-100 truncate">
            {user.name}
          </div>
        </Link>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          @{user.username} &middot; Joined - {user.createdAt}
        </div>
      </div>

      {/* hide if current user */}
      <div className="flex-shrink-0">
        {!isCurrentUser && (
          <button
            type="button"
            aria-label={isFollowing ? "Unfollow" : "Follow"}
            className={`
              rounded-full px-4 py-2 sm:px-6 sm:py-1 font-semibold text-sm shadow transition-all duration-200
              hover:bg-gradient-to-r hover:from-blue-400/30 hover:to-red-400/30
              hover:shadow-lg hover:scale-105 hover:text-red-800 dark:hover:text-red-400
              active:scale-95 active:shadow
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
              ${isFollowing
                ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                : "bg-blue-500 dark:bg-blue-600 text-white border border-blue-500 dark:border-blue-600"
              }
              ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
            onClick={handleFollowUnfollowClick}
            disabled={loading}
          >
            {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>
    </div>
  );
};

// UserCardFollowing component for following page (no follow button, like Instagram)
export const UserCardFollowing = ({ user }: UserCardProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-black/50 rounded-lg shadow-md p-4 mb-3 gap-4 sm:gap-0">
      {/* Profile Image */}
      <div className="flex-shrink-0">
        <Link to={`/@${user.username}`}>
          <img
            src={
              user.profileImageKey
                ? user.profileImageKey
                : defaultProfilePicture
            }
            alt={user.name}
            className="w-16 h-16 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-gray-300 dark:border-gray-600 object-cover hover:border-blue-400 transition-colors"
          />
        </Link>
      </div>

      {/* Name and meta */}
      <div className="flex-1 flex flex-col justify-center text-center sm:text-left sm:ml-4">
        <Link
          to={`/@${user.username}`}
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <div className="font-semibold text-lg sm:text-base lg:text-lg text-gray-900 dark:text-gray-100 truncate">
            {user.name}
          </div>
        </Link>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          @{user.username} &middot; Joined - {user.createdAt}
        </div>
      </div>

      {/* No follow button on following page */}
      <div className="flex-shrink-0">
        {/* Empty space to maintain layout */}
      </div>
    </div>
  );
};