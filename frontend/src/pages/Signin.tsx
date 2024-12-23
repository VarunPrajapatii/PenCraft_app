import Auth from "../components/Auth";
import Quotes from "../components/Quotes";
import bg_img from "../../img/BG_homepage.webp";

const Signin = () => {
  return (
    <div>
      <img
        src={bg_img}
        alt="bg-img"
        className="-z-50 fixed top-0 left-0 w-full h-full object-cover object-center brightness-50 border-none opacity-70 blur-[2px]"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex justify-center flex-col">
          <Auth type="signin" />
        </div>
        <div className="invisible md:visible ">
          <Quotes />
        </div>
      </div>
    </div>
  );
};

export default Signin;
