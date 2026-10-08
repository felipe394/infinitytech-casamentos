

-- Create guest_list table if not exists
CREATE TABLE IF NOT EXISTS guest_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  family TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  confirmed_count INTEGER NOT NULL DEFAULT 0,
  total_guests INTEGER NOT NULL DEFAULT 1,
  phone TEXT,
  confirmed_guests JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure column confirmed_guests exists if table was already created
ALTER TABLE guest_list ADD COLUMN IF NOT EXISTS confirmed_guests JSONB DEFAULT '[]'::jsonb;

-- Enable RLS (Row Level Security)
ALTER TABLE guest_list ENABLE ROW LEVEL SECURITY;

-- Create policies for guest_list
CREATE POLICY "Allow all for anon on guest_list" ON guest_list FOR ALL USING (true);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for messages
CREATE POLICY "Allow all for anon on messages" ON messages FOR ALL USING (true);


