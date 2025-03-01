-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_point_allocation_insert ON point_allocations;
DROP FUNCTION IF EXISTS update_user_points();

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view distributions" ON distributions;
DROP POLICY IF EXISTS "Admin users can create distributions" ON distributions;
DROP POLICY IF EXISTS "Admin users can update distributions" ON distributions;
DROP POLICY IF EXISTS "Anyone can view items" ON items;
DROP POLICY IF EXISTS "Users can create items" ON items;
DROP POLICY IF EXISTS "Users can update their own items" ON items;
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Anyone can create notifications" ON notifications;
DROP POLICY IF EXISTS "Users can view point allocations" ON point_allocations;
DROP POLICY IF EXISTS "Users can create point allocations" ON point_allocations;
DROP POLICY IF EXISTS "Users can view item allocations" ON item_allocations;
DROP POLICY IF EXISTS "Admin users can create item allocations" ON item_allocations;

-- Drop existing tables in correct order (child tables with foreign keys first)
DROP TABLE IF EXISTS item_allocations;
DROP TABLE IF EXISTS point_allocations;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS distributions;

-- Create Tables
CREATE TABLE IF NOT EXISTS distributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  end_date TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  value INTEGER NOT NULL,
  image_url TEXT,
  distribution_id UUID REFERENCES distributions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  owner_id UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS point_allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  target_user_id UUID REFERENCES auth.users(id),
  points INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS item_allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES items(id),
  user_id UUID REFERENCES auth.users(id),
  distribution_id UUID REFERENCES distributions(id),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_allocations ENABLE ROW LEVEL SECURITY;

-- Create Policies

-- Distributions Policies
CREATE POLICY "Anyone can view distributions" ON distributions
  FOR SELECT USING (true);

CREATE POLICY "Admin users can create distributions" ON distributions
  FOR INSERT WITH CHECK (
    (SELECT raw_user_meta_data->>'is_admin' FROM auth.users WHERE id = auth.uid())::boolean = true
  );

CREATE POLICY "Admin users can update distributions" ON distributions
  FOR UPDATE USING (
    (SELECT raw_user_meta_data->>'is_admin' FROM auth.users WHERE id = auth.uid())::boolean = true
  );

-- Items Policies
CREATE POLICY "Anyone can view items" ON items
  FOR SELECT USING (true);

CREATE POLICY "Users can create items" ON items
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own items" ON items
  FOR UPDATE USING (auth.uid() = owner_id);

-- Notifications Policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Point Allocations Policies
CREATE POLICY "Users can view point allocations" ON point_allocations
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = target_user_id);

CREATE POLICY "Users can create point allocations" ON point_allocations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Item Allocations Policies
CREATE POLICY "Users can view item allocations" ON item_allocations
  FOR SELECT USING (true);

CREATE POLICY "Admin users can create item allocations" ON item_allocations
  FOR INSERT WITH CHECK (
    (SELECT raw_user_meta_data->>'is_admin' FROM auth.users WHERE id = auth.uid())::boolean = true
  );

-- Create Function for User Points
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET raw_user_meta_data = 
    CASE 
      WHEN raw_user_meta_data IS NULL THEN 
        jsonb_build_object('points', NEW.points)
      ELSE
        raw_user_meta_data || jsonb_build_object('points', 
          (COALESCE((raw_user_meta_data->>'points')::int, 0) + NEW.points))
    END
  WHERE id = NEW.target_user_id;
  
  -- Update points spent for the sender
  UPDATE auth.users
  SET raw_user_meta_data = 
    raw_user_meta_data || jsonb_build_object('points_spent', 
      (COALESCE((raw_user_meta_data->>'points_spent')::int, 0) + NEW.points))
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create Trigger for Point Allocations
CREATE TRIGGER on_point_allocation_insert
AFTER INSERT ON point_allocations
FOR EACH ROW
EXECUTE FUNCTION update_user_points();
