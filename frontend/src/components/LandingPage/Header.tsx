import { useNavigate } from "react-router-dom"
import logo from "../../../images/Pencraft_Logo.png"
import title_logo from "../../../images/Pencraft_subtitle_logo.png"

const Header = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div
        className="fixed z-50 flex items-center justify-between min-w-full rounded-4xl  
        backdrop-blur-md bg-gradient-to-br from-white/20 to-white/1 shadow-2xl lg:shadow-lg  
        mx-0 my-1 pl-3 py-2 sm:py-0">
        <div className="lg:flex ">
          <img src={logo} className="h-[5vh] sm:h-[9vh] ml-[1vw] sm:my-[1vh]" />
          <div className="flex items-center ">
            <div className="mx-4 h-[3vh] w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent opacity-70 hidden lg:block"></div>
            <img src={title_logo} className=" h-[4.3vh] sm:h-[4vh] lg:h-[5.5vh]" />
          </div>
        </div>
        <button
          className="group relative inline-flex items-center overflow-hidden rounded-3xl sm:rounded-xl 
          bg-gray-300 text-black sm:font-semibold text-sm md:text-2xl lg:text-xl 
          sm:px-8 md:px-12 py-2 md:py-8 lg:py-2 mr-[3vw] 
          transition-all duration-150 hover:bg-gray-300 active:bg-gray-400 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          onClick={() => {
            navigate("/signin");
          }}
        >
          <span className="font-semibold transition-all group-hover:me-4">Sign In</span>
          <span className="absolute hidden md:block -end-full transition-all group-hover:end-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5"
            >
              <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </span>
        </button>
      </div>
    </div>
  )
}

export default Header