import { AppBar } from "../components/AppBar"
import { Avatar } from "../components/BlogCard"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandsClapping } from '@fortawesome/free-solid-svg-icons'
import { faComment } from '@fortawesome/free-solid-svg-icons'

const clapIcon = <FontAwesomeIcon icon={faHandsClapping} />
const commentIcon = <FontAwesomeIcon icon={faComment} />

export const FullBlog = () => {
    const blog = {
        title: "The Wonders of Modern Web Development",
        content: `
            Web development has come a long way since the early days of the internet. In the past, building a website required a deep understanding of HTML, CSS, and basic JavaScript. Today, however, the tools and technologies available to developers are far more advanced, making it easier to create complex and interactive websites.

            One of the most significant advances in web development has been the rise of JavaScript frameworks like React, Angular, and Vue.js. These frameworks allow developers to build scalable and maintainable applications with less code and improved performance. React, in particular, has gained immense popularity due to its component-based architecture and the virtual DOM, which optimizes rendering performance.

            Another important development in modern web development is the growth of CSS preprocessors like Sass and Less. These tools offer advanced features like variables, mixins, and nesting, which make writing CSS more efficient and maintainable. Additionally, the use of CSS Grid and Flexbox has revolutionized the way we design layouts, offering greater flexibility and responsiveness across devices.

            On the backend side, Node.js has become a go-to choice for building scalable web applications. With its non-blocking, event-driven architecture, Node.js allows developers to handle a large number of simultaneous connections with minimal overhead. Coupled with databases like MongoDB or PostgreSQL, developers can create full-stack applications that are both powerful and efficient.

            As web development continues to evolve, we are also seeing a growing emphasis on accessibility and inclusivity. Ensuring that websites are accessible to all users, regardless of their abilities, has become a critical part of the development process. From semantic HTML to ARIA roles and keyboard navigation, modern web developers are learning how to create websites that are usable by everyone.

            In conclusion, modern web development offers a wealth of tools and technologies that allow developers to create powerful, user-friendly, and accessible websites. As the web continues to grow and evolve, developers must stay up to date with the latest trends and best practices to ensure they are building the best possible experiences for their users.
        `,
        author: {
            name: "John Doe"
        }
    }


    return (
        <div>
            <div className="flex justify-center">
                <div className="grid grid-cols-12 px-10 w-full pt-200 max-w-screen-xl pt-12">
                    <div className="col-span-8">
                        <div className="text-5xl font-extrabold">
                            {blog.title}
                        </div>
                        <div className="flex justify-between mb-2">
                            <div className="text-slate-500 pt-2">
                                Post on 6 May 2023
                            </div>
                            <div className="text-slate-500 pt-2 pr-96">
                                2 min read
                            </div>
                        </div>
                        <div className="flex text-xl border py-1 border-x-0 gap-20 w-full items-center font-medium text-gray-500">
                            <div className="hover:text-black hover:cursor-pointer">
                                {clapIcon} <span className="text-lg items-center">25</span>
                            </div>
                            <div className="hover:text-black hover:cursor-pointer">
                                {commentIcon} <span className="text-lg items-center">40</span>
                            </div>
                        </div>
                        <div className="pt-8 text-2xl ">
                            {blog.content}
                        </div>
                    </div>
                    <div className="col-span-4 pl-12">
                    <div className="text-slate-600 text-lg pb-5">
                        Written By -
                    </div>
                    <div className="flex w-full items-center">
                        <div className="pr-4 flex flex-col justify-center">
                            <Avatar size="big" name={blog.author.name || "Anonymous"} />
                        </div>
                        <div>
                            <div className="flex ">
                                <div className="text-2xl font-bold">
                                    {blog.author.name || "Anonymous    "}
                                </div>
                                <span className="px-3">
                                    {"."}
                                </span>
                                <div className="text-lg pt-1 text-gray-500 hover:text-black hover:cursor-pointer">
                                    Unfollow
                                </div>

                            </div>
                            <div className="pt-2 text-slate-700">
                                Random catch phrase about the author's ability to grab the user's attention
                            </div>
                        </div>
                    </div>
                    </div>
                </div>

            </div>
        </div>
    )
}