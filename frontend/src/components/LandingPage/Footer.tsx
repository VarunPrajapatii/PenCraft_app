import logo from "/images/Pencraft_Logo.png";
import subtitleLogo from "/images/Pencraft_subtitle_logo.png"


const Footer = () => {
  return (
    <footer className="absolute z-10  w-full h-[35vh] bg-[#455b78] backdrop-blur-2xl  shadow-2xl flex flex-col items-center justify-between px-8 py-8 ">
      <div className="flex w-full items-center justify-between mb-6">
        <div className="flex items-center">
          <img src={logo} alt="Pencraft Logo" className="h-[6vh] mr-4" />
          <img src={subtitleLogo} className="hidden lg:block  h-[5vh]" />
        </div>
        <div className="flex gap-4">
          <button className="group rounded-full bg-white/20 hover:bg-white/40 p-2 transition"
            onClick={() => {
              window.open("https://x.com/varunprajapat15");
            }}
          >
            <svg className="w-6 h-6 text-gray-100 group-hover:text-blue-400 transition" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.98C7.69 9.09 4.07 7.38 1.64 4.7c-.37.63-.58 1.36-.58 2.14 0 1.48.75 2.78 1.89 3.54a4.27 4.27 0 0 1-1.94-.54v.05c0 2.07 1.47 3.8 3.42 4.19-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.11 2.94 3.97 2.97A8.6 8.6 0 0 1 2 19.54a12.13 12.13 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.56A8.7 8.7 0 0 0 24 4.59a8.5 8.5 0 0 1-2.54.7z"/>
            </svg>
          </button>
          <button className="group rounded-full bg-white/20 hover:bg-white/40 p-2 transition"
            onClick={() => {
              window.open("https://portfolio.varuntd.com/");
            }}
          >
            <svg className="w-6 h-6 text-gray-100 group-hover:text-pink-400 transition" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.056 1.97.24 2.43.41.52.19.89.42 1.28.81.39.39.62.76.81 1.28.17.46.354 1.26.41 2.43.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.41 2.43-.19.52-.42.89-.81 1.28-.39.39-.76.62-1.28.81-.46.17-1.26.354-2.43.41-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.43-.41-.52-.19-.89-.42-1.28-.81-.39-.39-.62-.76-.81-1.28-.17-.46-.354-1.26-.41-2.43C2.212 15.634 2.2 15.25 2.2 12s.012-3.584.07-4.85c.056-1.17.24-1.97.41-2.43.19-.52.42-.89.81-1.28.39-.39.76-.62 1.28-.81.46-.17 1.26-.354 2.43-.41C8.416 2.212 8.8 2.2 12 2.2zm0-2.2C8.736 0 8.332.012 7.052.07c-1.28.058-2.16.25-2.91.53-.8.3-1.48.7-2.15 1.37-.67.67-1.07 1.35-1.37 2.15-.28.75-.472 1.63-.53 2.91C.012 8.332 0 8.736 0 12c0 3.264.012 3.668.07 4.948.058 1.28.25 2.16.53 2.91.3.8.7 1.48 1.37 2.15.67.67 1.35 1.07 2.15 1.37.75.28 1.63.472 2.91.53C8.332 23.988 8.736 24 12 24c3.264 0 3.668-.012 4.948-.07 1.28-.058 2.16-.25 2.91-.53.8-.3 1.48-.7 2.15-1.37.67-.67 1.07-1.35 1.37-2.15.28-.75.472-1.63.53-2.91.058-1.28.07-1.684.07-4.948 0-3.264-.012-3.668-.07-4.948-.058-1.28-.25-2.16-.53-2.91-.3-.8-.7-1.48-1.37-2.15-.67-.67-1.35-1.07-2.15-1.37-.75-.28-1.63-.472-2.91-.53C15.668.012 15.264 0 12 0z"/>
              <circle cx="12" cy="12" r="3.2"/>
            </svg>
          </button>
          <button className="group rounded-full bg-white/20 hover:bg-white/40 p-2 transition"
            onClick={() => {
              window.open("https://www.linkedin.com/in/varun-prajapati-56430aa7/");
            }}
          >
            <svg className="w-6 h-6 text-gray-100 group-hover:text-blue-600 transition" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.23 0H1.77C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.77 24h20.46C23.208 24 24 23.226 24 22.271V1.729C24 .774 23.208 0 22.23 0zM7.12 20.452H3.56V9h3.56v11.452zM5.34 7.633a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zm15.112 12.819h-3.56v-5.605c0-1.336-.025-3.057-1.865-3.057-1.867 0-2.153 1.457-2.153 2.963v5.699h-3.56V9h3.418v1.561h.049c.476-.899 1.637-1.847 3.37-1.847 3.602 0 4.267 2.37 4.267 5.455v6.283z"/>
            </svg>
          </button>
          <button
            className="group rounded-full bg-white/20 hover:bg-white/40 p-2 transition"
            onClick={() => {
              window.open("https://github.com/VarunPrajapatii");
            }}
          >
            <svg className="w-6 h-6 text-gray-100 group-hover:text-black transition" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.262.82-.582 0-.288-.01-1.05-.016-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.606-2.665-.304-5.466-1.334-5.466-5.933 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.625-5.475 5.922.43.37.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.698.825.58C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </button>
        </div>
      </div>
      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-400/30 to-transparent mb-6"></div>
      {/* Links Row */}
      <div className="flex flex-wrap justify-center gap-8 mb-4">
        <a href="#" className="text-gray-400 hover:text-white transition text-lg font-medium">About</a>
        <a href="#" className="text-gray-400 hover:text-white transition text-lg font-medium">Blog</a>
        <a href="#" className="text-gray-400 hover:text-white transition text-lg font-medium">Contact</a>
        <a href="#" className="text-gray-400 hover:text-white transition text-lg font-medium">Privacy</a>
        <a href="#" className="text-gray-400 hover:text-white transition text-lg font-medium">Terms</a>
      </div>
      {/* Bottom Row: Copyright */}
      <div className="w-full text-center text-gray-400 text-sm sm:text-lg ">
        © {new Date().getFullYear()} Pencraft. Made by 😎 <a className="hover:text-white transition" href="http://portfolio.varuntd.com" >Varun Prajapati</a>.
      </div>
    </footer>
  );
};

export default Footer;