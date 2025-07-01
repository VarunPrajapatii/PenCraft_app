import axios from "axios"
import { BACKEND_URL } from "../config"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux';
import { RootState } from '../redux/types';
import { Navigate } from 'react-router-dom';
import { OutputData } from '@editorjs/editorjs';
import Editor from "../components/Publish/Editor";
import { uploadBannerIfExists, uploadBlogImages } from "../utils/PublishUtils";
import logo from "/images/Pencraft_Logo.png"
import subtitleLogo from "/images/Pencraft_subtitle_logo.png"
import ProfileDropdown from "../components/ProfileDropDown";

// extend window interface for ts
declare global {
    interface Window {
        pendingBlogImages: Map<string, {
            file: File;
            blobUrl: string;
            uploaded: boolean;
        }>;
    }
}

export const Publish = () => {
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [content, setContent] = useState<OutputData | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerImageUrl, setBannerImageUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [blogId] = useState(() => crypto.randomUUID()); // Pre-generate blogId
    const [imageCount, setImageCount] = useState(0); // Track image count
    const navigate = useNavigate();
    const access_token = useSelector((store: RootState) => store.auth.access_token)

    // adding this state of editor data to make interval save logic
    const [editorData, setEditorData] = useState<OutputData | null>(null);

    // image count changes
    useEffect(() => {
        const updateImageCount = () => {
            const count = window.pendingBlogImages ? window.pendingBlogImages.size : 0;
            setImageCount(count);
        };

        // Update count initially
        updateImageCount();

        // setup periodic checking (since we can't directly observe Map changes)
        const interval = setInterval(updateImageCount, 1000);

        return () => clearInterval(interval);
    }, []);

    if(!access_token) return(<Navigate to="/signup" />)

    const handleBannerSelect = (file: File) => {
        setBannerFile(file);
        setBannerImageUrl(URL.createObjectURL(file));
    };

    const publishBlog = async (isDraft: boolean = false) => {
        if (!title.trim() || !subtitle.trim()) {
            alert("Title and subtitle are required!");
            return;
        }

        // validation for image limit
        if (window.pendingBlogImages && window.pendingBlogImages.size > 15) {
            alert("❌ Too many images! Please remove some images. Maximum allowed: 15 images per blog post.");
            return;
        }

        setIsLoading(true);
        try {
            const [bannerImageKey, updatedContent] = await Promise.all([uploadBannerIfExists({bannerFile, blogId}), uploadBlogImages({content, blogId})]);

            // Create blog with banner key
            const response = await axios.post(`${BACKEND_URL}/api/v1/blog`, {
                blogId,
                title,
                subtitle,
                content: updatedContent,
                bannerImageKey,
                published: !isDraft
            }, {
                headers: {
                    Authorization: localStorage.getItem("pencraft_token")
                }
            });

            // cleanup blob urls and pending images
            if (window.pendingBlogImages) {
                window.pendingBlogImages.forEach(image => {
                    URL.revokeObjectURL(image.blobUrl);
                });
                window.pendingBlogImages.clear();
                setImageCount(0); // Reset count
            }

            navigate(`/blog/${response.data.blogId}`);
        } catch (error) {
            console.error("Failed to save blog:", error);
            alert("Failed to save blog");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            {/* Publish Header */}
            <PublishHeader 
                isLoading={isLoading}
                onSaveDraft={() => publishBlog(true)}
                onPublish={() => publishBlog(false)}
                imageCount={imageCount}
            />
            
            {/* Main Content */}
            <div className="pt-20">
                <div className="flex justify-center w-full">
                    <div className="max-w-screen-lg w-full">
                        {/* imag uploaded count indicator */}
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-blue-700">
                                    📸 Images in blog: {imageCount}/15
                                </span>
                                {imageCount >= 12 && (
                                    <span className="text-xs text-orange-600 font-medium">
                                        {imageCount >= 15 ? "⚠️ Limit reached!" : "⚠️ Approaching limit"}
                                    </span>
                                )}
                            </div>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        imageCount >= 15 ? 'bg-red-500' : 
                                        imageCount >= 12 ? 'bg-orange-500' : 
                                        'bg-blue-500'
                                    }`}
                                    style={{ width: `${Math.min((imageCount / 15) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Banner Upload Section */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Banner Image (Optional)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        handleBannerSelect(file);
                                    }
                                }}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {bannerImageUrl && (
                                <div className="mt-2">
                                    <img 
                                        src={bannerImageUrl} 
                                        alt="Banner preview" 
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                        </div>

                        <input 
                            onChange={(e) => setTitle(e.target.value)} 
                            type="text" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4" 
                            placeholder="Title *" 
                            required
                        />
                        <input 
                            onChange={(e) => setSubtitle(e.target.value)} 
                            type="text" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4" 
                            placeholder="Subtitle *" 
                            required
                        />
                        <div className="p-8 max-w-3xl mx-auto">
                            <h1 className="text-3xl font-bold mb-4">Your Editor</h1>
                            <Editor
                                data={editorData || undefined}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange={(data: any) => {
                                  setEditorData(data)
                                  setContent(data);
                                  console.log('Editor content:', data)
                                }}
                            />
                        </div>
                        
                        {/* Publish and draft for testing */}
                        {/* <div className="mt-4 flex gap-4">
                            <button
                                onClick={() => publishBlog(true)}
                                type="button"
                                disabled={isLoading}
                                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-gray-700 bg-gray-200 rounded-lg focus:ring-4 focus:ring-gray-300 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed" 
                            >
                                {isLoading ? "Saving..." : "Save Draft"}
                            </button>
                            
                            <button
                                onClick={() => publishBlog(false)}
                                type="button"
                                disabled={isLoading}
                                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-900 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed" 
                            >
                                {isLoading ? "Publishing..." : "Publish Post"}
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

const PublishHeader = ({ 
    isLoading, 
    onSaveDraft, 
    onPublish,
    imageCount 
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
        <div className="flex items-center space-x-3">
          <Link to={"/blogs"}>
            <img
              src={logo}
              alt="Pencraft logo"
              className="h-9 sm:h-10 md:h-12"
            />
          </Link>
          <img
            src={subtitleLogo}
            alt="Pencraft subtitle"
            className="hidden sm:block h-6 sm:h-8 md:h-10"
          />
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Image Count Badge (Hidden on small screens) */}
          <div className="hidden md:flex items-center px-3 py-1 bg-blue-100 rounded-full">
            <span className="text-xs font-medium text-blue-700">
              📸 {imageCount}/15
            </span>
          </div>
          
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
                    font-semibold text-black shadow transition-all duration-200
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
                        font-semibold text-black shadow transition-all duration-200
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
