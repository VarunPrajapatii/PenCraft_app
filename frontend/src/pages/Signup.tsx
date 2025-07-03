import Quotes from '../components/Quotes'
import Auth from '../components/Auth'
import bg_img from "/images/BG_homepage.webp";
import pencraft_logo from "/images/PC_logo_light.png";

const Signup = () => {
  return (
    <div className="relative">
      <img
        src={pencraft_logo}
        alt="Pencraft logo"
        className="cursor-pointer absolute top-5 left-5 w-15 h-15"
        onClick={() => window.location.href = '/'}
      />
      <img
        src={bg_img}
        alt="bg-img"
        className="-z-50 fixed top-0 left-0 w-full h-full object-cover object-center brightness-50 border-none opacity-70 blur-[2px]"
      />
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
