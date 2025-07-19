import { Link } from "react-router-dom";
import ProfileDropdown from "../ProfileDropDown";
import logo from "/images/PenCraft_logo_light.png"

const PublishHeader = ({
  isLoading,
  onSaveDraft,
  onPublish,
  imageCount,
}: {
  isLoading: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
  imageCount: number;
}) => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/20 backdrop-blur-lg shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2">
        {/* Logo Area */}
        <div className=" flex items-center space-x-3">
          <Link to={"/blogs"}>
            <img
              src={logo}
              alt="Pencraft logo"
              className="mr-10 h-9 sm:h-10 md:h-12"
            />
          </Link>
          {/* image uploaded count indicator */}
            <div className="hidden lg:block w-full min-w-xl mx-auto ">
              <div className="flex items-center justify-between">
                <span className="font-body text-sm font-medium text-blue-700">
                    <span className="inline-flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                        </svg>
                        <span className="ml-1.5">Images in blog: {imageCount}/15</span>
                    </span> 
                </span>
                {imageCount >= 12 && (
                  <span className="font-body text-xs text-orange-600 font-medium">
                    {imageCount >= 15 ? "⚠️ Limit reached!" : "⚠️ Approaching limit"}
                  </span>
                )}
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${imageCount >= 15 ? 'bg-red-500' :
                    imageCount >= 12 ? 'bg-orange-500' :
                      'bg-blue-500'
                    }`}
                  style={{ width: `${Math.min((imageCount / 15) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <SaveDraftButton
            DraftLoading={isLoading}
            onClick={onSaveDraft}
          />
          <PublishButton
            PublishLoading={isLoading}
            onClick={onPublish}
          />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  )
}

export default PublishHeader;



const SaveDraftButton = ({
  DraftLoading = false,
  onClick
}: {
  DraftLoading?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      type="button"
      aria-label="Save Draft"
      disabled={DraftLoading}
      onClick={onClick}
      className={`group relative inline-flex items-center rounded-full bg-gray-200
                    px-4 py-2 sm:px-3 sm:py-2 md:px-5 md:py-2 text-sm sm:text-base md:text-lg
                    font-semibold text-black shadow transition-all duration-200 cursor-pointer
                    hover:bg-gradient-to-r hover:from-blue-400/30 hover:to-red-400/30
                    hover:shadow-lg hover:scale-105
                    active:scale-95 active:shadow
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400
                    ${DraftLoading ? "opacity-60 cursor-not-allowed" : ""}
                  `}
    >
      {DraftLoading ? (
        <svg className="animate-spin h-5 w-5 text-red-500 mr-0 lg:mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
          className="md:inline-block size-6 lg:mr-2 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-red-700">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      )}
      <span className={`hidden lg:block transition-transform duration-200 group-hover:translate-x-1 group-hover:text-red-700`}>
        {DraftLoading ? "Saving..." : "Save Draft"}
      </span>
    </button>
  )
}

const PublishButton = ({
  PublishLoading = false,
  onClick
}: {
  PublishLoading?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      type="button"
      aria-label="Publish"
      disabled={PublishLoading}
      onClick={onClick}
      className={`group relative inline-flex items-center rounded-full bg-green-200
                        px-4 py-2 sm:px-3 sm:py-2 md:px-5 md:py-2 text-sm sm:text-base md:text-lg
                        font-semibold text-black shadow transition-all duration-200 cursor-pointer
                        hover:bg-gradient-to-r hover:from-green-400/30 hover:to-blue-400/30
                        hover:shadow-lg hover:scale-105
                        active:scale-95 active:shadow
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400
                        ${PublishLoading ? "opacity-60 cursor-not-allowed" : ""}
                      `}
    >
      {PublishLoading ? (
        <svg className="animate-spin h-5 w-5 text-green-600 mr-0 lg:mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
          className="md:inline-block size-6 lg:mr-2 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-green-700">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
        </svg>
      )}
      <span className={`hidden lg:block transition-transform duration-200 group-hover:translate-x-1 group_hover:text-green-700`}>
        {PublishLoading ? "Publishing..." : "Publish"}
      </span>
    </button>
  )
}
