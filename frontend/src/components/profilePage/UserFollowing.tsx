import { useParams } from "react-router-dom";
import { useUserFollowings } from "../../hooks/userHooks";
import { formatDate } from "../../utils/generalUtils";
import { UserCardFollowing } from "./UserFollowers";
import UserCardShimmer from "../shimmers/UserCardShimmer";

const UserFollowings = () => {
  const { username } = useParams();
  // Remove @ symbol if present
  const cleanUsername = username?.startsWith("@")
    ? username.slice(1)
    : username;
  const { loading, followings } = useUserFollowings({
    username: cleanUsername || "",
  });

  if (loading) {
    return (
      <div className="max-h-[calc(100vh-150px)]  custom-scrollbar overflow-auto ">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 dark:text-gray-100">
          People Followed
        </div>
        {/* 
          (Remember) :          
          Array(5) creates an array with 5 empty slots then spread to turn those empty slots into undefined values, then maps that array.
          The first parameter (_) is the current value (which is undefined and unused here so named _ as its convention).
        */}
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
          {followings.length} People Followed
        </div>
        {followings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg dark:text-gray-400">
              Not following anyone yet
            </div>
            <div className="text-gray-400 text-sm mt-2 dark:text-gray-500">
              This user hasn't followed anyone
            </div>
          </div>
        ) : (
          followings.map((following) => (
            <UserCardFollowing
              key={following.userId}
              user={{
                userId: following.userId,
                name: following.name,
                username: following.username,
                profileImageKey:
                  following.profileImageUrl ||
                  following.profileImageKey,
                createdAt: formatDate(following.createdAt),
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default UserFollowings;
