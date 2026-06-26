# YouTube-Style Video Backend API

A production-oriented backend API for a video sharing platform inspired by YouTube. This project focuses on the core server-side architecture needed for a modern media application: user authentication, secure account management, video metadata modeling, file upload handling, channel profiles, subscriptions, likes, comments, playlists, tweets/community posts, and dashboard-ready API modules.

The project is built with Node.js, Express, MongoDB, Mongoose, JWT authentication, Multer, and Cloudinary. It is designed as a modular REST API where each domain has its own routes, controllers, models, middleware, and reusable utilities.

> Status: actively in development. Core backend structure, authentication flow, media upload foundation, database models, and route modules are in place. Some advanced feature controllers like "dashbord,likes,comments,playlists,tweets" are planned and being completed incrementally.

## Features

- User registration and login with JWT-based authentication
- Access token and refresh token generation
- Secure password hashing with bcrypt
- Cookie-based auth support with `httpOnly` cookies
- Protected routes using reusable JWT middleware
- User profile management
- Avatar and cover image upload flow
- Cloudinary integration for media storage
- Multer-based multipart form-data handling
- Channel profile API with aggregation support
- Watch history data model and API foundation
- Video model with owner, thumbnail, video file, views, duration, and publish status
- Comment, like, tweet, playlist, and subscription domain models
- Modular route structure for scalable API development
- MongoDB aggregation pagination support for videos and comments
- Clean response and error utility classes
- Versioned REST API prefix: `/api/v1`

## Tech Stack

| Layer | Technology |
| --- | --- |
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT, cookies |
| Password Security | bcrypt |
| File Uploads | Multer |
| Media Storage | Cloudinary |
| Dev Tooling | Nodemon, Prettier |

## Project Structure

```txt
src/
  controllers/      Route handler logic for each API module
  db/               MongoDB connection setup
  middlewares/      Authentication and file-upload middleware
  models/           Mongoose schemas and models
  routes/           Express route definitions
  utils/            Reusable API response, error, async handler, Cloudinary helpers
  app.js            Express app configuration and route mounting
  index.js          Server bootstrap and database connection

public/
  temp/             Temporary local upload directory before Cloudinary upload
```

## API Modules

### Users

Base path: `/api/v1/users`

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/register` | Register a new user with avatar and optional cover image |
| POST | `/login` | Login user and return access/refresh tokens |
| POST | `/logout` | Logout authenticated user |
| POST | `/refresh-token` | Refresh access token |
| POST | `/change-password` | Change current user password |
| GET | `/current-user` | Get authenticated user details |
| PATCH | `/update-account` | Update account details |
| PATCH | `/avatar-update` | Update avatar image |
| PATCH | `/coverImage-update` | Update cover image |
| GET | `/c/:username` | Get channel profile |
| GET | `/history` | Get watch history |

### Videos

Base path: `/api/v1/videos`

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/` | Get videos with query, sort, and pagination support planned |
| POST | `/` | Publish a video with video file and thumbnail upload |
| GET | `/:videoId` | Get video details |
| PATCH | `/:videoId` | Update video details and thumbnail |
| DELETE | `/:videoId` | Delete a video |
| PATCH | `/toggle/publish/:videoId` | Toggle publish status |

### Comments

Base path: `/api/v1/comments`

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/:videoId` | Get comments for a video |
| POST | `/:videoId` | Add a comment |
| PATCH | `/c/:commentId` | Update a comment |
| DELETE | `/c/:commentId` | Delete a comment |

### Likes

Base path: `/api/v1/likes`

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/toggle/v/:videoId` | Toggle video like |
| POST | `/toggle/c/:commentId` | Toggle comment like |
| POST | `/toggle/t/:tweetId` | Toggle tweet like |
| GET | `/videos` | Get liked videos |

### Tweets / Community Posts

Base path: `/api/v1/tweets`

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/` | Create a tweet/community post |
| GET | `/user/:userId` | Get tweets by user |
| PATCH | `/:tweetId` | Update a tweet |
| DELETE | `/:tweetId` | Delete a tweet |

### Playlists

Base path: `/api/v1/playlist`

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/` | Create playlist |
| GET | `/:playlistId` | Get playlist by ID |
| PATCH | `/:playlistId` | Update playlist |
| DELETE | `/:playlistId` | Delete playlist |
| PATCH | `/add/:videoId/:playlistId` | Add video to playlist |
| PATCH | `/remove/:videoId/:playlistId` | Remove video from playlist |
| GET | `/user/:userId` | Get user playlists |

### Subscriptions

Base path: `/api/v1/subscriptions`

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/c/:channelId` | Toggle channel subscription |
| GET | `/c/:channelId` | Get subscribed channels / channel subscription data |
| GET | `/u/:subscriberId` | Get subscriber-related data |

### Dashboard

Base path: `/api/v1/dashboard`

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/stats` | Get channel statistics |
| GET | `/videos` | Get channel uploaded videos |

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:3000

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Add the required environment variables in `.env`.

### 4. Start Development Server

```bash
npm run dev
```

The server runs on:

```txt
http://localhost:8000
```

## Authentication Flow

1. User registers with account details and avatar.
2. Password is hashed before saving to MongoDB.
3. User logs in with email/username and password.
4. Server generates access and refresh tokens.
5. Protected routes use the access token from cookies or the `Authorization` header.
6. Refresh token endpoint issues a new access token when needed.

Example protected request header:

```txt
Authorization: Bearer <accessToken>
```

## File Upload Flow

1. Client sends multipart form-data through Postman or frontend.
2. Multer stores files temporarily in `public/temp`.
3. Cloudinary utility uploads the file to cloud storage.
4. The Cloudinary URL is saved in MongoDB.
5. Temporary local files are removed after upload.

## Database Models

- `User`: account details, avatar, cover image, watch history, refresh token
- `Video`: video file URL, thumbnail, title, duration, views, owner, publish status
- `Comment`: content, video reference, owner reference
- `Like`: video/comment/tweet likes by user
- `Tweet`: community post content and owner
- `Playlist`: playlist metadata, video reference, owner
- `Subscription`: subscriber-channel relationship

## Resume Highlights

This project demonstrates:

- REST API design for a media-heavy backend
- Authentication and authorization using JWT
- Secure password management with bcrypt
- MongoDB schema design with Mongoose
- File upload handling with Multer and Cloudinary
- Modular Express architecture
- Middleware-driven protected routes
- Aggregation-based profile and history APIs
- Scalable backend planning for video, playlist, like, comment, subscription, and dashboard features

## Author

Shivendra Singh

