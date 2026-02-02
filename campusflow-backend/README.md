# CampusFlow Backend

Express.js backend API for the CampusFlow event management system.

## Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database connection string
DATABASE_URL=postgres://username:password@localhost:5432/campusflow

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=7d

# Server Port (optional, defaults to 3001)
PORT=3001
```

**Example DATABASE_URL formats:**
- Local PostgreSQL: `postgres://postgres:postgres@localhost:5432/campusflow`
- macOS with default Postgres: `postgres://yourusername@localhost:5432/campusflow`
- Remote: `postgres://user:pass@host:5432/dbname`

### 3. Initialize Database

Run the schema to create all tables:

```bash
npm run init-db
```

This will:
- Create all required tables (users, clubs, venues, events, etc.)
- Seed initial venue data
- Verify database connection

**Alternative:** You can also run the SQL file directly:
```bash
psql -d your_database_name -f schema.sql
```

### 4. Start the Server

```bash
npm run dev
```

The server will start on `http://localhost:3001` (or your configured PORT).

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Events
- `GET /api/events` - List all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (requires auth, club_owner/admin role)
- `POST /api/events/:id/register` - Register for event (requires auth)

### Venues
- `GET /api/venues` - List all venues
- `GET /api/venues/:id/availability` - Check venue availability
- `POST /api/venues/:id/book` - Book venue (requires auth, club_owner/admin role)

### Registrations
- `GET /api/registrations/my` - Get user's registrations (requires auth)

### Proposals
- `POST /api/proposals` - Create proposal letter (requires auth, club_owner/admin role)

## Database Schema

The database includes the following tables:
- `users` - User accounts and authentication
- `clubs` - Club/organization information
- `venues` - Venue locations and capacity
- `events` - Event details and scheduling
- `venue_bookings` - Venue reservation records
- `event_registrations` - User event registrations
- `proposal_letters` - DSW proposal submissions
- `notifications` - User notifications

See `schema.sql` for complete schema definition.

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in requests:

```
Authorization: Bearer <your-jwt-token>
```

## Troubleshooting

### Database Connection Issues

1. **"DATABASE_URL is not set"**
   - Create a `.env` file with `DATABASE_URL` set correctly

2. **"Connection refused"**
   - Ensure PostgreSQL is running: `pg_isready` or `brew services start postgresql` (macOS)
   - Verify your connection string matches your database credentials

3. **"Database does not exist"**
   - Create the database: `createdb campusflow` (or your database name)

### JWT Errors

- Ensure `JWT_SECRET` is set in `.env`
- Token expires after the time set in `JWT_EXPIRY` (default: 7 days)

## Development

The server uses `nodemon` for auto-restart on file changes during development.

## Production

For production deployment:
1. Set strong `JWT_SECRET`
2. Use environment variables for all sensitive data
3. Enable HTTPS
4. Set up proper CORS origins
5. Use a connection pooler for PostgreSQL
6. Set up database backups

