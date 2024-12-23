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


## Backend Endpoints
"/api/v1/auth" - authRouter <br>
"/api/v1/user" - userRouter <br>
"/api/v1/blog" - blogRouter <br>

### authRouter
- `POST` - /signup
    - signup a new user - takes username, email and password in body - sends a jwt token(json)
- `POST` - /signin
    - signin a new user - takes email and password in body - sends a jwt token(json)


### middleware 
- check the user sent authentication jwt token to verify route accessibility, sets context with "userId"


### blogRouter
- `POST` - **/**
    - creates a new post - takes title, subtitle, content and autherId in body - sends the post id(json)
- `PUT` - **/**
    - updates the post - takes title, subtitle and content - sends the post id(json)
- `GET` - **/bulk**
    - sends all the posts in the database(posts, json)
    - posts contain array of object with post's id, title, subtitle, content, publishedDate, claps, author name 
- `GET` - **/:id**
    - sends post(json) of the specific id - takes post id as query parameter
    - post object contain post's id, title, subtitle, content, publishedDate, claps, author name 
- `POST` - **/:id/clap**
    - Allows a logged-in user to clap for a specific post.
    - Request body: { "clap": 1 }
    - Response: { "message": "Clap added", "totalClaps": 123 }..


### userRouter
- `GET` - **/follow/:id**
    - takes targetUserId from query param "id", and adds entry to userRelation table, update follow counters (using prisma transaction), sends message response
- `GET` - **/unfollow/:id**
    - takes targetUserId from query param "id", and deletes entry from userRelation table, update follow counters (using prisma transaction), sends message response
- `GET` - **/basicInfo/:id**
    - This endpoint is made to get the basic user details in for fullBlog page.
    - takes targetUserId and authorId and gives id, email, name, bio and isFollowing boolean value (if the loggedInUser is following the author or not)




# Future Plan 
**Planning to Build:**
- `GET` - **/comments/:postId**
    - Retrieves a paginated list of comments for a specific post.
    - Query params: ?page=1&limit=20.
    - Response: { "comments": [{ "id": "<id>", "content": "<text>", "author": "<name>" }], "total": 42 }.
- `POST` - **/comments/:postId**
    - Adds a comment to a post.
    - Request body: { "content": "<comment_text>" }.
    - Response: { "message": "Comment added", "commentId": "<id>" }.
- `DELETE` - **/comments/:commentId**
    - Deletes a comment by ID.
    - Response: { "message": "Comment deleted" }.





## Whatever I've Done:
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
-
-