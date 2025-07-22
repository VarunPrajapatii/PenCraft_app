
export const BlogShimmer = ({ size }: { size: "small" | "large" }) => {
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

      <div
        className={`
          sm:pr-2 mt-1 sm:mb-1.5
          ${size == "small" ? "w-full" : "w-[100vw] sm:w-[90vw] md:w-[95vw] lg:w-[85vw]"} 
          ${size == "small" ? "h-auto sm:h-28 md:h-32 lg:h-35" : "h-auto sm:h-36 md:h-40 lg:h-44"} 
          flex flex-col sm:flex-row overflow-hidden
          rounded-xl sm:rounded-2xl lg:rounded-3xl border border-gray-200/30 shadow-xs 
          bg-white/90  backdrop-blur-sm
        `}
      >
        {/* Mobile: Upper part - Title and Subtitle */}
        <div className="sm:hidden p-3 pb-2">
          <div className={`shimmer-item ${size == "small" ? "h-5" : "h-5"} rounded-md w-[90%] mb-2 mx-auto`}></div>
          <div className={`shimmer-item ${size == "small" ? "h-4" : "h-4"} rounded-md w-[80%] mx-auto`}></div>
        </div>

        {/* Mobile: Lower part - Image and Info */}
        <div className="sm:hidden flex p-1 pt-0">
          {/* Left: Image (40% width) */}
          <div className="w-[40%] h-24 overflow-hidden rounded-lg mr-2">
            <div className="shimmer-item w-full h-full"></div>
          </div>

          {/* Right: Info (60% width) */}
          <div className="w-[60%] flex flex-col justify-between">
            {/* Top: Profile Info */}
            <div className={`${size == "small" ? "hidden" : ""} flex items-center mb-2`}>
              <div className="shimmer-item w-9 h-9 rounded-full mr-2"></div>
              <div className="shimmer-item h-4 w-16 rounded-md"></div>
            </div>

            {/* Bottom: Read time, Date, and Claps */}
            <div className="flex flex-col gap-1">
              <div className="shimmer-item h-3 w-24 rounded-md"></div>
              <div className="flex gap-3">
                <div className="shimmer-item h-4 w-8 rounded-md"></div>
                <div className="shimmer-item h-4 w-8 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: Left - Image (hidden on mobile) */}
        <div className={`hidden sm:block shimmer-item ${size == "small" ? "w-[25%] sm:w-[22%] md:w-[20%]" : "w-[35%] sm:w-[32%] md:w-[30%]"} h-full`}></div>

        {/* Desktop: Right - Content (hidden on mobile) */}
        <div className="hidden sm:flex pl-2 sm:pl-3 pr-1 w-[75%] sm:w-[78%] md:w-[70%] flex-col justify-between">
          {/* title and subtitle */}
          <div className='py-2 sm:py-3'>
            <div className={`shimmer-item ${size == "small" ? "h-5 sm:h-6" : "h-6 md:h-7 lg:h-8"} rounded-md w-[90%] mb-3`}></div>
            <div className={`shimmer-item ${size == "small" ? "h-4" : "h-5 lg:h-6"} rounded-md w-[70%]`}></div>
          </div>

          <div className=" h-[1px] w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

          {/* Author info and article info*/}
          <div className='flex flex-col sm:flex-row justify-between gap-2 sm:gap-0'>
            {/* author info */}
            <div className={`${size == "small" ? "hidden" : ""} flex items-center `}>
              <div className="shimmer-item w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full m-1"></div>
              <div className="shimmer-item h-4 sm:h-5 w-16 sm:w-20 rounded-md ml-2"></div>
            </div>  

            {/* Readtime info */}
            <div className='flex items-center gap-1 sm:gap-2.5'>
              <div className="shimmer-item h-3 lg:h-4 w-16 rounded-md"></div>
              <div className="text-lg sm:text-2xl p-1 text-gray-300">•</div>
              <div className="shimmer-item h-3 lg:h-4 w-20 sm:w-24 rounded-md"></div>
            </div>

            {/* claps and comments */}
            <div className='flex gap-1.5 sm:gap-2.5'>
              <div className='flex items-center'>
                <div className="shimmer-item h-4 sm:h-5 w-8 sm:w-10 rounded-md"></div>
              </div>
              <div className='hidden lg:flex items-center'>
                <div className="shimmer-item h-4 sm:h-5 w-8 sm:w-10 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogShimmer;