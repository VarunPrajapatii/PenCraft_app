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
"/api/v1/user" - userRouter
"/api/v1/blog" - postRouter

userRouter
- POST - /signup
    - creates a new user and sends a jwt token(json)
- POST - /signin
    - signin the existing user and sends a jwt token(json)
- POST - /follow
    - Allows the logged-in user to follow another user.
    - Request body: { "followingId": "<user_id>" }.
    - Response: { "message": "Followed successfully" }.
- POST - /unfollow
    - Allows the logged-in user to unfollow another user.
    - Request body: { "followingId": "<user_id>" }.
    - Response: { "message": "Unfollowed successfully" }.
- GET - /followers/:userId
    - Retrieves a paginated list of followers for the given user.
    - Query params: ?page=1&limit=20.
    - Response: { "followers": [{ "id": "<id>", "name": "<name>" }], "total": 123 }.
- GET - /following/:userId
    - Retrieves a paginated list of users the given user is following.
    - Query params: ?page=1&limit=20.
    - Response: { "following": [{ "id": "<id>", "name": "<name>" }], "total": 45 }.



postRouter
- middleware 
    - check the user sent authentication jwt token to verify route accessibility
- post - /
    - creates a new post and sends the post id(json)
- put - /
    - updates the post and sends the post id(json)
- get - /bulk
    - sends all the posts in the database(posts, json)
- get - /:id
    - sends post(json) of the specific id
- POST - /clap
    - Allows a logged-in user to clap for a specific post.
    - Request body: { "clap": 1 } (optional if you want to allow multiple claps in one request).
    - Response: { "message": "Clap added", "totalClaps": 123 }..


    **Planning to Build:**
- GET - /comments/:postId
    - Retrieves a paginated list of comments for a specific post.
    - Query params: ?page=1&limit=20.
    - Response: { "comments": [{ "id": "<id>", "content": "<text>", "author": "<name>" }], "total": 42 }.
- POST - /comments/:postId
    - Adds a comment to a post.
    - Request body: { "content": "<comment_text>" }.
    - Response: { "message": "Comment added", "commentId": "<id>" }.
- DELETE - /comments/:commentId
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
- Added Followers/Following Counts
-
-
-
-