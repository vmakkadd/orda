# ORDA

Coffee shop ordering application built with:

- Next.js 16
- React 19
- TypeScript
- Supabase
- Zustand

## Features

- Browse products
- Cart management
- Checkout
- Order tracking
- Admin dashboard

## Setup

1. Clone repository

2. Install dependencies

npm install

3. Create .env.local

NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

4. Run

npm run dev

## Database

Run:

supabase-schema.sql

inside Supabase SQL Editor.

## Project Structure

app/
components/
lib/services/
store/
types/
