/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/BlogContentRenderer.tsx
import { useEffect, type JSX } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import { OutputData } from '@editorjs/editorjs'
import BlogImageRenderer from './BlogImageRenderer'


const renderList = (items: any[]): JSX.Element => (
  <ul className="list-disc pl-6 space-y-1 font-body">
    {items.map((item, idx) => (
      <li key={item.id || item.content || idx}>
        <span dangerouslySetInnerHTML={{ __html: item.content }} />
        {item.items && item.items.length > 0 && renderList(item.items)}
      </li>
    ))}
  </ul>
)

const renderOrderedList = (items: any[]): JSX.Element => (
  <ol className="list-decimal pl-6 space-y-1 font-body">
    {items.map((item, idx) => (
      <li key={item.id || item.content || idx}>
        <span dangerouslySetInnerHTML={{ __html: item.content }} />
        {item.items && item.items.length > 0 && renderOrderedList(item.items)}
      </li>
    ))}
  </ol>
)

const BlogContentRenderer = ({ content } : {content : OutputData}) => {
  console.log("Content Rendered:", content)
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
            const className = `font-title font-bold mb-4 ${
              data.level === 1 ? 'text-3xl lg:text-4xl ' : 
              data.level === 2 ? 'text-2xl lg:text-3xl' : 
              data.level === 3 ? 'text-xl lg:text-2xl' : 
              'text-base'
            }`
            return <Tag key={id} className={className}>{data.text}</Tag>
          }

          case 'paragraph': {
            return (
              <p
                key={id}
                className="font-body mb-4 leading-relaxed text-lg"
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

          case 'quote': {
            const alignment = data.alignment || 'left';
            return (
              <figure key={id} className={`my-8 flex flex-col items-${alignment} w-full`}>
                <blockquote
                  className={`font-quote relative px-6 py-4 bg-gray-50 border-l-4 border-blue-400 rounded-md shadow-sm text-lg sm:text-xl md:text-2xl italic text-gray-800 text-${alignment}`}
                  style={{
                    marginLeft: alignment === 'left' ? 0 : 'auto',
                    marginRight: alignment === 'right' ? 0 : 'auto',
                  }}
                >
                  <span className="block">{data.text}</span>
                </blockquote>
                {data.caption && (
                  <figcaption className="font-body mt-2 text-sm text-gray-500 text-left pl-2">{data.caption}</figcaption>
                )}
              </figure>
            );
          }

          case 'image': {
            return <BlogImageRenderer data={data} id={id} />;
          }

          default:
            return (
              <div key={id}>
                <p>
                  Unsupported block type: <strong>{type}</strong>
                </p>
                <pre>
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