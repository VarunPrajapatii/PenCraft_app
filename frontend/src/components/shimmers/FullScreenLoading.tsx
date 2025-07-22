import bg_img from "/images/BG_homepage.jpg";

const FullScreenLoading = () => {
  return (
    <div>
      <div className='flex space-x-2 justify-center items-center  h-screen'>
        <img
          src={bg_img}
          alt="bg-img"
          className="-z-50 fixed top-0 left-0 w-screen h-screen object-cover object-center brightness-100 opacity-30  m-0 p-0"
        />
        <div className='-z-40 fixed top-0 left-0 w-screen backdrop-blur-xs h-screen'></div>
        <span className='sr-only'>Loading...</span>
        <div className='h-12 w-12 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
        <div className='h-12 w-12 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
        <div className='h-12 w-12 bg-black rounded-full animate-bounce'></div>
      </div>
    </div>
  )
}

export default FullScreenLoading