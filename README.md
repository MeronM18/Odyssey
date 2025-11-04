# Odyessia 🌍

A travel planning web application for booking flights, hotels, events, and car rentals.

## Tech Stack
- Node.js + Express (backend API)
- Supabase (database + authentication)
- PostgreSQL (via Supabase)
- HTML, CSS, Vanilla JavaScript (frontend)

## Quick Start

See [SETUP.md](SETUP.md) for detailed setup instructions.

### Option 1: Use Start Script (Windows)
```powershell
.\start.ps1
```

### Option 2: Manual Start
**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npx serve -l 3000
```

Then open: http://localhost:3000/html/index.html

**Note:** Run the SQL from `backend/database/schema.sql` in Supabase SQL Editor first.

## Features
- Google OAuth authentication
- Flight bookings
- Hotel reservations
- Event tickets
- Car rentals
- User-specific data with Row Level Security
