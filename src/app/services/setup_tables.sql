

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mercado_pago_id TEXT UNIQUE,
  status TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  guest_email TEXT,
  gift_id INTEGER,
  gift_name TEXT,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create guest_list table (if not exists)
CREATE TABLE IF NOT EXISTS guest_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  family TEXT,
  status TEXT DEFAULT 'pending',
  confirmed_count INTEGER DEFAULT 0,
  total_guests INTEGER DEFAULT 1,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);



-- Enable RLS (Row Level Security)
ALTER TABLE login ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all for anon on login" ON login FOR ALL USING (true);
CREATE POLICY "Allow all for anon on guest_list" ON guest_list FOR ALL USING (true);
CREATE POLICY "Allow all for anon on payments" ON payments FOR ALL USING (true);
