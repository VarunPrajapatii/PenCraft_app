/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/BlogContentRenderer.tsx
import React, { useEffect, useState, type JSX } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import { OutputData } from '@editorjs/editorjs'
import { BACKEND_URL } from '../../config'
import axios from 'axios'


const renderList = (items: any[]): JSX.Element => (
  <ul className="list-disc pl-6 space-y-1">
    {items.map((item, idx) => (
      <li key={idx}>
        <span dangerouslySetInnerHTML={{ __html: item.content }} />
        {item.items && item.items.length > 0 && renderList(item.items)}
      </li>
    ))}
  </ul>
)

const renderOrderedList = (items: any[]): JSX.Element => (
  <ol className="list-decimal pl-6 space-y-1">
    {items.map((item, idx) => (
      <li key={idx}>
        <span dangerouslySetInnerHTML={{ __html: item.content }} />
        {item.items && item.items.length > 0 && renderOrderedList(item.items)}
      </li>
    ))}
  </ol>
)

// Enhanced BlogImage component with better loading states and error handling
const BlogImage = ({ data, id }: { data: any; id: string }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [imageUrl, setImageUrl] = useState<string>('');

  const s3Key = data.file.url; // This is now always an S3 key

  // Async function to fetch presigned URL
  const fetchPresignedUrl = async (key: string): Promise<string> => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/blog/images/${encodeURIComponent(key)}`,
        {
          headers: {
            Authorization: localStorage.getItem("pencraft_token")
          }
        }
      );
      
      return response.data.signedUrl;
    } catch (error) {
      console.error('Failed to fetch presigned URL:', error);
      throw new Error('Failed to get image URL');
    }
  };

  // Fetch presigned URL when component mounts or retries
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
  }, [s3Key, retryCount]); // retryCount dependency will trigger re-fetch on retry


  const handleRetry = () => {
    if (retryCount < 2) { // Allow up to 2 retries
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
        key={retryCount} // Force re-render on retry
        src={imageUrl}
        alt={data.caption || 'Blog image'}
        className={`w-full h-auto rounded-lg shadow-lg transition-all duration-300 ${
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
        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center text-gray-500 p-4">
            <div className="text-4xl mb-3">📷</div>
            <div className="text-lg font-medium mb-2">Image failed to load</div>
            <div className="text-sm text-gray-400 mb-4">
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
              <div className="text-xs text-gray-400">
                Unable to load after multiple attempts
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Caption with enhanced styling */}
      {data.caption && !error && !loading && (
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-600 italic bg-gray-50 rounded px-3 py-2 inline-block">
            {data.caption}
          </p>
        </div>
      )}
    </div>
  );
};


const BlogContentRenderer = ({ content } : {content : OutputData}) => {
  useEffect(() => {
    const container = document.getElementById('blog-content')
    if (container) {
      Prism.highlightAllUnder(container)
    }
  }, [content])

  return (
    <article
      id="blog-content"
      className="prose max-w-3xl mx-auto py-8"
    >
      {content.blocks.map((block: any) => {
        const { type, data, id } = block

        switch (type) {
          case 'header': {
            const Tag = `h${data.level}` as keyof JSX.IntrinsicElements
            const className = `font-bold mb-4 ${
              data.level === 1 ? 'text-4xl' : 
              data.level === 2 ? 'text-3xl' : 
              data.level === 3 ? 'text-2xl' : 
              data.level === 4 ? 'text-xl' : 
              data.level === 5 ? 'text-lg' : 'text-base'
            }`
            return <Tag key={id} className={className}>{data.text}</Tag>
          }

          case 'paragraph': {
            return (
              <p
                key={id}
                className="mb-4 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: data.text }}
              />
            )
          }

          case 'list': {
            return data.style === 'ordered'
              ? <div key={id}>{renderOrderedList(data.items)}</div>
              : <div key={id}>{renderList(data.items)}</div>
          }

          case 'code': {
            return (
              <div key={id} className="my-6">
                <pre className="bg-gray-900 rounded p-4 overflow-x-auto">
                  <code className="language-javascript">
                    {data.code || ''}
                  </code>
                </pre>
              </div>
            )
          }

          case 'image': {
            return <BlogImage data={data} id={id} />;
          }

          default:
            return (
              <div key={id} className="my-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800 mb-2">
                  Unsupported block type: <strong>{type}</strong>
                </p>
                <pre className="text-xs text-gray-600 overflow-x-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )
        }
      })}
    </article>
  )
}

export default BlogContentRenderer;