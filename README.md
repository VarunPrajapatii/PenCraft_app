## THE STACK

I'll be building a full stack blog website in the following technologies: 
### Frontend
- React: A JavaScript library for building user interfaces with a component-based architecture.
### Backend
- Cloudflare Workers: Serverless execution environment ensuring high performance and low latency.
### Validation
- Zod: TypeScript-first schema declaration and validation library.
### Language
- TypeScript: A strongly typed programming language that enhances JavaScript with static type checking.
### ORM
- Prisma: Next-generation ORM for type-safe database querying and management.
### Database
- PostgreSQL: Robust, high-performance, open-source relational database.
### Authentication
- JWT (JSON Web Tokens): Secure method for transmitting information between client and server.

This stack provides a modern, scalable, and maintainable solution for building a full-stack blog website. Each component has been chosen to ensure high performance, security, and developer productivity.



Great — since your project is structured as:

```
/ (root)
├── backend/      # Cloudflare Workers (serverless)
├── frontend/     # React app (S3 + CloudFront)
├── common/       # Shared code published as NPM package
```

You can create a clear, professional **Folder Structure Guide** either inside your `README.md` or as a separate file like `FOLDER_STRUCTURE.md`.

---


## 📁 Project Folder Structure

/ (root)
├── backend/      # Cloudflare Workers (serverless)
├── frontend/     # React app (S3 + CloudFront)
├── common/       # Shared code published as NPM package

---

### 📂 Folder Breakdown

#### `backend/`

* Contains the backend code running on **Cloudflare Workers** (serverless).
* Uses `Hono` for routing and middleware.
* Includes Prisma setup for database access and API routes for user/blog logic.
* **Deployment**: Deployed using [Wrangler](https://developers.cloudflare.com/workers/wrangler/) to Cloudflare Workers.
* Has its own `README.md` with API routes and DB schema.

#### `frontend/`

* Contains the **React** frontend built with **Vite** and TypeScript.
* Integrated with **Redux**, **EditorJS**, and responsive design.
* Handles routing, state management, UI, and communication with backend.
* **Deployment**: Hosted on **AWS S3 + CloudFront** for global distribution and fast loading.

#### `common/`

* Contains **shared validation and utility code** (e.g. Zod schemas) used by both frontend and backend.
* Is an **independent NPM package**, locally developed and versioned.
* Promotes code reuse and type safety across the full stack.

#### Other Files:

* `CONTRIBUTING.md`: How to contribute to this project.
* `README.md`: Overview, tech stack, features, and instructions.

---

## 📌 Notes
* Frontend and backend are **decoupled**, communicating via API.
* `common/` should be installed as a local package in both `frontend` and `backend` during development.
* To publish the `common/` package, follow the versioning and publishing guidelines in `common/README.md`.


---
---

# Whatever I've Done (the whole flow of making of PenCraft):
- Setting up backend first with hono@latest.
- Setting up required routes of user and blog.
- Initializing database (prisma)
    - Used Aiven DB
    - Got connection pool from prisma
- Initialized Schema
- Created SignUp, SignIn and Middlewares
- Added JWT authorization in User and Post
- Created Post create, update, find routes
- Deploy the Backend with wrangler at cloudflare
- Created common for zod validation and published at npm
- Added Validation in User and Post
- Initialized Frontend from Vite
- Created Routes to pages
- Created functional Signup and Signin pages
- Created Blogs page and Blog page
- Changed UI- Signin/Signup
- Added Post Clap feature
- Made the publishedDate show up on UI
- Added Subtitles in the posts
- Integrated Redux Store for efficient state management
- Made authSlice to handle token/auth data, status
- Added Followers/Following Counts in database
- Created a endpoint to follow/unfollow user
- Added follow/unfollow button on blog page
- Created endpoint to get details of author
- Created ProfileLayout for Profile page. Sections included:
    - Edit Profile
    - User Blogs
    - Followers, Following List
- Made a S3 bucket for this project to store Images
- Added Profile Image functionality
    - User can upload profile image, which are stored in S3 bucket
- Added Banner Image functionality in Blogs
- Integrated an EditorJS for blog creation with
    - Header
    - Paragraph
    - Inline Edit Tools like Bold, Italic, Link, Marker
    - List Features
    - Code Block
- Added Image upload in EditorJS
    - User can upload images in blog, which are stored in S3 bucket
    - Images are downloaded with presigned URL
- Added a complex, scalable and secure publish logic
- Tried to use editorjs-html library to convert EditorJS content to HTML
    - But it didnt worked, so used my own custom function to convert EditorJS content to HTML
- UI and UX improvements
    - Made a new Landing Page
    - Made new Header and made its right side conditional Render according to routes
    - Made new looking Blogs Home Page with infinite scrolling using react-infinite-scroll-component library
    - Made new looking Blog Page
- All these components are fully responsive and works well on all screen sizes.
- Tried to improve Claps logic to make clap count changes reflect on frontend and update count to backend when the page unmounts, to make one backend call rather than making backend call for each clap click, but this didnt worked, so falled back to the old logic of making backend call for each clap click.
- Added a new feature to show the total claps of the User on the blog page, changed database and API logic accordingly.
- Drastic change in email logic
    - Dumped whole database
    - Changed email to unique username in database, Usernames must:
        - Start with a letter.
        - Contain only letters, numbers, and underscores.
        - Not start/end with an underscore.
        - Not have consecutive underscores.
        - Be 5–30 characters long.
    - Changed all the frontend and API logic to use username instead of email
    - Changed the User Profile page route to be `/@username` instead of `/profile/:id`
- Changed the Follow/Unfollow logic 
    - TODO: Optimistic update: UI changes immediately (before backend confirmation)
    - TODO: If backend fails, error is logged but UI isn't reverted
- Created endpoint that gives list of followers and following list of target user and responsive UI for followers and following lists
- New Profile page that has Outlet replacing Followers list, Following List, Edit Profile, User Published Blogs list and User Drafts List (draft functionality I'll add)
- Added a upload profile picture feature from User View Profile Section
    - made backend endpoint and S3 logic to upload profile picture, older profile gets deleted from s3 (added delete object logic)
    - at frontend profile can be changed from profile page clicking on the profile photo
- Added username change option (username cant be change to already existing username and once in 60 days)
- Added Password change option in edit profile button.
- Added draft functionality
    - user can save blog as draft, its saved same as published blog but with published as false
    - user can edit the blog draft (in that the content images are converted to blob urls and then the images are deleted from s3, then user edit the images, adds more or deleted previous then all images are bulk uploaded to S3 using presigned URL)
    - banner image can be changed too.
    - So in publish page added a disclaimer if user changes route then all the images of draft will be deleted. Also added alert when user reloads or closes the tab. TODO: add a route change alert logic too...
- Migrated from localStorage + jwt to sessionStorage + jwt, with 2 days expiry.
- Arranged all the routes in more modular and readable way.
- Added dark mode toggle functionality accross the application
- Made a backend/readme.md file to explain all the routes in detail and database schema
- 










/** for README
 * What is window.pendingBlogImages?

    The window object is the global object in browsers that represents the browser window. It's accessible from anywhere in your JavaScript code. We're using it as a global storage mechanism for our pending images.

    Why use window instead of React state?

    Cross-Component Access: EditorJS runs independently of React's component lifecycle
    Persistence: Data survives component re-renders
    Tool Independence: Image tool can access data without prop drilling
    Global Scope: Available throughout the entire application
 * 
 */




- thats how the folder structure of s3 looks like
 * /profile/{userId}.{ext}
 * /banner/{blogId}.{ext}
 * /blog/{blogId}/{imageId}.{ext}

- changed the S3 bucket policy
    - the PUT object in profile, banner, blog need presigned url with expiry
    - the GET object of profile and banner folder doesnt need presigned url
    - the GET object of blog need presigned url
- So now the images will be handled like
    - Profile Image
        **Upload**:
        Use generateUploadPresignedUrl for PUT (presigned, secure).
        **Get**:
        Use getPublicS3Url (no presigned URL needed, just return the public URL).
    - Banner Image
        **Upload**:
        Use generateUploadPresignedUrl for PUT (presigned, secure).
        **Get**:
        Use getPublicS3Url (no presigned URL needed, just return the public URL).
    - Blog Image
        **Upload**:
        Use generateUploadPresignedUrl for PUT (presigned, secure).
        **Get**:
        Use generatePrivateGetPresignedUrl for GET (presigned, secure).

- User creatre route has ProfileImage


- the flow of user selecting images for blog to uploading all images with one be call to get batch presigned url
Why This Approach is Best:
1. Performance Benefits:
    - Batch Upload: Single API call for multiple images
    - Concurrent Processing: Banner and blog images upload simultaneously
    - Immediate Preview: Users see images instantly via blob URLs
2. Scalability:
    - S3 Direct Upload: Reduces server load
    - Pre-signed URLs: Secure and scalable
    - Efficient Memory Usage: Files uploaded directly from browser
3. User Experience:
    - Single Action: Everything uploads when user publishes
    - Visual Feedback: Immediate image preview
    - Error Handling: Graceful failure with rollback
4. Data Consistency:
    - Atomic Operations: Either all images upload or none
    - Clean URLs: Content always has valid S3 URLs
    - Proper Cleanup: Blob URLs are revoked after upload




### V1
- its will be a pure authentication based application, i.e. not signed in user cant access anything, each any every thing is authenticated








### Setup
### Environment Variable Configuration for Cloudflare Workers with Prisma Accelerate

Key Points to Remember
- Use direct PostgreSQL URL for migrations
- Use Accelerate URL for your application
- Always create a new Prisma Client instance for each request in Cloudflare Workers
- Always use $extends(withAccelerate()) when using Accelerate
- Enable driverAdapters preview feature in your schema




