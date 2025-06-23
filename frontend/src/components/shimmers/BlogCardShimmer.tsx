
export const BlogShimmer = () => {
  return (
    <>
      {/* Add style tag at the top of your component */}
      <style>
        {`
          .shimmer-item {
            background: #e2e8f0;
            position: relative;
            overflow: hidden;
          }

          .shimmer-item::after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            transform: translateX(-100%);
            background-image: linear-gradient(
              90deg,
              rgba(255,255,255,0) 0%,
              rgba(255,255,255,0.3) 50%,
              rgba(255,255,255,0) 100%
            );
            animation: shimmer 2s infinite;
          }

          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }
        `}
      </style>

      <div className="
        pr-2 mb-2.5 flex
        w-300 h-44 overflow-hidden
        rounded-3xl border border-gray-200 shadow-xs
      ">
        {/* Left: Image placeholder */}
        <div className="shimmer-item w-[30%] h-full"></div>

        {/* Right: Content placeholders */}
        <div className="pl-3 pr-1 w-[70%] flex flex-col justify-between py-3">
          {/* Title and subtitle placeholders */}
          <div>
            <div className="shimmer-item h-7 rounded-md w-[90%] mb-3"></div>
            <div className="shimmer-item h-5 rounded-md w-[70%]"></div>
          </div>

          {/* Divider */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

          {/* Bottom row with author, read time, and interactions */}
          <div className="flex justify-between">
            {/* Author placeholder */}
            <div className="flex items-center">
              <div className="shimmer-item w-12 h-12 rounded-full m-1"></div>
              <div className="shimmer-item h-5 rounded-md w-20 ml-2"></div>
            </div>

            {/* Read time placeholder */}
            <div className="flex items-center">
              <div className="shimmer-item h-5 rounded-md w-24"></div>
            </div>

            {/* Interactions placeholder */}
            <div className="flex gap-2.5">
              <div className="shimmer-item h-5 rounded-md w-12"></div>
              <div className="shimmer-item h-5 rounded-md w-12"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogShimmer;