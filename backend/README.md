# PenCraft Backend API Documentation

## Overview
PenCraft is a modern blogging platform built with Hono.js, Prisma, and deployed on Cloudflare Workers. This document provides comprehensive API documentation for all available routes and endpoints.

## Base URL
```
Production: https://api.pencraft.varuntd.com/api/v1
Development: http://localhost:8787/api/v1
```

## Top Level Routes

The main application (`index.ts`) defines the following top-level route groups:

- `/api/v1/auth` - Authentication related endpoints (handled by `authRouter`)
- `/api/v1/user` - User profile and social features (handled by `userRouter`)  
- `/api/v1/blog` - Blog CRUD operations and interactions (handled by `blogRouter`)
- `/api/v1/image` - Image upload and management (currently commented out)

---

## Authentication Routes (`/api/v1/auth`)

### POST `/signup`
**Handler:** `authRouter.post('/signup')`  
**Protected:** No  
**Body:**
```json
{
  "name": "string",
  "username": "string", 
  "password": "string"
}
```
**Response:**
```json
{
  "message": "Signed up",
  "userId": "string",
  "name": "string",
  "username": "string"
}
```
**Description:** Creates a new user account with hashed password and sets authentication cookie.

### POST `/signin`
**Handler:** `authRouter.post('/signin')`  
**Protected:** No  
**Body:**
```json
{
  "username": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "message": "Signed in",
  "userId": "string",
  "name": "string", 
  "username": "string",
  "profileImageUrl": "string | null"
}
```
**Description:** Authenticates user credentials and sets authentication cookie.

### GET `/me`
**Handler:** `authRouter.get('/me')`  
**Protected:** Yes (requires `authMiddleware`)  
**Body:** None  
**Response:**
```json
{
  "userId": "string",
  "name": "string",
  "username": "string",
  "profileImageUrl": "string | null"
}
```
**Description:** Returns current authenticated user's profile information.

### POST `/check-username`
**Handler:** `authRouter.post('/check-username')`  
**Protected:** No  
**Body:**
```json
{
  "username": "string"
}
```
**Response:**
```json
{
  "available": "boolean",
  "message": "string"
}
```
**Description:** Checks if a username is available for registration.

### GET `/logout`
**Handler:** `authRouter.get('/logout')`  
**Protected:** Yes (requires `authMiddleware`)  
**Body:** None  
**Response:**
```json
{
  "success": true
}
```
**Description:** Logs out user by clearing authentication cookie.

---

## User Routes (`/api/v1/user`)

**Note:** All user routes require authentication (`authMiddleware`)

### User Profile Routes

#### GET `/profile/:username`
**Handler:** `userProfileRouter.get('/profile/:username')`  
**Protected:** Yes  
**URL Params:** `username` - Target user's username  
**Response:**
```json
{
  "user": {
    "userId": "string",
    "name": "string",
    "bio": "string | null",
    "profileImageUrl": "string | null",
    "totalClaps": "number",
    "followersCount": "number", 
    "followingCount": "number",
    "createdAt": "date",
    "blogs": [
      {
        "blogId": "string",
        "title": "string",
        "subtitle": "string | null",
        "bannerImageUrl": "string | null",
        "content": "object",
        "publishedDate": "date",
        "claps": "number"
      }
    ]
  }
}
```
**Description:** Retrieves complete user profile with published blogs.

#### POST `/profileImage/upload`
**Handler:** `userProfileRouter.post('/profileImage/upload')`  
**Protected:** Yes  
**Body:**
```json
{
  "filename": "string",
  "contentType": "string"
}
```
**Response:**
```json
{
  "uploadUrl": "string",
  "key": "string"
}
```
**Description:** Generates presigned URL for profile image upload to S3.

#### POST `/changeUsername`
**Handler:** `userProfileRouter.post('/changeUsername')`  
**Protected:** Yes  
**Body:**
```json
{
  "newUsername": "string"
}
```
**Response:**
```json
{
  "canChangeUsername": "boolean",
  "success": "boolean",
  "message": "string"
}
```
**Description:** Changes user's username (limited to once every 60 days).

#### POST `/changePassword`
**Handler:** `userProfileRouter.post('/changePassword')`  
**Protected:** Yes  
**Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```
**Response:**
```json
{
  "isPasswordCorrect": "boolean", 
  "success": "boolean",
  "message": "string"
}
```
**Description:** Changes user's password after verifying current password.

### User Social Routes

#### POST `/follow/:targetUserId`
**Handler:** `userSocialRouter.post('/follow/:targetUserId')`  
**Protected:** Yes  
**URL Params:** `targetUserId` - ID of user to follow  
**Response:**
```json
{
  "message": "Successfully followed the user!"
}
```
**Description:** Creates follow relationship and updates follower/following counts.

#### POST `/unfollow/:targetUserId`
**Handler:** `userSocialRouter.post('/unfollow/:targetUserId')`  
**Protected:** Yes  
**URL Params:** `targetUserId` - ID of user to unfollow  
**Response:**
```json
{
  "message": "Successfully unfollowed the user!"
}
```
**Description:** Removes follow relationship and updates follower/following counts.

#### GET `/checkIsFollowing/:targetUserId`
**Handler:** `userSocialRouter.get('/checkIsFollowing/:targetUserId')`  
**Protected:** Yes  
**URL Params:** `targetUserId` - ID of user to check follow status  
**Response:**
```json
{
  "isFollowing": "boolean"
}
```
**Description:** Checks if current user is following target user.

#### GET `/followersList/:username`
**Handler:** `userSocialRouter.get('/followersList/:username')`  
**Protected:** Yes  
**URL Params:** `username` - Username to get followers for  
**Response:**
```json
{
  "followers": [
    {
      "userId": "string",
      "name": "string", 
      "username": "string",
      "profileImageUrl": "string | null",
      "createdAt": "date"
    }
  ]
}
```
**Description:** Returns list of users following the specified user.

#### GET `/followingsList/:username`
**Handler:** `userSocialRouter.get('/followingsList/:username')`  
**Protected:** Yes  
**URL Params:** `username` - Username to get following list for  
**Response:**
```json
{
  "followings": [
    {
      "userId": "string",
      "name": "string",
      "username": "string", 
      "profileImageUrl": "string | null",
      "createdAt": "date"
    }
  ]
}
```
**Description:** Returns list of users that the specified user is following.

### User Content Routes

#### GET `/:username/userPublishedBlogs`
**Handler:** `userContentRouter.get('/:username/userPublishedBlogs')`  
**Protected:** Yes  
**URL Params:** `username` - Username to get published blogs for  
**Response:**
```json
{
  "blogs": [
    {
      "blogId": "string",
      "title": "string",
      "subtitle": "string | null", 
      "bannerImageUrl": "string | null",
      "content": "object",
      "publishedDate": "date",
      "claps": "number"
    }
  ]
}
```
**Description:** Returns all published blogs for the specified user.

#### GET `/:username/userDrafts`
**Handler:** `userContentRouter.get('/:username/userDrafts')`  
**Protected:** Yes  
**URL Params:** `username` - Username to get draft blogs for  
**Response:**
```json
{
  "blogs": [
    {
      "blogId": "string",
      "title": "string",
      "subtitle": "string | null",
      "bannerImageUrl": "string | null", 
      "content": "object",
      "claps": "number"
    }
  ]
}
```
**Description:** Returns all draft (unpublished) blogs for the specified user.

---

## Blog Routes (`/api/v1/blog`)

**Note:** All blog routes require authentication (`authMiddleware`)

### Blog CRUD Routes

#### POST `/`
**Handler:** `blogCrudRouter.post('/')`  
**Protected:** Yes  
**Body:**
```json
{
  "blogId": "string",
  "title": "string",
  "subtitle": "string | null",
  "content": "object",
  "bannerImageKey": "string | null",
  "published": "boolean"
}
```
**Response:**
```json
{
  "blogId": "string"
}
```
**Description:** Creates a new blog post (draft or published).

#### DELETE `/`
**Handler:** `blogCrudRouter.delete('/')`  
**Protected:** Yes  
**Body:**
```json
{
  "blogId": "string"
}
```
**Response:**
```json
{
  "message": "Blog deleted successfully",
  "deletedImages": {
    "banner": "number",
    "content": "number"
  }
}
```
**Description:** Deletes a blog post (both published and unpublished) and all associated S3 images including banner and content images. Only the author can delete their own blogs.

#### GET `/bulk`
**Handler:** `blogCrudRouter.get('/bulk')`  
**Protected:** Yes  
**Query Params:** `page` (default: 1), `limit` (default: 8)  
**Response:**
```json
{
  "blogs": [
    {
      "blogId": "string",
      "title": "string", 
      "subtitle": "string | null",
      "bannerImageUrl": "string | null",
      "content": "object",
      "publishedDate": "date",
      "claps": "number",
      "author": {
        "name": "string",
        "userId": "string",
        "username": "string",
        "profileImageUrl": "string | null"
      }
    }
  ],
  "pagination": {
    "total": "number",
    "page": "number", 
    "limit": "number",
    "pages": "number"
  }
}
```
**Description:** Returns paginated list of all published blogs.

#### GET `/:blogId`
**Handler:** `blogCrudRouter.get('/:blogId')`  
**Protected:** Yes  
**URL Params:** `blogId` - Blog ID to retrieve  
**Response:**
```json
{
  "blog": {
    "blogId": "string",
    "title": "string",
    "subtitle": "string | null",
    "content": "object", 
    "publishedDate": "date",
    "claps": "number",
    "bannerImageUrl": "string | null",
    "author": {
      "name": "string",
      "userId": "string",
      "username": "string",
      "profileImageUrl": "string | null"
    }
  }
}
```
**Description:** Retrieves a specific blog post by ID.

#### PUT `/`
**Handler:** `blogCrudRouter.put('/')`  
**Protected:** Yes  
**Body:**
```json
{
  "blogId": "string",
  "title": "string",
  "subtitle": "string | null",
  "content": "object",
  "bannerImageKey": "string | null", 
  "published": "boolean"
}
```
**Response:**
```json
{
  "blogId": "string"
}
```
**Description:** Updates an existing blog post (only by author).

### Blog Interaction Routes

#### POST `/:blogId/clap`
**Handler:** `blogInteractionsRouter.post('/:blogId/clap')`  
**Protected:** Yes  
**URL Params:** `blogId` - Blog to clap for  
**Body:** `{}` (empty object)  
**Response:**
```json
{
  "blogId": "string",
  "claps": "number"
}
```
**Description:** Increments clap count for blog and author's total claps.

### Blog Media Routes

#### POST `/blogBanner/upload/:blogId`
**Handler:** `blogMediaRouter.post('/blogBanner/upload/:blogId')`  
**Protected:** Yes  
**URL Params:** `blogId` - Blog ID for banner image  
**Body:**
```json
{
  "filename": "string",
  "contentType": "string"
}
```
**Response:**
```json
{
  "uploadUrl": "string",
  "key": "string"
}
```
**Description:** Generates presigned URL for blog banner image upload.

#### POST `/images/batch-upload/:blogId`
**Handler:** `blogMediaRouter.post('/images/batch-upload/:blogId')`  
**Protected:** Yes  
**URL Params:** `blogId` - Blog ID for images  
**Body:**
```json
{
  "images": [
    {
      "filename": "string",
      "contentType": "string", 
      "fileId": "string"
    }
  ]
}
```
**Response:**
```json
{
  "uploadUrls": [
    {
      "fileId": "string",
      "uploadUrl": "string",
      "key": "string",
      "imageId": "string"
    }
  ]
}
```
**Description:** Generates multiple presigned URLs for blog image uploads.

#### GET `/images/:key`
**Handler:** `blogMediaRouter.get('/images/:key')`  
**Protected:** Yes  
**URL Params:** `key` - S3 object key  
**Response:**
```json
{
  "signedUrl": "string"
}
```
**Description:** Generates presigned URL for accessing an image.

#### DELETE `/images/batch-delete`
**Handler:** `blogMediaRouter.delete('/images/batch-delete')`  
**Protected:** Yes  
**Body:**
```json
{
  "keys": ["string"]
}
```
**Response:**
```json
{
  "deleted": "number"
}
```
**Description:** Deletes multiple images from S3 storage.

---

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "message": "Error description",
  "field": "fieldName" // (optional, for validation errors)
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid auth)
- `403` - Forbidden (incorrect credentials)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate data)
- `411` - Length Required (input validation failed)
- `500` - Internal Server Error

---

## Authentication

The API uses JWT tokens stored in HTTP-only cookies for authentication. The `authMiddleware` extracts the user ID from the token and makes it available to protected routes via `c.get("userId")`.

Cookie settings:
```
HttpOnly; Secure; SameSite=None; Path=/; Max-Age=172800 (2 days)
```

---

## Database Schema

The API uses Prisma ORM with the following main models:
- `User` - User accounts and profiles
- `Blog` - Blog posts and drafts  
- `UserRelation` - Follow/follower relationships

---

## File Storage

Images are stored in AWS S3 with the following key patterns:
- Profile images: `profiles/{userId}_{date}.{ext}`
- Blog banners: `banner/{blogId}.{ext}`
- Blog content images: `blog/{blogId}/{imageId}`

The API generates presigned URLs for secure client-side uploads and access.
