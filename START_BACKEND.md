# How to Start the Backend Server

## Quick Start

1. **Open a terminal window**

2. **Navigate to the backend folder:**
   ```bash
   cd /Users/apple/Desktop/pbl/campusflow-backend
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

4. **You should see:**
   ```
   ✅ CAMPUSFLOW backend running on port 3001
   ✅ Connected to PostgreSQL Database
   ```

5. **Keep this terminal window open** - the server needs to keep running

6. **Now try signing up again** in your browser

## Troubleshooting

### If you see "Port 3001 already in use":
- Another instance might be running
- Find and stop it: `lsof -ti:3001 | xargs kill`
- Or use a different port by setting `PORT=3002` in `.env`

### If you see database connection errors:
- Check your `.env` file has `DATABASE_URL=postgresql://apple@localhost:5432/campusflow`
- Make sure PostgreSQL is running
- Verify the database exists: `psql -l | grep campusflow`

### If signup still fails:
- Check the terminal where the backend is running for error messages
- The error will show exactly what went wrong

