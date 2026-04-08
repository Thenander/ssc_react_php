# SSC React + PHP Backend

A sample-tracking app for documenting which audio samples appear in which tracks. Built with a **React + TypeScript frontend** and a **PHP Slim 4 backend** with MySQL.

The backend uses JWT for admin authentication and has protected endpoints for all write operations.

---

## Project Structure

```
ssc_react_php/
├── backend/
│   ├── config/        # Database and JWT configuration
│   ├── dbDumps/       # Schema and data dumps
│   ├── public/        # API entry point (index.php)
│   └── src/
│       ├── Controllers/   # Request handlers
│       ├── Middleware/    # JWT validation
│       └── Repositories/  # Database operations
├── frontend/
│   └── src/
│       ├── api/           # Fetch wrapper (api.ts)
│       ├── components/    # Navbar, AdminLayout, ProtectedRoute
│       ├── pages/         # Public and admin pages
│       └── types.ts       # TypeScript interfaces
└── README.md
```

---

## Prerequisites

- PHP 8.x
- MySQL (XAMPP or similar)
- Node.js & npm
- Composer

---

## Setup

### 1. Database

Create and import the schema:

```bash
mysql -u root -p < backend/dbDumps/schema.sql
```

Then create an admin user with a bcrypt-hashed password:

```sql
INSERT INTO admins (username, password) VALUES ('admin', '$2y$10$...');
```

Generate a hash with PHP:

```bash
php -r "echo password_hash('your_password', PASSWORD_BCRYPT);"
```

### 2. Backend

```bash
cd backend
composer install
```

Create a `.env` file:

```env
JWT_SECRET=your_jwt_secret_here
DB_HOST=localhost
DB_NAME=bimbodb
DB_USER=root
DB_PASSWORD=your_db_password_here
```

Start the server:

```bash
npm start
```

Runs on `http://localhost:8000`.

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

Runs on `http://localhost:3000`.

---

## Data Model

```
releases ──< tracks >──< track_samples_ref >──< samples >── sources
    │                                               │
  types                                           types
```

- **Releases** — albums, EPs, singles etc. (typed)
- **Tracks** — songs belonging to a release
- **Sources** — origin media: movies, TV series, albums, sample CDs (typed)
- **Samples** — individual audio clips from a source (typed)
- **track_samples_ref** — many-to-many join between tracks and samples
- **Types** — shared category table for releases, sources and samples

---

## API Endpoints

### Public (no auth required)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/types` | All types |
| GET | `/api/types/{category}` | Types by category (`release`, `source`, `sample`) |
| GET | `/api/releases` | All releases (sorted by year) |
| GET | `/api/releases/{id}` | Release with tracks and sample counts |
| GET | `/api/tracks` | All tracks with samples |
| GET | `/api/tracks/{id}` | Track with samples and source info |
| GET | `/api/sources` | All sources |
| GET | `/api/sources/{id}` | Source with samples |
| GET | `/api/samples` | All samples |
| GET | `/api/samples/{id}` | Sample with linked tracks |

### Protected (JWT required)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Authenticate, returns JWT |
| POST/PUT/DELETE | `/api/releases/{id?}` | Create, update, delete release |
| POST/PUT/DELETE | `/api/tracks/{id?}` | Create, update, delete track |
| POST/PUT/DELETE | `/api/sources/{id?}` | Create, update, delete source |
| POST/PUT/DELETE | `/api/samples/{id?}` | Create, update, delete sample |
| POST/DELETE | `/api/samples/{id}/tracks/{track_id}` | Attach/detach sample from track |
| POST/PUT/DELETE | `/api/types/{id?}` | Create, update, delete type |

Include the token as a Bearer header:

```
Authorization: Bearer YOUR_TOKEN
```

---

## Admin Interface

The admin UI is available at `/admin` and requires login.

| Route | Description |
|-------|-------------|
| `/admin` | Login |
| `/admin/dashboard` | Dashboard |
| `/admin/releases` | Manage releases |
| `/admin/tracks` | Manage tracks |
| `/admin/sources` | Manage sources |
| `/admin/samples` | Manage samples |
| `/admin/types` | Manage types for releases, sources and samples |

Deleting a release or source that has linked content shows a warning with the number of affected records before confirming.

---

## Local Development

From the project root:

```bash
npm install   # first time only
npm run dev
```

Starts both frontend (`localhost:3000`) and backend (`localhost:8000`) simultaneously.

---

## Deploy

### 1. Build frontend

```bash
cd frontend
npm run build
```

### 2. Upload files via SCP

Run the deploy script from the project root:

```bash
./deploy.sh
```

This builds the frontend and uploads all necessary files to the server. To deploy manually:

```bash
scp -r "/path/to/frontend/build/." user@host:public_html/cultivatedbimbo/
scp -r "/path/to/backend/src" user@host:public_html/cultivatedbimbo/
scp -r "/path/to/backend/config" user@host:public_html/cultivatedbimbo/
scp "/path/to/backend/public/index.php" user@host:public_html/cultivatedbimbo/api/
scp "/path/to/backend/public/.htaccess" user@host:public_html/cultivatedbimbo/api/
```

### 3. Install PHP dependencies on server

```bash
# SSH into server, then:
cd public_html/cultivatedbimbo
composer install --no-dev --optimize-autoloader
```

Only needed when `composer.json` or `composer.lock` has changed.

### 4. Environment variables

Create a `.env` file on the server (see `backend/.env.example`). Required variables:

```env
DB_HOST=
DB_NAME=
DB_USER=
DB_PASSWORD=
JWT_SECRET=
CORS_ORIGIN=
APP_BASE_PATH=
```

---

## Tips

- Start the **backend before** the frontend
- Verify `.env` values and MySQL connection if routes return 500
- All GET endpoints are public; all write operations require a valid JWT
- JWT tokens expire after 24 hours
