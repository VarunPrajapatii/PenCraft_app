import Quotes from '../components/Quotes'
import Auth from '../components/Auth'
import bg_img from "/images/BG_homepage.jpg";
import pencraft_logo from "/images/PC_logo_light.png";
import pencraft_logo_dark from "/images/PC_logo_dark.png";
import { useSelector } from "react-redux";
import { RootState } from "../redux/types";

const Signup = () => {
  const { isDarkMode } = useSelector((store: RootState) => store.darkMode);
  
  return (
    <div className="relative !text-black">
      <img
        src={isDarkMode ? pencraft_logo_dark : pencraft_logo}
        alt="Pencraft logo"
        className="cursor-pointer absolute top-5 left-5 w-15 h-15"
        onClick={() => window.location.href = '/'}
      />
      <img
          src={bg_img}
          alt="bg-img"
          className="-z-50 fixed top-0 left-0 w-screen h-screen object-cover object-center dark:brightness-[0.2] dark:opacity-70 opacity-50 brightness-70 m-0 p-0"
      />
      <div className='-z-40 fixed top-0 left-0 w-screen backdrop-blur-xs h-screen dark:bg-black/40'></div>
      <div className="fixed top-0 -z-10 h-full w-full bg-black/20"><div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(93,95,194,0.5)] opacity-50 blur-[80px]"></div></div>
      <div className="fixed top-0 -z-10 h-full w-full "><div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[170%] translate-y-[20%] rounded-full bg-[rgba(93,95,194,0.5)] opacity-50 blur-[80px]"></div></div>
      <div className='grid grid-cols-1 lg:grid-cols-2 min-h-screen'>
        <div className='flex justify-center items-center flex-col px-4 sm:px-6 lg:px-8 py-8 lg:py-0'>
          <Auth type='signup' />
        </div>
        <div className='hidden lg:flex items-center justify-center px-4 lg:px-8'>
          <Quotes />
        </div>
      </div>
    </div>
  )
}

export default Signup
