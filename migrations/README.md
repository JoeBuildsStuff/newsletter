# Newsletter Ratings Migration

This migration creates the `newsletter_ratings` table to allow users to rate newsletters.

## Running the Migration

### Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `create_newsletter_ratings.sql`
4. Execute the SQL

### Using Supabase CLI

If you have the Supabase CLI set up:

```bash
supabase db push
```

Or manually:

```bash
psql -h your-db-host -U postgres -d postgres -f migrations/create_newsletter_ratings.sql
```

## What This Migration Does

1. Creates the `newsletter_ratings` table with:
   - `id`: UUID primary key
   - `newsletter_id`: Foreign key to newsletters table
   - `user_id`: Foreign key to auth.users table
   - `rating`: Integer between 1 and 5
   - `created_at` and `updated_at`: Timestamps
   - Unique constraint on (newsletter_id, user_id) to prevent duplicate ratings

2. Creates indexes for performance:
   - Index on `newsletter_id` for fast lookups
   - Index on `user_id` for user-specific queries

3. Sets up Row Level Security (RLS) policies:
   - Users can view all ratings
   - Users can only insert/update/delete their own ratings

4. Creates a trigger to automatically update the `updated_at` timestamp

## Features

- Users can rate newsletters from 1 to 5 stars
- Users can update their existing ratings
- Average rating and total count are displayed
- Ratings are tied to authenticated users
- Secure with RLS policies

