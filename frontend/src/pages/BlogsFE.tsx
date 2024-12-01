// import React from 'react'
import { BlogCard } from '../components/BlogCard'
import { AppBar } from '../components/AppBar'
import { BlogShimmer } from '../components/BlogShimmer'
import HomeExtras from '../components/HomeExtras'

export const blogs = [
    {
        id: 1,
        author: "varun",
        title: "Hi it a blog there, made hardcoded for testing",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic quaerat, earum quibusdam neque doloremque voluptatibus architecto fugit blanditiis. Voluptas porro voluptatem consequuntur, nam dolore inventore non reiciendis perspiciatis praesentium? Error Accusamus, laborum dolor. Quibusdam, mollitia neque atque accusamus totam quas minima doloremque pariatur eligendi rerum molestias provident dolorum dolores, vitae eum. Iste dignissimos maiores a labore eius aspernatur perferendis tenetur. Nihil ullam minus laborum aut culpa possimus non voluptatibus nam? Pariatur dicta amet ab perspiciatis molestiae a, mollitia consequuntur quas! Quas qui necessitatibus iusto voluptatibus ut neque officia facere maiores? Pariatur distinctio aliquid recusandae. Fugit, exercitationem dolorum non reiciendis molestiae labore sed iste ipsum dignissimos voluptate optio sunt culpa officia ab assumenda numquam! Id error exercitationem soluta delectus. Unde, eaque! Eos officiis saepe dignissimos enim ipsa consequatur nesciunt expedita modi iure, nulla mollitia ducimus hic beatae eum dolor assumenda maiores amet soluta voluptates earum asperiores inventore blanditiis, vel culpa. Rerum.",

    },
    {
        id: 2,
        author: "swechha",
        title: "I have danced with a guy in a function, i remember him!!",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic quaerat, earum quibusdam neque doloremque voluptatibus architecto fugit blanditiis. Voluptas porro voluptatem consequuntur, nam dolore inventore non reiciendis perspiciatis praesentium? Error Accusamus, laborum dolor. Quibusdam, mollitia neque atque accusamus totam quas minima doloremque pariatur eligendi rerum molestias provident dolorum dolores, vitae eum. Iste dignissimos maiores a labore eius aspernatur perferendis tenetur. Nihil ullam minus laborum aut culpa possimus non voluptatibus nam? Pariatur dicta amet ab perspiciatis molestiae a, mollitia consequuntur quas! Quas qui necessitatibus iusto voluptatibus ut neque officia facere maiores? Pariatur distinctio aliquid recusandae. Fugit, exercitationem dolorum non reiciendis molestiae labore sed iste ipsum dignissimos voluptate optio sunt culpa officia ab assumenda numquam! Id error exercitationem soluta delectus. Unde, eaque! Eos officiis saepe dignissimos enim ipsa consequatur nesciunt expedita modi iure, nulla mollitia ducimus hic beatae eum dolor assumenda maiores amet soluta voluptates earum asperiores inventore blanditiis, vel culpa. Rerum.",

    },
    {
        id: 3,
        author: "shreya",
        title: "I hope i knew there is a fan like you somewhere in the world, i would be so happy",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic quaerat, earum quibusdam neque doloremque voluptatibus architecto fugit blanditiis. Voluptas porro voluptatem consequuntur, nam dolore inventore non reiciendis perspiciatis praesentium? Error Accusamus, laborum dolor. Quibusdam, mollitia neque atque accusamus totam quas minima doloremque pariatur eligendi rerum molestias provident dolorum dolores, vitae eum. Iste dignissimos maiores a labore eius aspernatur perferendis tenetur. Nihil ullam minus laborum aut culpa possimus non voluptatibus nam? Pariatur dicta amet ab perspiciatis molestiae a, mollitia consequuntur quas! Quas qui necessitatibus iusto voluptatibus ut neque officia facere maiores? Pariatur distinctio aliquid recusandae. Fugit, exercitationem dolorum non reiciendis molestiae labore sed iste ipsum dignissimos voluptate optio sunt culpa officia ab assumenda numquam! Id error exercitationem soluta delectus. Unde, eaque! Eos officiis saepe dignissimos enim ipsa consequatur nesciunt expedita modi iure, nulla mollitia ducimus hic beatae eum dolor assumenda maiores amet soluta voluptates earum asperiores inventore blanditiis, vel culpa. Rerum.",

    },
    {
        id: 4,
        author: "prince",
        title: "I work as a govt official at iocl.",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic quaerat, earum quibusdam neque doloremque voluptatibus architecto fugit blanditiis. Voluptas porro voluptatem consequuntur, nam dolore inventore non reiciendis perspiciatis praesentium? Error Accusamus, laborum dolor. Quibusdam, mollitia neque atque accusamus totam quas minima doloremque pariatur eligendi rerum molestias provident dolorum dolores, vitae eum. Iste dignissimos maiores a labore eius aspernatur perferendis tenetur. Nihil ullam minus laborum aut culpa possimus non voluptatibus nam? Pariatur dicta amet ab perspiciatis molestiae a, mollitia consequuntur quas! Quas qui necessitatibus iusto voluptatibus ut neque officia facere maiores? Pariatur distinctio aliquid recusandae. Fugit, exercitationem dolorum non reiciendis molestiae labore sed iste ipsum dignissimos voluptate optio sunt culpa officia ab assumenda numquam! Id error exercitationem soluta delectus. Unde, eaque! Eos officiis saepe dignissimos enim ipsa consequatur nesciunt expedita modi iure, nulla mollitia ducimus hic beatae eum dolor assumenda maiores amet soluta voluptates earum asperiores inventore blanditiis, vel culpa. Rerum.",

    },
    {
        id: 5,
        author: "shreyash",
        title: "I need to fix a lot of things about me",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic quaerat, earum quibusdam neque doloremque voluptatibus architecto fugit blanditiis. Voluptas porro voluptatem consequuntur, nam dolore inventore non reiciendis perspiciatis praesentium? Error Accusamus, laborum dolor. Quibusdam, mollitia neque atque accusamus totam quas minima doloremque pariatur eligendi rerum molestias provident dolorum dolores, vitae eum. Iste dignissimos maiores a labore eius aspernatur perferendis tenetur. Nihil ullam minus laborum aut culpa possimus non voluptatibus nam? Pariatur dicta amet ab perspiciatis molestiae a, mollitia consequuntur quas! Quas qui necessitatibus iusto voluptatibus ut neque officia facere maiores? Pariatur distinctio aliquid recusandae. Fugit, exercitationem dolorum non reiciendis molestiae labore sed iste ipsum dignissimos voluptate optio sunt culpa officia ab assumenda numquam! Id error exercitationem soluta delectus. Unde, eaque! Eos officiis saepe dignissimos enim ipsa consequatur nesciunt expedita modi iure, nulla mollitia ducimus hic beatae eum dolor assumenda maiores amet soluta voluptates earum asperiores inventore blanditiis, vel culpa. Rerum.",

    },
    {
        id: 6,
        author: "soumya",
        title: "i think i must lose some weight, that way i will look so hot",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic quaerat, earum quibusdam neque doloremque voluptatibus architecto fugit blanditiis. Voluptas porro voluptatem consequuntur, nam dolore inventore non reiciendis perspiciatis praesentium? Error Accusamus, laborum dolor. Quibusdam, mollitia neque atque accusamus totam quas minima doloremque pariatur eligendi rerum molestias provident dolorum dolores, vitae eum. Iste dignissimos maiores a labore eius aspernatur perferendis tenetur. Nihil ullam minus laborum aut culpa possimus non voluptatibus nam? Pariatur dicta amet ab perspiciatis molestiae a, mollitia consequuntur quas! Quas qui necessitatibus iusto voluptatibus ut neque officia facere maiores? Pariatur distinctio aliquid recusandae. Fugit, exercitationem dolorum non reiciendis molestiae labore sed iste ipsum dignissimos voluptate optio sunt culpa officia ab assumenda numquam! Id error exercitationem soluta delectus. Unde, eaque! Eos officiis saepe dignissimos enim ipsa consequatur nesciunt expedita modi iure, nulla mollitia ducimus hic beatae eum dolor assumenda maiores amet soluta voluptates earum asperiores inventore blanditiis, vel culpa. Rerum.",

    },
    {
        id: 7,
        author: "varun",
        title: "Hi it a blog there, made hardcoded for testing",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic quaerat, earum quibusdam neque doloremque voluptatibus architecto fugit blanditiis. Voluptas porro voluptatem consequuntur, nam dolore inventore non reiciendis perspiciatis praesentium? Error Accusamus, laborum dolor. Quibusdam, mollitia neque atque accusamus totam quas minima doloremque pariatur eligendi rerum molestias provident dolorum dolores, vitae eum. Iste dignissimos maiores a labore eius aspernatur perferendis tenetur. Nihil ullam minus laborum aut culpa possimus non voluptatibus nam? Pariatur dicta amet ab perspiciatis molestiae a, mollitia consequuntur quas! Quas qui necessitatibus iusto voluptatibus ut neque officia facere maiores? Pariatur distinctio aliquid recusandae. Fugit, exercitationem dolorum non reiciendis molestiae labore sed iste ipsum dignissimos voluptate optio sunt culpa officia ab assumenda numquam! Id error exercitationem soluta delectus. Unde, eaque! Eos officiis saepe dignissimos enim ipsa consequatur nesciunt expedita modi iure, nulla mollitia ducimus hic beatae eum dolor assumenda maiores amet soluta voluptates earum asperiores inventore blanditiis, vel culpa. Rerum.",

    },
    {
        id: 8,
        author: "varun",
        title: "Hi it a blog there, made hardcoded for testing",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic quaerat, earum quibusdam neque doloremque voluptatibus architecto fugit blanditiis. Voluptas porro voluptatem consequuntur, nam dolore inventore non reiciendis perspiciatis praesentium? Error Accusamus, laborum dolor. Quibusdam, mollitia neque atque accusamus totam quas minima doloremque pariatur eligendi rerum molestias provident dolorum dolores, vitae eum. Iste dignissimos maiores a labore eius aspernatur perferendis tenetur. Nihil ullam minus laborum aut culpa possimus non voluptatibus nam? Pariatur dicta amet ab perspiciatis molestiae a, mollitia consequuntur quas! Quas qui necessitatibus iusto voluptatibus ut neque officia facere maiores? Pariatur distinctio aliquid recusandae. Fugit, exercitationem dolorum non reiciendis molestiae labore sed iste ipsum dignissimos voluptate optio sunt culpa officia ab assumenda numquam! Id error exercitationem soluta delectus. Unde, eaque! Eos officiis saepe dignissimos enim ipsa consequatur nesciunt expedita modi iure, nulla mollitia ducimus hic beatae eum dolor assumenda maiores amet soluta voluptates earum asperiores inventore blanditiis, vel culpa. Rerum.",

    },
    {
        id: 9,
        author: "varun",
        title: "Hi it a blog there, made hardcoded for testing",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic quaerat, earum quibusdam neque doloremque voluptatibus architecto fugit blanditiis. Voluptas porro voluptatem consequuntur, nam dolore inventore non reiciendis perspiciatis praesentium? Error Accusamus, laborum dolor. Quibusdam, mollitia neque atque accusamus totam quas minima doloremque pariatur eligendi rerum molestias provident dolorum dolores, vitae eum. Iste dignissimos maiores a labore eius aspernatur perferendis tenetur. Nihil ullam minus laborum aut culpa possimus non voluptatibus nam? Pariatur dicta amet ab perspiciatis molestiae a, mollitia consequuntur quas! Quas qui necessitatibus iusto voluptatibus ut neque officia facere maiores? Pariatur distinctio aliquid recusandae. Fugit, exercitationem dolorum non reiciendis molestiae labore sed iste ipsum dignissimos voluptate optio sunt culpa officia ab assumenda numquam! Id error exercitationem soluta delectus. Unde, eaque! Eos officiis saepe dignissimos enim ipsa consequatur nesciunt expedita modi iure, nulla mollitia ducimus hic beatae eum dolor assumenda maiores amet soluta voluptates earum asperiores inventore blanditiis, vel culpa. Rerum.",

    },
    {
        id: 10,
        author: "varun",
        title: "Hi it a blog there, made hardcoded for testing",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic quaerat, earum quibusdam neque doloremque voluptatibus architecto fugit blanditiis. Voluptas porro voluptatem consequuntur, nam dolore inventore non reiciendis perspiciatis praesentium? Error Accusamus, laborum dolor. Quibusdam, mollitia neque atque accusamus totam quas minima doloremque pariatur eligendi rerum molestias provident dolorum dolores, vitae eum. Iste dignissimos maiores a labore eius aspernatur perferendis tenetur. Nihil ullam minus laborum aut culpa possimus non voluptatibus nam? Pariatur dicta amet ab perspiciatis molestiae a, mollitia consequuntur quas! Quas qui necessitatibus iusto voluptatibus ut neque officia facere maiores? Pariatur distinctio aliquid recusandae. Fugit, exercitationem dolorum non reiciendis molestiae labore sed iste ipsum dignissimos voluptate optio sunt culpa officia ab assumenda numquam! Id error exercitationem soluta delectus. Unde, eaque! Eos officiis saepe dignissimos enim ipsa consequatur nesciunt expedita modi iure, nulla mollitia ducimus hic beatae eum dolor assumenda maiores amet soluta voluptates earum asperiores inventore blanditiis, vel culpa. Rerum.",

    },
    {
        id: 11,
        author: "varun",
        title: "Hi it a blog there, made hardcoded for testing",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic quaerat, earum quibusdam neque doloremque voluptatibus architecto fugit blanditiis. Voluptas porro voluptatem consequuntur, nam dolore inventore non reiciendis perspiciatis praesentium? Error Accusamus, laborum dolor. Quibusdam, mollitia neque atque accusamus totam quas minima doloremque pariatur eligendi rerum molestias provident dolorum dolores, vitae eum. Iste dignissimos maiores a labore eius aspernatur perferendis tenetur. Nihil ullam minus laborum aut culpa possimus non voluptatibus nam? Pariatur dicta amet ab perspiciatis molestiae a, mollitia consequuntur quas! Quas qui necessitatibus iusto voluptatibus ut neque officia facere maiores? Pariatur distinctio aliquid recusandae. Fugit, exercitationem dolorum non reiciendis molestiae labore sed iste ipsum dignissimos voluptate optio sunt culpa officia ab assumenda numquam! Id error exercitationem soluta delectus. Unde, eaque! Eos officiis saepe dignissimos enim ipsa consequatur nesciunt expedita modi iure, nulla mollitia ducimus hic beatae eum dolor assumenda maiores amet soluta voluptates earum asperiores inventore blanditiis, vel culpa. Rerum.",

    }
]

const BlogsFE = () => {
    /**
     * Few ways we can store and show the blogs
     * * Store it in state
     * * Store it directly  here
     * * Store it in a context variables
     * * Create out own custom hook called useBlogs
     */



  return (
    <div>
        <AppBar />
        <div className='flex justify-center'>
            <div className='p-10 pr-20 border-r-2 '>
                {blogs.map(blog => <BlogCard 
                    id={blog.id.toString()}
                    key={blog.id}
                    authorName={blog.author || "Anonymous"}
                    title={blog.title}
                    content={blog.content}
                    publishedDate={"6th May 2024"}
                />
                )}
            </div>
            <div>
                <HomeExtras />
            </div>
        </div>
    </div>
  )
}

export default BlogsFE
