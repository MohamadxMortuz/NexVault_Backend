# NexVault — Backend

REST API for NexVault, a secure file sharing system built with Node.js, Express, MongoDB, and GridFS.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + GridFS (file storage)
- **Auth:** JWT (jsonwebtoken)
- **Encryption:** AES-256-CBC (Node.js crypto)
- **File Handling:** Multer (memory storage)
- **Password Hashing:** bcryptjs

---

## Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB + GridFS connection
├── controllers/
│   ├── authController.js  # Register & login logic
│   └── fileController.js  # Upload, download, delete, preview, share
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── models/
│   ├── User.js            # User schema (fullName, email, phone, password)
│   └── File.js            # File schema (GridFS ref, shareLink, encryption metadata)
├── routes/
│   ├── auth.js            # /api/auth routes
│   └── files.js           # /api/files routes
├── utils/
│   └── encryption.js      # AES-256-CBC encrypt/decrypt helpers
├── .env                   # Environment variables
└── server.js              # Entry point
```

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/nexvault
JWT_SECRET=your_generated_jwt_secret
ENCRYPTION_KEY=your_generated_32byte_encryption_key
MAX_FILE_SIZE=32212254720
NODE_ENV=development
```

> Generate secure keys using:
> ```
> node -e "const c = require('crypto'); console.log(c.randomBytes(64).toString('hex'))"
> ```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB running locally on port `27017`

### Install & Run

```bash
# Install dependencies
npm install

# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5001`

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint    | Description       | Auth Required |
|--------|-------------|-------------------|---------------|
| POST   | `/register` | Register new user | No            |
| POST   | `/login`    | Login user        | No            |

#### Register Body
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123"
}
```

#### Login Body
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Files — `/api/files`

| Method | Endpoint                  | Description                  | Auth Required |
|--------|---------------------------|------------------------------|---------------|
| POST   | `/upload`                 | Upload a file (encrypted)    | Yes           |
| GET    | `/my-files`               | Get all files of logged user | Yes           |
| DELETE | `/:id`                    | Delete a file by ID          | Yes           |
| GET    | `/download/:shareLink`    | Download file by share link  | No            |
| GET    | `/shared/:shareLink`      | Download via share link      | No            |
| GET    | `/preview/:shareLink`     | Preview file inline          | No            |
| GET    | `/info/:shareLink`        | Get file metadata            | No            |
| GET    | `/shared/meta/:shareLink` | Get file name, size, type    | No            |

> Protected routes require `Authorization: Bearer <token>` header.

---

## How Encryption Works

1. On upload, the file buffer is encrypted using **AES-256-CBC** with a random IV
2. The encrypted buffer is stored in **MongoDB GridFS**
3. The IV is stored in the GridFS file metadata
4. On download/preview, the file is fetched from GridFS, decrypted using the stored IV, and streamed to the client

---

## File Size Limit

Max upload size is `32212254720` bytes (~30 GB), configurable via `MAX_FILE_SIZE` in `.env`.
