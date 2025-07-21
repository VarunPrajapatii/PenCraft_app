import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
// import logo from "/images/PC_logo_light.png";

interface LandingTitleProps {
  title: string;
  subtitle: string;
  buttonText: string;
  color?: string;
}

const LandingTitle = ({ 
  title, 
  subtitle, 
  buttonText, 
  color = "blue",
}: LandingTitleProps) => {
    const navigate = useNavigate();
    
    const gradientClasses = {
        red: "bg-gradient-to-r from-red-500 to-red-900",
        blue: "bg-gradient-to-r from-blue-500 to-blue-900",
        green: "bg-gradient-to-r from-emerald-500 to-emerald-900",
    }

    const joinLineTextClasses = {
        red: "text-red-300 lg:text-red-800/70",
        blue: "text-blue-300 lg:text-blue-800/70",
        green: "text-green-300 lg:text-green-800/70",
    }

    const gradientClass = gradientClasses[color as keyof typeof gradientClasses] || gradientClasses.blue

    return (
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center w-full px-4">
            {/* pretirtle with app branding */}
            {/* <motion.div 
              className="absolute top-15 sm:top-15 lg:top-15 left-1/2 transform -translate-x-1/2 font-body text-white/90 text-lg md:text-xl mb-4 text-center max-w-2xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="font-body text-white/80 text-sm md:text-xl ">
                <span>Welcome to</span> <img src={logo} alt="PenCraft logo" className="inline-block h-4 md:h-6" />{" • "}{"Join thousands of storytellers sharing their passion"}
              </div>
            </motion.div> */}

            {/* Main content container */}
            <div className="absolute top-30 lg:top-40 flex flex-col justify-center items-center mt-[5vh] md:mt-0">


                {/* Main title */}
                <motion.div 
                  className={`font-quote text-center text-4xl md:text-5xl lg:text-6xl font-bold ${gradientClass} bg-clip-text text-transparent pb-2 md:pb-1 max-w-4xl`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                    {title}
                </motion.div>

                {/* Subtitle */}
                <motion.div 
                  className={`font-subtitle text-center text-base w-[80%] md:w-full md:text-xl lg:text-2xl text-gray-50 font-medium max-w-3xl `}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                    {subtitle}
                </motion.div>

                {/* Additional descriptive text */}
                <motion.div 
                  className={`font-body ${joinLineTextClasses[color as keyof typeof joinLineTextClasses]} w-[60%] md:w-full text-xs md:text-base text-center max-w-2xl mb-10`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  No experience needed • Free to start • Join our creative community
                </motion.div>

                {/* CTA Button */}
                <motion.button 
                  className="overflow-hidden font-subtitle group relative inline-flex items-center cursor-pointer rounded-full bg-gray-200
                  px-6 py-3 md:px-8 md:py-4 text-lg md:text-xl lg:text-2xl
                  font-semibold text-black shadow-lg transition-all duration-200
                  hover:bg-gradient-to-r hover:from-blue-400/30 hover:to-red-400/30
                  hover:shadow-xl hover:scale-105
                  active:scale-95 active:shadow
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
                  onClick={() => navigate("/signup")}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1, ease: "easeIn" }}
                >
                    <motion.span 
                      className="absolute -start-full transition-all group-hover:start-4 group-focus:start-4"
                      whileHover={{ x: 5 }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="size-6 md:size-8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                            />
                        </svg>
                    </motion.span>

                    <span className="transition-all group-hover:ms-4 group-focus:ms-4">
                        {buttonText}
                    </span>
                </motion.button>

                {/* Bottom encouragement text */}
                <motion.div 
                  className="font-body text-white/60 text-xs md:text-sm text-center mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.4 }}
                >
                  Takes less than 1 minute to get started
                </motion.div>
            </div>
        </div>
    )
}

export default LandingTitle