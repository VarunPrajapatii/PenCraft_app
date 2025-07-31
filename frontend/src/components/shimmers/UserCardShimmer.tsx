const UserCardShimmer = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-black/50 rounded-lg shadow-md p-4 mb-3 gap-4 sm:gap-0 animate-pulse">
      {/* Profile Image Shimmer */}
      <div className="flex-shrink-0">
        <div className="w-16 h-16 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-gray-300 dark:bg-gray-600"></div>
      </div>

      {/* Name and meta Shimmer */}
      <div className="flex-1 flex flex-col justify-center text-center sm:text-left sm:ml-4">
        <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-32 sm:w-24 lg:w-32 mx-auto sm:mx-0"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 sm:w-36 lg:w-48 mx-auto sm:mx-0"></div>
      </div>

      {/* Button Shimmer */}
      <div className="flex-shrink-0">
        <div className="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default UserCardShimmer;