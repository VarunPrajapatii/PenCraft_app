import axios from "axios"
import { BACKEND_URL } from "../config"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/types';
import { Navigate } from 'react-router-dom';
import { OutputData } from '@editorjs/editorjs';
import Editor from "../components/Publish/Editor";
import { convertS3ImagesToBlobs, uploadBannerIfExists, uploadBlogImages } from "../utils/PublishUtils";
import PublishHeader from "../components/Publish/PublishHeader";
import { clearDraftData } from "../redux/slice/draftSlice";

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
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false); // Add this state
  const user = useSelector((store: RootState) => store.auth.user)
  const { blogId: draftBlogId } = useParams();
  const draftData = useSelector((store: RootState) => store.draftPostEdit);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Load draft data when component mounts
  useEffect(() => {
    const loadDraftData = async () => {
      if (draftData && draftData.isEditingDraft && draftData.editingBlogId === draftBlogId) {
        setIsLoadingDraft(true);
        console.log("Draft Data came from store:", draftData);        
        setTitle(draftData.title);
        setSubtitle(draftData.subtitle);
        setBannerImageUrl(draftData.bannerImageUrl);
        setIsEditingDraft(draftData.isEditingDraft);

        try {
          const convertedContent = await convertS3ImagesToBlobs(draftData.content);
          setContent(convertedContent);
          
          const count = convertedContent?.blocks.reduce((acc, block) => {
            if (block.type === 'image' && block.data.file) {
              return acc + 1;
            }
            return acc;
          }, 0) || 0;
          setImageCount(count);
        } catch (error) {
          console.error('Failed to convert draft images:', error);
          setContent(draftData.content);
        } finally {
          setIsLoadingDraft(false);
        }
      }
    };

    loadDraftData();
  }, [draftData, draftBlogId]);
  // Clear draft data when component unmounts
  useEffect(() => {
    return () => {
      if (isEditingDraft) {
        dispatch(clearDraftData());
      }
    };
  }, [isEditingDraft, dispatch]);



  // image count changes
  useEffect(() => {
    const updateImageCount = () => {
      const count = imageCount + (window.pendingBlogImages ? window.pendingBlogImages.size : 0);
      setImageCount(count);
    };

    // Update count initially
    updateImageCount();

    // setup periodic checking (since we can't directly observe Map changes)
    const interval = setInterval(updateImageCount, 1000);

    return () => clearInterval(interval);
  }, []);

  // Warn user before leaving the page if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; // Required for Chrome to show alert
    };

    if(title.trim() || subtitle.trim() || (content && content.blocks.length > 0) || bannerFile) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [content, title, subtitle, bannerFile]);

  const handleBannerSelect = (file: File) => {
    setBannerFile(file);
    setBannerImageUrl(URL.createObjectURL(file));
  };

  const publishBlog = async (isDraft: boolean = false) => {
    if (!title.trim() || title.trim().length <= 10) {
      alert("Title must be of minimum 10 characters!");
      return;
    } else if(!subtitle.trim()) {
      alert("Subtitle required!");
      return;
    } else if(subtitle.trim().length <= 10) {
      alert("Subtitle must be of minimum 10 characters!");
      return;
    } else if(content?.blocks.length === 0) {
      alert("Content required!");
      return;
    }

    // validation for image limit
    if (window.pendingBlogImages && window.pendingBlogImages.size > 15) {
      alert("❌ Too many images! Please remove some images. Maximum allowed: 15 images per blog post.");
      return;
    }

    setIsLoading(true);
    try {
      const [bannerImageKey, updatedContent] = await Promise.all([uploadBannerIfExists({ bannerFile, blogId }), uploadBlogImages({ content, blogId })]);

      // Create blog with banner key
      const response = await axios.post(`${BACKEND_URL}/api/v1/blog`, {
        blogId,
        title,
        subtitle,
        content: updatedContent,
        bannerImageKey,
        published: !isDraft
      }, {
        withCredentials: true,
      });

      // cleanup blob urls and pending images
      if (window.pendingBlogImages) {
        window.pendingBlogImages.forEach(image => {
          URL.revokeObjectURL(image.blobUrl);
        });
        window.pendingBlogImages.clear();
        setImageCount(0); // Reset count
      }
      
      // Clear draft data from store
      if (isEditingDraft) {
        dispatch(clearDraftData());
      }

      navigate(`/blog/${response.data.blogId}`);
    } catch (error) {
      console.error("Failed to save blog:", error);
      alert("Failed to save blog");
    } finally {
      setIsLoading(false);
    }
  }

  if (!user) return (<Navigate to="/signin" />)

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
      <div className="pt-20 bg-gray-400/20 dark:bg-gradient-to-br dark:from-black/90 dark:to-gray-950/80  ">
        <div className="flex w-full justify-center lg:justify-center lg:items-center">
          <div className="mt-15 lg:mt-0 max-w-screen-md w-full flex flex-col items-center text-center lg:text-left">
            {/* Editing indicator */}
            {isEditingDraft && (
              <div className=" mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg w-full max-w-2xl">
                <p className="font-body text-sm text-blue-700 dark:text-blue-300 font-medium">
                  ✏️ You are editing a draft
                </p>
              </div>
            )}
            {/* Warning message for unsaved changes */}
            {(title.trim() || subtitle.trim() || (content && content.blocks.length > 0) || bannerFile) && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg w-full max-w-2xl">
                <p className="font-body text-sm text-red-700 dark:text-red-300 font-medium">
                  ⚠️ Warning: If you change page or press back button or close the tab then all the images of this blog will be deleted. Save your blog as draft to prevent this.
                </p>
              </div>
            )}
            {/* image uploaded count indicator */}
            <div className="lg:hidden mb-4 p-3 w-full max-w-2xl mx-auto fixed top-16 left-1/2 transform -translate-x-1/2 z-50">
              <div className="flex items-center justify-between">
                <span className="font-body text-xs font-medium text-blue-700 dark:text-blue-300">
                  📸 Images in blog: {imageCount}/15
                </span>
                {imageCount >= 12 && (
                  <span className="font-body text-xs text-orange-600 dark:text-orange-400 font-medium">
                    {imageCount >= 15 ? "⚠️ Limit reached!" : "⚠️ Approaching limit"}
                  </span>
                )}
              </div>
              <div className="mt-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${imageCount >= 15 ? 'bg-red-500' :
                    imageCount >= 12 ? 'bg-orange-500' :
                      'bg-blue-500'
                    }`}
                  style={{ width: `${Math.min((imageCount / 15) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            {/* Banner Upload Section */}
            <div className="mb-4 my-2 mt-10 mx-5 w-full max-w-2xl ">
              <label className="font-body block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">Banner Image (Optional)</label>
              <input 
                type="file"
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleBannerSelect(file);
                }}
                className="font-body block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-800/40"
              />
              {bannerImageUrl && (
              <div className="mt-2 w-full flex justify-center">
                <img
                src={bannerImageUrl}
                alt="Banner preview"
                className="w-full h-48 object-cover rounded-lg max-w-xl"
                />
              </div>
              )}
            </div>
            {/* Title and Subtitle */}
            <div className="w-full max-w-2xl mx-auto mb-6">
              <input
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                className="font-title w-full pt-2.5 mb-4 pl-3 lg:pl-0 text-3xl font-semibold sm:text-4xl md:text-5xl text-center lg:text-left
                  bg-transparent border-none outline-none cursor-pointer text-gray-800 dark:text-gray-100
                  focus:ring-0 focus:border-none focus:outline-none focus:cursor-text focus:placeholder:text-gray-300 dark:focus:placeholder:text-gray-600
                  caret-black dark:caret-white"
                placeholder="Title of the blog *"
                required
                value={title}
                style={{
                  boxShadow: "none",
                  caretColor: "inherit",
                }}
                autoFocus
                spellCheck={true}
              />
              <input
                onChange={(e) => setSubtitle(e.target.value)}
                type="text"
                className="font-subtitle w-full pb-2.5 mb-4  pl-3 lg:pl-0  text-base  sm:text-lg md:text-xl text-center lg:text-left
                  bg-transparent border-none outline-none cursor-pointer text-gray-800 dark:text-gray-100
                  focus:ring-0 focus:border-none focus:outline-none focus:cursor-text focus:placeholder:text-gray-300 dark:focus:placeholder:text-gray-600
                  caret-black dark:caret-white"
                placeholder="Subtitle of the blog *"
                required
                value={subtitle}
                style={{
                  boxShadow: "none",
                  caretColor: "inherit",
                }}
                spellCheck={true}
              />
            </div>
            {/* Conditionally render the Editor */}
            {!isLoadingDraft && (
              <div className="mx-auto w-full max-w-3xl">
                <Editor
                  key={isEditingDraft ? `edit-${draftBlogId}` : 'new'}
                  contentData={content || undefined}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  changeInEditor={(data: any) => {
                    setContent(data);
                    console.log('Editor content:', data)
                  }}
                />
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  )
}