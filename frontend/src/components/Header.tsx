import { useNavigate } from "react-router-dom"
import logo from "/images/Pencraft_Logo.png"
import subtitleLogo from "/images/Pencraft_subtitle_logo.png"

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/20 backdrop-blur-lg shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2">
        {/* Logo Area */}
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="Pencraft logo"
            className="h-9 sm:h-10 md:h-12"
          />
          <img
            src={subtitleLogo}
            alt="Pencraft subtitle"
            className="hidden sm:block h-6 sm:h-8 md:h-10"
          />
        </div>

        {/* Sign In */}
        <button
          type="button"
          onClick={() => {
            navigate("/signin");
          }}
          aria-label="Sign in"
          className="group relative inline-flex items-center rounded-full bg-gray-200
                     px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3 text-sm sm:text-base md:text-lg
                     font-semibold text-black shadow transition-all duration-200
                     hover:bg-gradient-to-r hover:from-blue-400/30 hover:to-red-400/30
                     hover:shadow-lg hover:scale-105
                     active:scale-95 active:shadow
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
        >
          <span className="transition-transform duration-200 group-hover:translate-x-1 group-hover:text-red-700">
            Sign In
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="hidden md:inline-block h-5 w-5 ml-2 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-red-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12l7.5-7.5M3 12h18"
            />
          </svg>
        </button>
      </div>
    </header>
  )
}

export default Header