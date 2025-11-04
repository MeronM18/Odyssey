# Odyessia Setup Guide

## Prerequisites
- Node.js installed
- Supabase account (free tier)

## Step 1: Install Dependencies

```bash
cd Odyessia/backend
npm install
```

## Step 2: Configure Environment Variables

Create `.env` file in `backend/` directory:

```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

Get these from: Supabase Dashboard → Project Settings → API

## Step 3: Update Frontend Configuration

Edit `frontend/js/supabase.js` and replace:

```javascript
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";
```

With your actual Supabase credentials from: Dashboard → Project Settings → API

## Step 4: Set Up Google OAuth

1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add Supabase callback URL to authorized redirect URIs
4. Add Client ID and Secret to Supabase Dashboard → Authentication → Providers → Google

## Step 5: Create Database Tables

1. Go to Supabase Dashboard → SQL Editor
2. Open `backend/database/schema.sql` in your project
3. Copy all contents
4. Paste into Supabase SQL Editor
5. Click "Run" or press Ctrl+Enter

## Step 6: Start Development Server

```bash
cd backend
npm run dev
```

Server will run on http://localhost:5000

## Step 7: Open Frontend

Open `frontend/html/index.html` in a browser or use a local server:

```bash
npx serve frontend
```

## Available API Endpoints

**System**
- `GET /` - Health check
- `GET /health` - Database connection check

**User/Profile**
- `GET /api/profile/:userId` - Get user profile
- `PATCH /api/profile/:userId` - Update user profile

**Catalog**
- `GET /api/flights` - Get all available flights
- `GET /api/hotels` - Get all available hotels
- `GET /api/events` - Get all available events
- `GET /api/cars` - Get all available cars

**Bookings**
- `POST /api/bookings` - Create a booking
- `GET /api/bookings/:userId` - Get all user bookings with details
- `PATCH /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

## Frontend Functions

All functions are available globally:

```javascript
await getFlights();
await getHotels();
await getEvents();
await getCars();
await createBooking({ booking_type, flight_id, total_amount, ... });
await getUserBookings();
await updateBooking(id, { status, ... });
await deleteBooking(id);
await updateProfile({ full_name, total_budget, ... });
```

## Database Tables

All tables have Row Level Security (RLS) enabled:

- `profiles` - User profiles (users can only access their own)
- `flights` - Available flights catalog (public read access)
- `hotels` - Available hotels catalog (public read access)
- `events` - Available events catalog (public read access)
- `cars` - Available car rentals catalog (public read access)
- `bookings` - User bookings linking to catalog items (users can only access their own)

