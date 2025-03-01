-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    points INTEGER NOT NULL DEFAULT 1000,
    points_spent INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Distributions table
CREATE TABLE distributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Items table
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    points INTEGER NOT NULL,
    owner_id UUID REFERENCES auth.users(id),
    status TEXT NOT NULL DEFAULT 'available'
        CHECK (status IN ('available', 'claimed', 'archived')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Create policies for items table
CREATE POLICY "Users can view all items" 
    ON items FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Users can create their own items" 
    ON items FOR INSERT 
    TO authenticated 
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own items" 
    ON items FOR UPDATE 
    TO authenticated 
    USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own items" 
    ON items FOR DELETE 
    TO authenticated 
    USING (owner_id = auth.uid());

-- Item allocations table
CREATE TABLE item_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    distribution_id UUID REFERENCES distributions(id),
    points_allocated INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(item_id, user_id, distribution_id)
);

-- Comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_distributions_updated_at
    BEFORE UPDATE ON distributions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_item_allocations_updated_at
    BEFORE UPDATE ON item_allocations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_items_distribution_id ON items(distribution_id);
CREATE INDEX idx_item_allocations_distribution_id ON item_allocations(distribution_id);
CREATE INDEX idx_item_allocations_user_id ON item_allocations(user_id);
CREATE INDEX idx_comments_item_id ON comments(item_id);

-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
    ON users FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Distributions policies
CREATE POLICY "Users can view all distributions"
    ON distributions FOR SELECT
    USING (true);

CREATE POLICY "Admins can create distributions"
    ON distributions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Item allocations policies
CREATE POLICY "Users can view their allocations"
    ON item_allocations FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create their allocations"
    ON item_allocations FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Comments policies
CREATE POLICY "Users can view all comments"
    ON comments FOR SELECT
    USING (true);

CREATE POLICY "Users can create comments"
    ON comments FOR INSERT
    WITH CHECK (user_id = auth.uid());
