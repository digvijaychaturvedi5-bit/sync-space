# Sync Space

Sync Space is a production-ready MERN collaboration platform for college students managing group projects. It includes JWT authentication, project workspaces, task boards, file sharing, and real-time team chat with Socket.io.

## Tech Stack

- Frontend: React, Bootstrap, Axios, React Router, Socket.io Client
- Backend: Node.js, Express, Socket.io
- Database: MongoDB with Mongoose
- Authentication: JWT with bcrypt password hashing

## Project Structure

```text
sync-space/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    uploads/
    server.js
  frontend/
    public/
    src/
      components/
      pages/
      services/
      App.js
```

## Features

- User registration and login with JWT authentication
- Project space creation and joining through invite codes
- Dashboard with project counts, task progress, and recent activity
- Task board with assignment, deadlines, and status tracking
- File uploads using multer with project-based file listing
- Cloudinary-based media storage for uploaded project files
- Real-time project chat using Socket.io
- Responsive UI with reusable React components

## Backend Setup

1. Open a terminal in `backend`.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Update the environment values:

```env
PORT=8081
MONGO_URI=mongodb://127.0.0.1:27017/sync-space
JWT_SECRET=your_strong_secret
CLIENT_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=sync-space
```

5. Start the backend with `npm start`.

## Frontend Setup

1. Open a terminal in `frontend`.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Update the environment values:

```env
REACT_APP_API_URL=http://localhost:8081/api
REACT_APP_SOCKET_URL=http://localhost:8081
```

5. Start the frontend with `npm start`.

## MongoDB Setup

1. Install MongoDB Community Server locally if it is not already installed.
2. Start the MongoDB service.
3. Use the connection string `mongodb://127.0.0.1:27017/sync-space` for local development.
4. Optional: create the database manually in MongoDB Compass, or let the app create it on first connection.

## API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Projects

- `POST /api/projects/create`
- `GET /api/projects/user-projects`
- `POST /api/projects/join`
- `GET /api/projects/dashboard`
- `GET /api/projects/:id`

### Tasks

- `POST /api/tasks/create`
- `GET /api/tasks/project/:id`
- `PUT /api/tasks/update`

### Messages

- `GET /api/messages/:projectId`
- `POST /api/messages/send`

### Files

- `POST /api/files/upload`
- `GET /api/files/project/:id`

## Notes

- Uploaded files are sent to Cloudinary, so add your Cloudinary credentials in `backend/.env`.
- Real-time chat requires both frontend and backend to be running at the same time.
- For production deployment, move secrets into secure environment management and consider using cloud file storage.
