# Social Media Application Backend

A lightweight social media application backend built with Node.js, Express, MongoDB, and Firebase Cloud Messaging.

**Test Credentials**
Email : mdmohon6145@gmail.com
password: admin@1

## Features

- **User Authentication**: JWT-based signup/login
- **Posts**: Create and view text-only posts with pagination
- **Interactions**: Like/unlike posts and add comments
- **Real-time Notifications**: Firebase Cloud Messaging for instant notifications when posts are liked or commented on
- **Secure**: Helmet, XSS protection, CSRF protection, and rate limiting

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- Firebase project with Cloud Messaging enabled

## Installation

1. **Clone the repository**

    ```bash
    cd /Users/dev_mohon/Dev_finder/personal/job\ task/API
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Configure environment variables**

    Update the `.env` file with your configuration:

    ```env
    # Database
    MONGODB_URI=mongodb://localhost:27017/social_media_app

    # JWT
    JWT_SECRET=your-secret-key-here
    JWT_EXPIRES_IN=7d

    # Firebase Cloud Messaging
    FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json

    # Server
    PORT=4000
    NODE_ENV=development
    ```

4. **Set up Firebase**
    - Go to [Firebase Console](https://console.firebase.google.com/)
    - Create a new project or select an existing one
    - Navigate to Project Settings > Service Accounts
    - Click "Generate New Private Key"
    - Save the JSON file as `firebase-service-account.json` in the project root
    - Ensure the path in `.env` matches the location of this file

5. **Start the server**
    ```bash
    npm start
    ```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Posts

- `POST /api/posts` - Create a new post (authenticated)
- `GET /api/posts` - Get all posts with pagination (authenticated)
    - Query params: `page` (default: 1), `limit` (default: 10)
- `GET /api/posts/:id` - Get a single post (authenticated)
- `DELETE /api/posts/:id` - Delete a post (authenticated, author only)

### Interactions

- `POST /api/posts/:id/like` - Like or unlike a post (authenticated)
- `POST /api/posts/:id/comment` - Add a comment to a post (authenticated)
    - Body: `{ "content": "Your comment" }`
- `GET /api/posts/:id/likes` - Get all likes for a post (authenticated)
- `GET /api/posts/:id/comments` - Get all comments for a post (authenticated)
    - Query params: `page`, `limit`

### Notifications

- `GET /api/notifications` - Get user notifications (authenticated)
    - Query params: `page`, `limit`
- `PUT /api/notifications/:id/read` - Mark a notification as read (authenticated)
- `PUT /api/notifications/read-all` - Mark all notifications as read (authenticated)

## Request/Response Examples

### Create a Post

```bash
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "This is my first post!"
}
```

**Response:**

```json
{
    "success": true,
    "message": "Post created successfully",
    "data": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "content": "This is my first post!",
        "author": {
            "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@example.com"
        },
        "likesCount": 0,
        "commentsCount": 0,
        "createdAt": "2021-07-21T12:00:00.000Z"
    }
}
```

### Like a Post

```bash
POST /api/posts/:id/like
Authorization: Bearer <token>
```

**Response:**

```json
{
    "success": true,
    "message": "Post liked successfully",
    "data": {
        "liked": true
    }
}
```

### Get Notifications

```bash
GET /api/notifications?page=1&limit=20
Authorization: Bearer <token>
```

**Response:**

```json
{
    "success": true,
    "message": "Notifications retrieved successfully",
    "data": {
        "results": [
            {
                "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
                "type": "like",
                "message": "John Doe liked your post",
                "sender": {
                    "firstName": "John",
                    "lastName": "Doe"
                },
                "post": {
                    "content": "This is my post"
                },
                "isRead": false,
                "createdAt": "2021-07-21T12:00:00.000Z"
            }
        ],
        "page": 1,
        "limit": 20,
        "totalPages": 1,
        "totalResults": 5,
        "unreadCount": 3
    }
}
```

## Firebase Cloud Messaging Setup

### For Mobile Apps (React Native, Flutter, etc.)

1. **Get FCM Token**: When a user logs in, obtain their FCM device token from Firebase SDK
2. **Update User Profile**: Send the FCM token to update the user's profile

    ```bash
    PUT /api/user/profile
    Authorization: Bearer <token>

    {
      "fcmToken": "device-fcm-token-here"
    }
    ```

3. **Receive Notifications**: The app will automatically receive push notifications when:
    - Someone likes their post
    - Someone comments on their post

### Notification Payload Structure

```json
{
    "notification": {
        "title": "New Like",
        "body": "John Doe liked your post"
    },
    "data": {
        "type": "like",
        "postId": "60f7b3b3b3b3b3b3b3b3b3b3",
        "senderId": "60f7b3b3b3b3b3b3b3b3b3b3",
        "notificationId": "60f7b3b3b3b3b3b3b3b3b3b3",
        "timestamp": "2021-07-21T12:00:00.000Z"
    }
}
```

## Project Structure

```
src/
├── app/
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── error.js             # Error handling middleware
│   ├── modules/
│   │   ├── auth/                # Authentication module
│   │   ├── user/                # User module
│   │   ├── post/                # Post module
│   │   │   ├── post.model.js
│   │   │   ├── post.service.js
│   │   │   ├── post.controller.js
│   │   │   └── post.route.js
│   │   ├── interaction/         # Likes & Comments module
│   │   │   ├── like.model.js
│   │   │   ├── comment.model.js
│   │   │   ├── interaction.service.js
│   │   │   ├── interaction.controller.js
│   │   │   └── interaction.route.js
│   │   └── notification/        # Notification module
│   │       ├── notification.model.js
│   │       ├── notification.service.js
│   │       ├── notification.controller.js
│   │       └── notification.route.js
│   └── routes/
│       └── index.js             # Main router
├── config/
│   ├── db_conn.js               # Database connection
│   └── logger.js                # Winston logger
├── utils/
│   ├── firebase.service.js      # Firebase Admin SDK service
│   ├── ApiError.js              # Custom error class
│   ├── catchAsync.js            # Async error handler
│   └── pick.js                  # Object key picker utility
├── app.js                       # Express app setup
└── index.js                     # Server entry point
```

## Security Features

- **Helmet**: Sets various HTTP headers for security
- **XSS Protection**: Sanitizes user input to prevent XSS attacks
- **CSRF Protection**: Protects against CSRF attacks
- **MongoDB Sanitization**: Prevents NoSQL injection attacks
- **Rate Limiting**: Prevents brute force attacks
- **JWT Authentication**: Secure token-based authentication

## Testing

Use tools like Postman or Insomnia to test the API endpoints. Make sure to:

1. Create a user account via `/api/auth/signup`
2. Login to get a JWT token via `/api/auth/login`
3. Use the token in the `Authorization` header as `Bearer <token>`
4. Test creating posts, liking, commenting, and receiving notifications

## Troubleshooting

### Firebase Notifications Not Working

1. **Check Firebase Credentials**: Ensure `firebase-service-account.json` is in the correct location
2. **Verify FCM Token**: Make sure users have valid FCM tokens stored in the database
3. **Check Logs**: Look for Firebase initialization messages in the server logs
4. **Test Mode**: Firebase may require additional setup for production use

### Database Connection Issues

1. **MongoDB Running**: Ensure MongoDB is running on your system
2. **Connection String**: Verify the `MONGODB_URI` in `.env` is correct
3. **Network Access**: Check firewall settings if using remote MongoDB

## License

MIT
