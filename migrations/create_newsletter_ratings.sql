-- Create newsletter_ratings table
CREATE TABLE IF NOT EXISTS newsletter.newsletter_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  newsletter_id UUID NOT NULL REFERENCES newsletter.newsletters(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(newsletter_id, user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_ratings_newsletter_id ON newsletter.newsletter_ratings(newsletter_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_ratings_user_id ON newsletter.newsletter_ratings(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION newsletter.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_newsletter_ratings_updated_at
  BEFORE UPDATE ON newsletter.newsletter_ratings
  FOR EACH ROW
  EXECUTE FUNCTION newsletter.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE newsletter.newsletter_ratings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read all ratings
CREATE POLICY "Users can view all ratings"
  ON newsletter.newsletter_ratings
  FOR SELECT
  USING (true);

-- Create policy to allow users to insert their own ratings
CREATE POLICY "Users can insert their own ratings"
  ON newsletter.newsletter_ratings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own ratings
CREATE POLICY "Users can update their own ratings"
  ON newsletter.newsletter_ratings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own ratings
CREATE POLICY "Users can delete their own ratings"
  ON newsletter.newsletter_ratings
  FOR DELETE
  USING (auth.uid() = user_id);

