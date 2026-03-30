# SSC React + PHP Backend

This project contains a **React frontend** and a **PHP Slim backend** with MySQL.  
The backend uses JWT for admin login and has protected endpoints for POST/PUT/DELETE operations.

---

## Project Structure

```
ssc_react_php/
├── backend/       # PHP Slim API
│   ├── public/    # Entrypoint for API (index.php)
│   ├── src/       # Controllers, Middleware, Repositories
│   └── config/    # Database and JWT configuration
├── frontend/      # React frontend
└── .gitignore
```

---

## Prerequisites

- PHP 8.x
- MySQL (XAMPP or similar)
- Node.js & npm
- Composer

---

## Step 1: Backend

1. **Clone the repo and go to backend:**

```bash
cd ssc_react_php/backend
```

2. **Install dependencies:**

```bash
composer install
```

3. **Create a .env file in the backend folder**  
   Example `.env`:

```env
JWT_SECRET=your_jwt_secret_here

DB_HOST=localhost
DB_NAME=database_name
DB_USER=root
DB_PASSWORD=your_db_password_here
```

4. **Start the backend server:**

```bash
npm start
```

Default URL: `http://localhost:8000`

---

## Step 2: Database

# TODO

1. Create the database `bimbodb` (if not already created):

```sql
CREATE DATABASE bimbodb CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

2. Import tables (example):

- `admins`
- `releases`
- `tracks`
- `sources`
- `samples`
- `track_samples_ref`

> Tip: Create an admin account with a hashed password using PHP (`password_hash`).

---

## Step 3: Frontend

1. Go to the frontend folder:

```bash
cd ../frontend
```

2. Install npm packages:

```bash
npm install
```

3. Start React:

```bash
npm start
```

Default URL: `http://localhost:3000`  
The frontend can now fetch from the backend via `fetch('http://localhost:8000/api/...')`.

> Note: The backend must have **CORS enabled** (already configured in `index.php`).

---

## Step 4: Test the API

- **Test root endpoint:**  
  `GET http://localhost:8000/api/test`

- **Get tracks:**  
  `GET http://localhost:8000/api/tracks`

- **Admin login:**  
  `POST http://localhost:8000/api/auth/login`  
  Request JSON body:

```json
{
  "username": "admin",
  "password": "secret123"
}
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- **Create track (requires token):**  
  `POST http://localhost:8000/api/tracks`  
  Header:

```
Authorization: Bearer YOUR_TOKEN
```

Request JSON body:

```json
{
  "title": "New Track",
  "release_id": 1,
  "type": 1
}
```

---

## Step 5: Structure and further development

- Backend:
  - `Controllers` – handles routes
  - `Repositories` – database operations
  - `Middleware` – JWT + CORS
- Frontend:
  - React components + fetch calls to API
  - Store JWT in `localStorage` for admin-protected calls

---

## Tips

- Always start the **backend first**, then the frontend
- Clear `composer cache` or `npm cache` if packages misbehave
- Verify `.env` and PDO connection before calling routes
- All POST/PUT/DELETE endpoints must be **protected with JWT**
- GET endpoints are open for read-only access
