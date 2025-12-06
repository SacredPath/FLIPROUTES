-- FlipRoutes Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company TEXT,
  phone TEXT,
  address TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'at_port', 'delivered', 'failed')),
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  eta DATE,
  carrier TEXT,
  container TEXT,
  vessel TEXT,
  voyage TEXT,
  weight DECIMAL,
  volume DECIMAL,
  value DECIMAL,
  cargo_type TEXT,
  special_instructions TEXT,
  progress INTEGER DEFAULT 0,
  customer_id UUID REFERENCES users(id),
  shipper_name TEXT,
  consignee_name TEXT,
  port_of_loading TEXT,
  port_of_discharge TEXT,
  bill_of_lading TEXT,
  customs_status TEXT,
  insurance TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tracking events table
CREATE TABLE IF NOT EXISTS tracking_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  location TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  shipment_id UUID REFERENCES shipments(id),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quote requests table
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_type TEXT NOT NULL CHECK (service_type IN ('trucking', 'air_freight', 'ocean_freight', 'customs', 'warehousing')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  cargo_type TEXT,
  weight TEXT,
  dimensions TEXT,
  volume TEXT,
  value TEXT,
  container_type TEXT,
  special_requirements TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'accepted', 'rejected')),
  quote_amount DECIMAL,
  quote_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact forms table
CREATE TABLE IF NOT EXISTS contact_forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shipments_customer_id ON shipments(customer_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_tracking_events_shipment_id ON tracking_events(shipment_id);
CREATE INDEX IF NOT EXISTS idx_documents_shipment_id ON documents(shipment_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_email ON quote_requests(email);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_contact_forms_email ON contact_forms(email);
CREATE INDEX IF NOT EXISTS idx_contact_forms_status ON contact_forms(status);

-- Create RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_forms ENABLE ROW LEVEL SECURITY;

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, company, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'company', NULL),
    'customer'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    company = COALESCE(EXCLUDED.company, users.company),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile when auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Shipments policies
CREATE POLICY "Users can view own shipments" ON shipments
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Users can create own shipments" ON shipments
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update own shipments" ON shipments
  FOR UPDATE USING (auth.uid() = customer_id);

CREATE POLICY "Admins can view all shipments" ON shipments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Tracking events policies
CREATE POLICY "Users can view tracking events for own shipments" ON tracking_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM shipments 
      WHERE shipments.id = tracking_events.shipment_id 
      AND shipments.customer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all tracking events" ON tracking_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Documents policies
CREATE POLICY "Users can view documents for own shipments" ON documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM shipments 
      WHERE shipments.id = documents.shipment_id 
      AND shipments.customer_id = auth.uid()
    )
  );

-- Support tickets policies
CREATE POLICY "Users can view own tickets" ON support_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets" ON support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all tickets" ON support_tickets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Quote requests policies
CREATE POLICY "Users can view own quote requests" ON quote_requests
  FOR SELECT USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Anyone can create quote requests" ON quote_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all quote requests" ON quote_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Contact forms policies
CREATE POLICY "Users can view own contact forms" ON contact_forms
  FOR SELECT USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Anyone can create contact forms" ON contact_forms
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all contact forms" ON contact_forms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Insert sample data
INSERT INTO users (id, email, full_name, company, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@fliproutes.com', 'Admin User', 'FlipRoutes', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'john.doe@company.com', 'John Doe', 'Tech Corp', 'customer'),
  ('00000000-0000-0000-0000-000000000003', 'sarah.smith@logistics.com', 'Sarah Smith', 'Logistics Inc', 'customer'),
  ('00000000-0000-0000-0000-000000000004', 'mike.johnson@import.com', 'Mike Johnson', 'Import Co', 'customer');

INSERT INTO shipments (id, tracking_number, status, origin, destination, eta, carrier, container, progress, value, customer_id, cargo_type) VALUES
  ('11111111-1111-1111-1111-111111111111', 'FLIP123456789', 'in_transit', 'Shanghai, China', 'Los Angeles, CA', '2024-01-15', 'Maersk', 'MAEU-1234567', 65, 45000, '00000000-0000-0000-0000-000000000002', 'Electronics'),
  ('22222222-2222-2222-2222-222222222222', 'FLIP987654321', 'at_port', 'Rotterdam, Netherlands', 'New York, NY', '2024-01-20', 'MSC', 'MSCU-9876543', 25, 32500, '00000000-0000-0000-0000-000000000003', 'Machinery'),
  ('33333333-3333-3333-3333-333333333333', 'FLIP456789123', 'delivered', 'Hamburg, Germany', 'Miami, FL', '2024-01-10', 'Hapag-Lloyd', 'HLBU-4567890', 100, 28750, '00000000-0000-0000-0000-000000000004', 'Textiles');

INSERT INTO tracking_events (shipment_id, event_type, location, description, icon) VALUES
  -- Shipment 1: FLIP123456789 (in_transit) - Multi-step journey
  ('11111111-1111-1111-1111-111111111111', 'pickup', 'Shanghai Port, China', 'Container picked up and loaded onto vessel Maersk Sealand', '📦'),
  ('11111111-1111-1111-1111-111111111111', 'in_transit', 'East China Sea', 'Vessel departed Shanghai Port - Beginning ocean journey', '🚢'),
  ('11111111-1111-1111-1111-111111111111', 'in_transit', 'Pacific Ocean - Midway Point', 'Vessel crossing Pacific Ocean - 30% of journey complete', '🌊'),
  ('11111111-1111-1111-1111-111111111111', 'in_transit', 'Pacific Ocean - Near Hawaii', 'Vessel passing near Hawaii - 60% of journey complete', '🌊'),
  ('11111111-1111-1111-1111-111111111111', 'in_transit', 'Pacific Ocean - Approaching US Coast', 'Vessel approaching US West Coast - 85% of journey complete', '🌊'),
  ('11111111-1111-1111-1111-111111111111', 'at_port', 'Los Angeles Port, CA', 'Vessel arrived at Los Angeles Port - Awaiting berth assignment', '⚓'),
  ('11111111-1111-1111-1111-111111111111', 'in_transit', 'Los Angeles Port - Terminal', 'Container unloaded from vessel and moved to terminal', '📦'),
  ('11111111-1111-1111-1111-111111111111', 'in_transit', 'Los Angeles Customs', 'Customs clearance in progress - Documents under review', '📋'),
  -- Shipment 2: FLIP987654321 (at_port)
  ('22222222-2222-2222-2222-222222222222', 'pickup', 'Rotterdam Port, Netherlands', 'Container loaded onto vessel MSC', '📦'),
  ('22222222-2222-2222-2222-222222222222', 'in_transit', 'North Sea', 'Vessel departed Rotterdam Port', '🚢'),
  ('22222222-2222-2222-2222-222222222222', 'in_transit', 'Atlantic Ocean', 'Vessel crossing Atlantic Ocean', '🌊'),
  ('22222222-2222-2222-2222-222222222222', 'at_port', 'New York Port', 'Vessel arrived at New York Port', '⚓'),
  -- Shipment 3: FLIP456789123 (delivered)
  ('33333333-3333-3333-3333-333333333333', 'pickup', 'Hamburg Port, Germany', 'Container loaded onto vessel Hapag-Lloyd', '📦'),
  ('33333333-3333-3333-3333-333333333333', 'in_transit', 'North Sea', 'Vessel departed Hamburg Port', '🚢'),
  ('33333333-3333-3333-3333-333333333333', 'in_transit', 'Atlantic Ocean', 'Vessel crossing Atlantic Ocean', '🌊'),
  ('33333333-3333-3333-3333-333333333333', 'at_port', 'Miami Port', 'Vessel arrived at Miami Port', '⚓'),
  ('33333333-3333-3333-3333-333333333333', 'in_transit', 'Miami Port', 'Container unloaded from vessel', '📦'),
  ('33333333-3333-3333-3333-333333333333', 'in_transit', 'Miami Customs', 'Customs clearance completed', '✅'),
  ('33333333-3333-3333-3333-333333333333', 'out_for_delivery', 'Miami Distribution Center', 'Shipment out for final delivery', '🚚'),
  ('33333333-3333-3333-3333-333333333333', 'delivered', 'Miami, FL', 'Shipment delivered successfully to consignee', '✅'); 