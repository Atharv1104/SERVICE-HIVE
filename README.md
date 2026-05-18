

## Feature Overview

- Public landing page with Service Hive CRM branding, login/register actions, and main website link.
- JWT authentication with user registration and login.
- Role-based access control for `Admin` and `Sales User`.
- Lead management with create, read, update, and delete flows.
- Admin-only lead deletion and CSV export.
- Search by lead name or email.
- Filter leads by status and source.
- Sort leads by latest or oldest.
- Backend pagination with `skip` and `limit`.
- Debounced frontend search to reduce API calls.
- Dark mode using Tailwind CSS class strategy.
- Reusable frontend components for buttons, inputs, modal dialogs, and dashboard UI.
- Docker setup for frontend, backend, and MongoDB.
- Sample seed script for inserting demo lead data.

## Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Axios
- Lucide React

**Backend**
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcrypt
- Zod

## Project Structure

```txt
service-hive-crm/
  backend/
    scripts/
    src/
      config/
      controllers/
      middlewares/
      models/
      routes/
      utils/
      validators/
  frontend/
    src/
      components/
      hooks/
      layouts/
      pages/
      services/
      store/
      types/
      utils/
  docker-compose.yml
  explanations.md
  README.md
```

## Environment Variables

Do not commit real `.env` files. Use the provided examples as templates.

Backend:

```bash
cd backend
copy .env.example .env
```

Frontend:

```bash
cd frontend
copy .env.example .env
```

For macOS/Linux, use `cp` instead of `copy`.

## Local Setup

### 1. Backend

```bash
cd backend
npm install
npm run build
npm run dev
```

The backend runs on:

```txt
http://localhost:5000
```

Make sure MongoDB is running locally, or update `MONGODB_URI` in `backend/.env`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```txt
http://localhost:5173
```

## Docker Setup

From the root folder:

```bash
docker-compose up --build
```

Services:

- Frontend: `http://localhost`
- Backend: `http://localhost:5000`
- MongoDB: `localhost:27017`

To stop services:

```bash
docker-compose down
```

To stop services and remove database volume:

```bash
docker-compose down -v
```

## Seed Sample Leads

The backend includes a seed script that inserts 20 sample leads.

```bash
cd backend
npm run build
node scripts/seedLeads.js
```

The script removes previous demo leads with the same sample email pattern before inserting fresh data.

## API Endpoints

### Auth

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

### Leads

```txt
GET    /api/leads
GET    /api/leads/:id
POST   /api/leads
PUT    /api/leads/:id
DELETE /api/leads/:id
GET    /api/leads/export/csv
```

### Lead Query Parameters

```txt
page=1
limit=10
search=Rahul
status=Qualified
source=Instagram
sort=latest | oldest
```

Example:

```txt
GET /api/leads?page=1&limit=10&search=Rahul&status=Qualified&source=Instagram&sort=latest
```

## Role Permissions

**Admin**
- View all leads
- Create leads
- Update leads
- Delete leads
- Export filtered leads as CSV

**Sales User**
- View leads
- Create leads
- Update leads
- Cannot delete leads
- Cannot export CSV

## Validation and Error Handling

- Frontend form validation uses React Hook Form with Zod.
- Backend request validation uses Zod.
- Backend errors are handled by centralized Express middleware.
- JWT errors, validation errors, duplicate records, invalid IDs, forbidden access, and server errors return a consistent JSON response:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Useful Scripts

### Backend

```bash
npm run dev
npm run build
npm start
```

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Security Notes

- Real `.env` files are ignored by Git.
- JWT secrets should be strong and environment-specific.
- Passwords are hashed with bcrypt before saving.
- The password field is excluded from normal user queries with `select: false`.
- For production, restrict CORS to trusted frontend origins.

## Documentation

See [explanations.md](./explanations.md) for setup notes, technical explanations, debugging history, and interview-friendly reasoning.
