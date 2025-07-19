import { Link, useLocation, useNavigate } from "react-router-dom"
import logo from "/images/PenCraft_logo_light.png"
import subtitleLogo from "/images/PenCraft_subtitle_light.png"
import { useSelector } from "react-redux";
import { RootState } from "../redux/types";
import ProfileDropdown from "./ProfileDropDown";

// Main Header for all routes except /publish
const Header = () => {
  const location = useLocation();
  const user = useSelector((store: RootState) => store.auth.user);

  const renderRightContent = () => {
    if(location.pathname === "/") {
      return <SigninButton />
    } else if(location.pathname === "/signin" || location.pathname === "/signup") {
      return null
    }else if(location.pathname === "/blogs" || location.pathname === "/profile") {
      return <PenTheCraftButton />
    } else {
      return user ? <PenTheCraftButton /> : <SigninButton />;
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/20 backdrop-blur-lg shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-1">
        {/* Logo Area */}
        <div className="flex items-center space-x-3">
          <Link to={"/blogs"}>
            <img
              src={logo}
              alt="Pencraft logo"
              className="h-9 sm:h-10 md:h-12 cursor-pointer"
            />
          </Link>
          <img
            src={subtitleLogo}
            alt="Pencraft subtitle"
            className="hidden sm:block h-6 sm:h-8 md:h-10"
          />
        </div>

        {/* Right Side */}
        {renderRightContent()}
      </div>
    </header>
  )
}

export default Header;

const SigninButton = () => {
  const navigate = useNavigate();
  return (
    <div>
      <button
        type="button"
        onClick={() => {
            navigate("/signin");
          }}
        aria-label="Sign in"
        className="font-subtitle group relative inline-flex items-center rounded-full cursor-pointer bg-gray-200
                      px-4 py-1.5 sm:px-6 md:px-6 md:py-2 text-sm sm:text-base md:text-lg
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
  )
}

const PenTheCraftButton = () => {
  // const name = useSelector((store: RootState) => store.auth.name) || "User";
  
  return (
    <div className='flex items-center gap-4'>
        <Link to="/publish">
          <button
            type="button"
            aria-label="Write new blog"
            className="font-subtitle group relative inline-flex items-center cursor-pointer rounded-full bg-gray-200
                          px-4 py-2 sm:px-3 sm:py-2 md:px-5 md:py-2 text-sm sm:text-base md:text-lg
                          font-semibold text-black shadow transition-all duration-200
                          hover:bg-gradient-to-r hover:from-blue-400/30 hover:to-red-400/30
                          hover:shadow-lg hover:scale-105
                          active:scale-95 active:shadow
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" 
              className="md:inline-block size-6 lg:mr-2 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-red-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
            <span className="hidden lg:block transition-transform duration-200 group-hover:translate-x-1 group-hover:text-red-700">
              Pen the Craft
            </span>
          </button>
        </Link>
        <div className='flex items-center'>
          {/* Placeholder for user profile picture */}
          <ProfileDropdown />
          {/* <div className='pl-2 hidden lg:block text-lg font-semibold text-gray-800'>
            Hey!&nbsp;
          </div>
          <div className='text-lg font-semibold text-gray-800'>
            {name.split(" ")[0]}
          </div> */}
        </div>
    </div>
  )
}

