-- Convert newsletter_ratings to newsletter_likes
-- Drop the old table and create a new likes table

-- Drop the old ratings table
DROP TABLE IF EXISTS newsletter.newsletter_ratings CASCADE;

-- Create newsletter_likes table (simpler - just tracks which users liked which newsletters)
CREATE TABLE IF NOT EXISTS newsletter.newsletter_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  newsletter_id UUID NOT NULL REFERENCES newsletter.newsletters(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(newsletter_id, user_id)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_likes_newsletter_id ON newsletter.newsletter_likes(newsletter_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_likes_user_id ON newsletter.newsletter_likes(user_id);

-- Enable Row Level Security
ALTER TABLE newsletter.newsletter_likes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read all likes
CREATE POLICY "Users can view all likes"
  ON newsletter.newsletter_likes
  FOR SELECT
  USING (true);

-- Create policy to allow users to insert their own likes
CREATE POLICY "Users can insert their own likes"
  ON newsletter.newsletter_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own likes
CREATE POLICY "Users can delete their own likes"
  ON newsletter.newsletter_likes
  FOR DELETE
  USING (auth.uid() = user_id);

