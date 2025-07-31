import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../config";
import axios from "axios";

export interface BlogImageData {
  caption?: string;
  file: {
    fileId: string;
    name: string;
    size: number;
    url: string;
  };
  stretched?: boolean;
  withBackground?: boolean;
  withBorder?: boolean;
}

const BlogImageRenderer = ({ data, id }: { data: BlogImageData; id: string }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [imageUrl, setImageUrl] = useState<string>('');

  const s3Key = data.file.url;
  const fetchPresignedUrl = async (key: string): Promise<string> => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/blog/images/${encodeURIComponent(key)}`, {
          withCredentials: true,
        });
      return response.data.signedUrl;
    } catch (error) {
      console.error('Failed to fetch presigned URL:', error);
      throw new Error('Failed to get image URL');
    }
  };

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);
        setError(false);
        
        const presignedUrl = await fetchPresignedUrl(s3Key);
        setImageUrl(presignedUrl);
      } catch (err) {
        console.error('Failed to load image:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (s3Key) {
      loadImage();
    }
  }, [s3Key, retryCount]);


  const handleRetry = () => {
    if (retryCount < 2) {
      setError(false);
      setLoading(true);
      setRetryCount(prev => prev + 1);
    }
  };

  return (
    <div key={id} className="my-6">
      {/* Loading skeleton */}
      {loading && !error && (
        <div className="w-full h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-lg">
          <div className="flex items-center justify-center h-full">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Actual image - only render when we have the presigned URL */}
      <img 
        key={retryCount}
        src={imageUrl}
        alt={data.caption || 'Blog image'}
        className={`w-full h-auto rounded-lg shadow-lg transition-all duration-300 dark:brightness-75 ${
          loading ? 'opacity-0 absolute' : 'opacity-100'
        } ${error ? 'hidden' : ''}`}
        loading="lazy"
        onLoad={() => {
          setLoading(false);
          setError(false);
        }}
        onError={() => {
          console.error('Failed to load image:', imageUrl, 'Retry count:', retryCount);
          setError(true);
          setLoading(false);
        }}
      />
      
      {/* Enhanced error state with retry option */}
      {error && (
        <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div className="text-center text-gray-500 dark:text-gray-400 p-4">
            <div className="text-4xl mb-3">📷</div>
            <div className="text-lg font-medium mb-2">Image failed to load</div>
            <div className="text-sm text-gray-400 dark:text-gray-500 mb-4">
              {retryCount > 0 ? `Attempt ${retryCount + 1} failed` : 'Network or server error'}
            </div>
            {retryCount < 2 && (
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
              >
                Try Again ({2 - retryCount} attempts left)
              </button>
            )}
            {retryCount >= 2 && (
              <div className="text-xs text-gray-400 dark:text-gray-500">
                Unable to load after multiple attempts
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Caption with enhanced styling */}
      {data.caption && !error && !loading && (
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300 italic bg-gray-50 dark:bg-gray-800/50 rounded px-3 py-2 inline-block">
            {data.caption}
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogImageRenderer;