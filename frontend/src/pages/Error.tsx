import { Link } from "react-router-dom";

export default function Error() {

  return (
    <div className=''>
      <div className="fixed inset-0 -z-10">
        <img src='/images/404_light.jpeg' alt='404' className="w-full h-full object-cover blur-sm brightness-75" />
      </div>
      <div className="absolute top-[85%] left-1/2 transform -translate-x-1/2 text-center text-white text-2xl z-10">
        The page you are looking for does not exist. Head back to the 
        <Link to="/" className="text-black underline">
          home
        </Link>{" "} 
        page and explore blogs :)
      </div>
    </div>
  )
}
