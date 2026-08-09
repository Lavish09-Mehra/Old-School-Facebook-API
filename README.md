# Old-School Facebook API

> A nostalgic trip back to the Facebook of 2008 - built as a modern, JWT-secured REST API with Node.js, Express and MongoDB.

Remember when Facebook was simple? A status box, a wall, and your friends' posts in one feed? This API brings that vibe back - an old-school social backend where users sign up, log in, and post statuses to a shared feed, protected by token-based authentication.

[![Node](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.x-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtoken&logoColor=white)](https://jwt.io)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## Features

- **User Authentication** - signup, login, and JWT-based protected routes
- **Password Security** - passwords hashed with `bcrypt` (12 salt rounds)
- **Old-School Posts** - post statuses with hashtags and captions to a shared feed
- **Personal Wall** - fetch any user's posts, or your own profile + posts
- **Token Guard** - every post/profile route requires a valid `Bearer` token
- **Mongoose ODM** - clean schema modeling with timestamps on every document

## Tech Stack

| Layer       | Technology                              |
| ----------- | --------------------------------------- |
| Runtime     | Node.js                                 |
| Framework   | Express.js                              |
| Database    | MongoDB (Mongoose ODM)                  |
| Auth        | JSON Web Tokens (JWT) + bcrypt          |
| Config      | dotenv                                  |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18 or higher
- [MongoDB](https://www.mongodb.com) - local install or a free Atlas cluster

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Lavish09-Mehra/old-school-facebook-api.git
cd old-school-facebook-api

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env

# 4. Start the server
npm start
```

You should see:

```
Successfully connected to database
server: http://localhost:3000
```

### Environment Variables

Create a `.env` file in the root with:

```env
MONGO_URL=mongodb://your-mongo-connection-string
JWT_SECRET=your-super-secret-key
PORT=3000
```

| Variable    | Description                              | Example                           |
| ----------- | ---------------------------------------- | --------------------------------- |
| `MONGO_URL` | MongoDB connection string                | `mongodb://127.0.0.1:27017/fb`    |
| `JWT_SECRET`| Secret used to sign/verify JSON Web Tokens | `iamLavish-098-MehRa-heg4ct5yng5`|
| `PORT`      | Port the server listens on               | `3000`                            |

> Never commit your `.env` - it is already in `.gitignore`.

---

## API Reference

**Base URL:** `http://localhost:3000`

All routes below `/create-post`, `/feed`, `/post-of/:username` and `/me` are **protected** - send your JWT in the `Authorization` header:

```
Authorization: Bearer <your-token>
```

### Endpoint Map

| Method | Endpoint                  | Auth | Description                              |
| ------ | ------------------------- | ---- | ---------------------------------------- |
| GET    | `/`                       | No   | Health check - is the server alive?      |
| POST   | `/signup`                 | No   | Create a new account                     |
| POST   | `/login`                  | No   | Log in and receive a JWT                 |
| PUT    | `/forgot-password`        | Yes  | Update your password while logged in     |
| POST   | `/create-post`            | Yes  | Publish a status to the feed             |
| GET    | `/feed`                   | Yes  | Get every post on the platform           |
| GET    | `/post-of/:username`      | Yes  | Get all posts by a specific user         |
| GET    | `/me`                     | Yes  | Get your profile plus your own posts     |

---

### 1. Health Check

```http
GET /
```

**Response `200 OK`**

```json
{
  "message": "I am working Boss..",
  "status": 200,
  "success": "Up"
}
```

### 2. Sign Up

```http
POST /signup
Content-Type: application/json

{
  "username": "Lavish",
  "email": "lavish@example.com",
  "password": "super-secret"
}
```

**Response `201 Created`** (password is stored hashed - never in plain text)

```json
{
  "message": "Succesfully Created a account On Old-School Facebook API..",
  "user": {
    "username": "Lavish",
    "email": "lavish@example.com",
    "password": "$2b$12$E...",
    "_id": "66c0...",
    "createdAt": "2026-08-09T12:00:00.000Z",
    "updatedAt": "2026-08-09T12:00:00.000Z"
  }
}
```

**Errors:** `400` missing fields | `409` email already exists

### 3. Log In

```http
POST /login
Content-Type: application/json

{
  "email": "lavish@example.com",
  "password": "super-secret"
}
```

**Response `200 OK`**

```json
{
  "message": "Login Success..",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

Save this token - you need it for every protected route. It expires after **2 hours**.

**Errors:** `400` missing fields | `404` user not found | `401` wrong password

### 4. Forgot / Change Password

```http
PUT /forgot-password
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "username": "Lavish",
  "email": "lavish@example.com",
  "newpassword": "new-secret"
}
```

**Response `201 Created`**

```json
{
  "message": "successfully created..",
  "profile": {
    "username": "Lavish",
    "email": "lavish@example.com"
  }
}
```

**Errors:** `404` missing fields or user not found

### 5. Create a Post

```http
POST /create-post
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "post": "Learning Node.js and building my own API!",
  "hastags": ["nodejs", "backend"],
  "caption": "My first status update"
}
```

The `username` is taken from your token - you can't fake someone else's post.

**Response `200 OK`**

```json
{
  "message": "successfully created a Post..",
  "posting": {
    "username": "Lavish",
    "post": "Learning Node.js and building my own API!",
    "hastags": ["nodejs", "backend"],
    "caption": "My first status update",
    "_id": "66c1...",
    "createdAt": "2026-08-09T12:05:00.000Z",
    "updatedAt": "2026-08-09T12:05:00.000Z"
  }
}
```

**Errors:** `400` missing fields

### 6. Get the Feed

```http
GET /feed
Authorization: Bearer <your-token>
```

**Response `200 OK`** - an array of every post, newest and oldest together.

```json
{
  "feed": [
    {
      "username": "Rahul",
      "post": "First post here!",
      "hastags": ["hello"],
      "caption": "hi everyone",
      "_id": "66c2..."
    }
  ]
}
```

**Errors:** `404` no posts yet

### 7. Get a User's Posts

```http
GET /post-of/Lavish
Authorization: Bearer <your-token>
```

**Response `200 OK`** - all posts where `username` matches the URL parameter.

### 8. Get Your Profile + Posts

```http
GET /me
Authorization: Bearer <your-token>
```

**Response `200 OK`**

```json
{
  "myprofile": {
    "username": "Lavish",
    "email": "lavish@example.com"
  },
  "myposts": [ ... ]
}
```

---

## How Authentication Works (the whole flow)

```
User                         Server
 │  POST /signup                │
 ├─────────────────────────────►│  password hashed with bcrypt
 │  { user saved }              │
 │◄─────────────────────────────┤
 │                              │
 │  POST /login                 │
 ├─────────────────────────────►│  bcrypt.compare(password)
 │  { token }                   │  jwt.sign({ id, username }, JWT_SECRET)
 │◄─────────────────────────────┤
 │                              │
 │  POST /create-post  w/ token │
 ├─────────────────────────────►│  verifyToken middleware
 │                              │  decodes token -> req.user
 │                              │  username taken from req.user
 │  { post created }            │
 │◄─────────────────────────────┤
```

`verifyToken` (defined in `loginRoutes/login.js`) checks for a `Bearer` token in the `Authorization` header, verifies it against `JWT_SECRET`, and attaches the decoded payload to `req.user` for the route handler to use.

---

## Project Structure

```
Old-School Facebook API/
├── DataSchema/
│   ├── usersSchema.js        # User model (username, email, password)
│   └── postShema.js          # Post model (username, post, hastags, caption)
├── loginRoutes/
│   ├── signup.js             # POST /signup
│   ├── login.js              # POST /login + verifyToken middleware
│   └── forgotpass.js         # PUT /forgot-password
├── src/
│   └── post.js               # Post routes (create, feed, user posts, /me)
├── .env                      # Environment variables (gitignored)
├── .gitignore
├── package.json
└── server.js                 # Entry point - connects DB and starts server
```

---

## Testing with cURL

```bash
# 1. Sign up
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"Lavish","email":"lavish@example.com","password":"secret123"}'

# 2. Log in (copy the token from the response)
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"lavish@example.com","password":"secret123"}'

# 3. Create a post
curl -X POST http://localhost:3000/create-post \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"post":"Hello world","hastags":["first"],"caption":"hi"}'

# 4. Fetch the feed
curl http://localhost:3000/feed -H "Authorization: Bearer <TOKEN>"
```

---

## Roadmap

- [ ] **Likes** - `POST /post/:id/like` (add your username to a post's likes)
- [ ] **Comments** - `POST /post/:id/comment` and `DELETE /post/:id/comment/:commentId`
- [ ] **Delete Post** - `DELETE /post/:id` (owner only)
- [ ] **Logout / token revocation**
- [ ] Refactor likes/comments to store `ObjectId` references and use `populate()`
- [ ] Dockerize the app

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## Author

**Lavish Mehra**

- GitHub: [Lavish09-Mehra](https://github.com/Lavish09-Mehra)

---

## License

[MIT](https://opensource.org/licenses/MIT)
