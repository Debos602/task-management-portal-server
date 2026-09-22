# Task Management API

Backend API for a task management portal. The service is built with Express, TypeScript, PostgreSQL, and Prisma.

## Features

- Task creation, listing, filtering, sorting, updating, moving, and deletion
- Dashboard state endpoint
- PostgreSQL persistence with Prisma migrations
- Zod request validation
- CORS, cookies, rate limiting, and centralized error handling
- Cloudinary, Stripe, JWT, and OpenRouter integrations available in the project utilities

## Tech Stack

- Node.js
- TypeScript
- Express 5
- PostgreSQL
- Prisma 7
- Zod

## Requirements

- Node.js 20.19+
- npm
- PostgreSQL 14+
- Git Bash on Windows, if you want to use `Start.SH`

## Installation

Clone the repository and enter the project directory:

```bash
git clone <repository-url>
cd task-management-portal-server
```

Install dependencies:

```bash
npm install
```

Create the local environment file:

```bash
cp .env.example .env
```

Update `.env` with a valid PostgreSQL connection string:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/taskdb"
```

If the database password contains a special URL character such as `@`, URL-encode it. For example, `p@ssword` becomes `p%40ssword`.

Create the database if it does not already exist:

```bash
createdb -U postgres taskdb
```

## Run In Development

```bash
npm run dev
```

The API runs on:

```text
http://localhost:5000
```

## Build And Run Production

```bash
npm run build
npm start
```

## Windows Startup Script

After creating and configuring `.env`, run this from Git Bash:

```bash
bash Start.SH
```

The script validates the environment, installs dependencies, generates the Prisma client, applies migrations, builds TypeScript, and starts the server.

## Database Commands

```bash
npm run db:generate  # Generate Prisma Client
npm run db:migrate   # Apply committed migrations
npm run db:push      # Push the schema without creating a migration
npm run db:pull      # Pull the database schema
npm run db:studio    # Open Prisma Studio
```

## API

Base URL:

```text
http://localhost:5000/api/v1
```

### Health Check

```http
GET /
```

### Tasks

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/v1/tasks` | List tasks with filtering, sorting, and pagination |
| GET | `/api/v1/tasks/dashboard` | Get dashboard task state |
| GET | `/api/v1/tasks/:id` | Get one task |
| POST | `/api/v1/tasks` | Create a task |
| PUT | `/api/v1/tasks/:id` | Update a task |
| PATCH | `/api/v1/tasks/:id/move` | Move a task to a status and position |
| DELETE | `/api/v1/tasks/:id` | Delete a task |

### Create Task

```http
POST /api/v1/tasks
Content-Type: application/json
```

```json
{
  "title": "Prepare project documentation",
  "description": "Write the API setup guide",
  "priority": "High",
  "status": "Pending"
}
```

Valid priorities are `Low`, `Medium`, and `High`. Valid statuses are `Pending`, `In Progress`, and `Completed`.

### Update Task

```http
PUT /api/v1/tasks/1
Content-Type: application/json
```

```json
{
  "title": "Updated task title",
  "priority": "Medium",
  "status": "In Progress"
}
```

### Move Task

```http
PATCH /api/v1/tasks/1/move
Content-Type: application/json
```

```json
{
  "targetStatus": "Completed",
  "targetPosition": 0
}
```

### List Query Parameters

The task list endpoint supports:

- `search`
- `status`
- `priority`
- `page`
- `limit` (maximum 100)
- `sortBy`: `createdAt`, `updatedAt`, `title`, `priority`, or `status`
- `sortOrder`: `asc` or `desc`

Example:

```text
GET /api/v1/tasks?status=Pending&priority=High&page=1&limit=20&sortBy=createdAt&sortOrder=desc
```

## Response Format

Successful responses use this structure:

```json
{
  "success": true,
  "message": "Task retrieved successfully",
  "data": {}
}
```

List responses may also include pagination metadata in `meta`.

## Project Structure

```text
prisma/       Prisma schema and database migrations
src/
  app/         Routes, controllers, services, validation, and middleware
  config/      Environment configuration
  helpers/     External service helpers
  shared/      Shared response and utility functions
uploads/      Local uploaded files
Start.SH      Windows Git Bash startup script
```

## Postman

A ready-to-use collection is available at:

```text
Resources/task-management-postman-collection.json
```

Import this file into Postman after starting the server.

## Environment Variables

| Variable | Description |
| --- | --- |
| `NODE_ENV` | Runtime environment |
| `PORT` | API port, default `5000` |
| `FRONTEND_URL` | Allowed frontend origin |
| `DATABASE_URL` | PostgreSQL connection URL |
| `RATE_LIMIT_WINDOW_MS` | Rate-limit window in milliseconds |
| `RATE_LIMIT_MAX_REQUESTS` | Maximum requests per rate-limit window |

## License

This project is licensed under the MIT License.
