// src/components/shimmers/FullBlogShimmer.tsx

const FullBlogShimmer = () => {
  return (
    <>
      <style>
        {`
          .shimmer-item {
            background: #e2e8f0;
            position: relative;
            overflow: hidden;
          }
          .dark .shimmer-item {
            background: #374151;
          }
          .shimmer-item::after {
            content: "";
            position: absolute;
            top: 0; right: 0; bottom: 0; left: 0;
            transform: translateX(-100%);
            background-image: linear-gradient(
              90deg,
              rgba(255,255,255,0) 0%,
              rgba(255,255,255,0.3) 50%,
              rgba(255,255,255,0) 100%
            );
            animation: shimmer 2s infinite;
          }
          .dark .shimmer-item::after {
            background-image: linear-gradient(
              90deg,
              rgba(255,255,255,0) 0%,
              rgba(255,255,255,0.1) 50%,
              rgba(255,255,255,0) 100%
            );
          }
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
        `}
      </style>
      <div className="w-full min-h-screen bg-gray-100 dark:bg-gradient-to-br dark:from-black/90 dark:to-gray-950/80">
        {/* Banner shimmer */}
        <div className="relative w-full h-[60vh] lg:h-[50vh]">
          <div className="shimmer-item w-full h-full absolute top-0 left-0 rounded-none" />
          {/* Overlay for gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
          {/* Content shimmer over banner */}
          <div className="z-10 absolute inset-0 flex flex-col justify-end">
            <div className="pb-2 sm:pb-5 w-full sm:flex justify-between z-10 relative">
              {/* Title and subtitle shimmer */}
              <div className="ml-4 mb-6 sm:mb-0 sm:max-w-[65%] text-center sm:text-left">
                <div className="shimmer-item mb-3 h-10 lg:h-14 w-3/4 rounded-md" />
                <div className="shimmer-item h-6 w-2/3 rounded-md mb-2" />
                {/* Claps shimmer (mobile) */}
                <div className="pt-4 hidden sm:block lg:hidden max-w-[10%] my-auto">
                  <div className="flex items-center gap-2">
                    <div className="shimmer-item h-8 w-8 rounded-full" />
                    <div className="shimmer-item h-6 w-12 rounded-md" />
                  </div>
                </div>
              </div>
              {/* Claps shimmer (desktop) */}
              <div className="ml-200 mb-20 hidden lg:block max-w-[10%] my-auto">
                <div className="flex items-center gap-2">
                  <div className="shimmer-item h-8 w-8 rounded-full" />
                  <div className="shimmer-item h-6 w-12 rounded-md" />
                </div>
              </div>
              {/* Author info shimmer */}
              <div className="sm:max-w-[25%] mr-5 text-center sm:text-left flex sm:block lg:flex items-center gap-3">
                <div>
                  <div className="shimmer-item w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/50" />
                </div>
                <div>
                  <div className="shimmer-item h-6 w-32 rounded-md mb-2" />
                  <div className="shimmer-item h-4 w-24 rounded-md mb-2" />
                  <div className="shimmer-item h-8 w-24 rounded-full" />
                </div>
                {/* Claps shimmer (mobile) */}
                <div className="pl-15 sm:hidden flex flex-col items-center">
                  <div className="shimmer-item h-8 w-8 rounded-full mb-1" />
                  <div className="shimmer-item h-6 w-12 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Blog content shimmer */}
        <div className="bg-gray-100 dark:bg-gradient-to-br dark:from-black/90 dark:to-gray-950/80 px-4 py-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="shimmer-item h-6 w-3/4 rounded-md" />
            <div className="shimmer-item h-5 w-2/3 rounded-md" />
            <div className="shimmer-item h-4 w-full rounded-md" />
            <div className="shimmer-item h-4 w-5/6 rounded-md" />
            <div className="shimmer-item h-4 w-2/3 rounded-md" />
            <div className="shimmer-item h-4 w-1/2 rounded-md" />
            <div className="shimmer-item h-4 w-3/4 rounded-md" />
            <div className="shimmer-item h-4 w-2/3 rounded-md" />
            <div className="shimmer-item h-4 w-1/2 rounded-md" />
          </div>
        </div>
      </div>
    </>
  );
};

export default FullBlogShimmer;