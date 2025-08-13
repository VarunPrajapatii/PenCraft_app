import profleInfo_top_bg from "/images/profleInfo_top_bg.jpg";

const ProfileLayoutShimmer = () => {
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
                        background: #4b5563;
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
                            rgba(255,255,255,0.8) 50%,
                            rgba(255,255,255,0) 100%
                        );
                        animation: shimmer 2s infinite;
                    }

                    .dark .shimmer-item::after {
                        background-image: linear-gradient(
                            90deg,
                            rgba(255,255,255,0) 0%,
                            rgba(255,255,255,0.4) 50%,
                            rgba(255,255,255,0) 100%
                        );
                    }

                    @keyframes shimmer {
                        100% {
                            transform: translateX(100%);
                        }
                    }
                `}
            </style>
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
                                <div className="md:col-span-4 md:order-2 flex flex-col items-center">
                                    {/* Profile image shimmer - responsive sizing */}
                                    <div className="mt-10 md:-mt-10 relative">
                                        <div className="w-[130px] h-[130px] sm:w-[130px] sm:h-[130px] md:w-[180px] md:h-[180px]
                                        border-[8px] sm:border-[10px] md:border-[15px] border-solid border-white/20
                                        backdrop-blur-md rounded-3xl sm:rounded-4xl shimmer-item">
                                        </div>
                                    </div>

                                    {/* Bio shimmer */}
                                    <div className="mt-4 sm:mt-5 md:mt-6 text-center max-w-xs">
                                        <div className="shimmer-item h-4 w-48 mx-auto rounded"></div>
                                        <div className="shimmer-item h-4 w-32 mx-auto rounded mt-2"></div>
                                    </div>

                                    {/* Stats shimmer - responsive layout */}
                                    <div className="w-full mt-4 sm:mt-5 flex sm:block lg:flex justify-around">
                                        {/* Followers */}
                                        <div className="flex flex-col items-center">
                                            <div className="shimmer-item h-5 w-16 rounded mb-1"></div>
                                            <div className="shimmer-item h-6 w-8 rounded"></div>
                                        </div>
                                        {/* Following */}
                                        <div className="flex flex-col items-center">
                                            <div className="shimmer-item h-5 w-16 rounded mb-1"></div>
                                            <div className="shimmer-item h-6 w-8 rounded"></div>
                                        </div>
                                        {/* Claps */}
                                        <div className="flex flex-col items-center">
                                            <div className="shimmer-item h-5 w-12 rounded mb-1"></div>
                                            <div className="shimmer-item h-6 w-8 rounded"></div>
                                        </div>
                                    </div>

                                    {/* Follow button shimmer */}
                                    <div className="shimmer-item h-8 w-20 rounded-full mt-2"></div>
                                </div>

                                {/* Left part (content) - moves to bottom on mobile */}
                                <div className="md:col-span-8 md:order-1">
                                    {/* Profile Name shimmer - responsive text size */}
                                    {/* <div className="text-center sm:-m-20 lg:-m-15">
                                        <div className="shimmer-item h-12 sm:h-14 md:h-24 w-64 sm:w-80 md:w-96 mx-auto rounded"></div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileLayoutShimmer;
