const LandingTitle = ({ title, subtitle, buttonText, color = "blue" }: { title: string; subtitle: string; buttonText: string; color?: string }) => {
    // Pre-define allowed color combinations
    const gradientClasses = {
        red: "bg-gradient-to-r from-red-500 to-red-900",
        blue: "bg-gradient-to-r from-blue-500 to-blue-900",
        green: "bg-gradient-to-r from-green-500 to-green-900",
        // Add other colors as needed
    }

    // const textClass = `text-${color}-200`
    // const bgClass = `bg-${color}-600`
    const gradientClass = gradientClasses[color as keyof typeof gradientClasses] || gradientClasses.blue

    return (
        <div>
            <div className="absolute z-10 flex flex-col w-full items-center mt-[30vh]">
                <div className={`text-6xl font-bold ${gradientClass} bg-clip-text text-transparent pb-3`}>
                    {title}
                </div>
                <div className={`text-gray-200 pb-4 text-2xl  font-medium`}>
                    {subtitle}
                </div>

                <button className="group relative inline-flex items-center overflow-hidden rounded-xl 
  bg-gray-100 text-gray-700 text-xl font-semibold px-10 py-2 mt-5
  hover:bg-gray-300 
  active:bg-gray-400 active:scale-95
  focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
  transition-all duration-150">

                    <span className="absolute -start-full transition-all group-hover:start-4 group-focus:start-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                            />
                        </svg>
                    </span>

                    <span className="text-xl font-semibold transition-all group-hover:ms-4 group-focus:ms-4">
                        {buttonText}
                    </span>
                </button>

            </div>
        </div>
    )
}

export default LandingTitle