import logo from "../../../images/Pencraft_Logo.png"
import title_logo from "../../../images/Pencraft_subtitle_logo.png"

const Header = () => {
  return (
    <div><div className="fixed backdrop-blur-2xl rounded-4xl z-20 flex items-center justify-between my-3 py-2  min-w-full">
      <div className="flex items-center">
        <img src={logo} className=" h-[7vh] ml-[1vw]" />
        <div className="flex items-center">
          <div className="mx-4 h-[3vh] w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent opacity-70"></div>
          <img src={title_logo} className=" h-[5vh]" />
        </div>

      </div>
      <button className="group relative inline-flex items-center overflow-hidden rounded-xl bg-[#F1F1F1] hover:bg-gray-300 text-black text-xl font-semibold px-10 py-2 mr-[3vw] active:bg-gray-400 active:scale-95
  focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
  transition-all duration-150">
        <span className="text-xl font-semibold transition-all  group-hover:me-4">
          Sign In
        </span>
        <span className="absolute -end-full transition-all group-hover:end-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />



          </svg>
        </span>
      </button>
    </div></div>
  )
}

export default Header