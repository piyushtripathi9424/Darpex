-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. PROFILES TABLE
-- ==========================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. VEHICLES TABLE
-- ==========================================
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    registration_number TEXT UNIQUE,
    year INTEGER,
    color TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. SERVICES TABLE
-- ==========================================
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('Cleaning', 'Protection', 'Modification')),
    description TEXT,
    price INTEGER NOT NULL,
    image_url TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 4. BOOKINGS TABLE
-- ==========================================
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    vehicle_id UUID REFERENCES vehicles(id) NOT NULL,
    date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    total_amount INTEGER NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
    payment_status TEXT DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Verified', 'Rejected')),
    transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 5. BOOKING_SERVICES TABLE (Many-to-Many)
-- ==========================================
CREATE TABLE booking_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES services(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 6. PAYMENTS TABLE
-- ==========================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) NOT NULL,
    amount INTEGER NOT NULL,
    transaction_id TEXT,
    screenshot_url TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Verified', 'Rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================
CREATE INDEX idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_status ON bookings(status);

-- ==========================================
-- UPDATED_AT TRIGGERS
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 2. Vehicles Policies
CREATE POLICY "Users can view own vehicles" ON vehicles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own vehicles" ON vehicles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vehicles" ON vehicles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own vehicles" ON vehicles FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all vehicles" ON vehicles FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 3. Services Policies
CREATE POLICY "Anyone can view active services" ON services FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage services" ON services FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 4. Bookings Policies
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all bookings" ON bookings FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update bookings" ON bookings FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 5. Booking Services Policies
CREATE POLICY "Users can view own booking services" ON booking_services FOR SELECT USING (
    EXISTS (SELECT 1 FROM bookings WHERE bookings.id = booking_services.booking_id AND bookings.user_id = auth.uid())
);
CREATE POLICY "Users can create booking services" ON booking_services FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM bookings WHERE bookings.id = booking_services.booking_id AND bookings.user_id = auth.uid())
);
CREATE POLICY "Admins can view all booking services" ON booking_services FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 6. Payments Policies
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (
    EXISTS (SELECT 1 FROM bookings WHERE bookings.id = payments.booking_id AND bookings.user_id = auth.uid())
);
CREATE POLICY "Users can insert payments" ON payments FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM bookings WHERE bookings.id = payments.booking_id AND bookings.user_id = auth.uid())
);
CREATE POLICY "Admins can view and verify payments" ON payments FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ==========================================
-- SEED DATA
-- ==========================================
INSERT INTO services (id, name, category, description, price, active) VALUES
    (uuid_generate_v4(), 'Basic Wash', 'Cleaning', 'Complete exterior hand wash and dry', 499, true),
    (uuid_generate_v4(), 'Interior Cleaning', 'Cleaning', 'Deep vacuum and interior surface wipe down', 1499, true),
    (uuid_generate_v4(), 'Full Detailing', 'Cleaning', 'Comprehensive interior and exterior detailing', 2999, true),
    (uuid_generate_v4(), 'Ceramic Coating', 'Protection', '9H Ceramic coating for long lasting shine and protection', 7999, true),
    (uuid_generate_v4(), 'Paint Protection', 'Protection', 'High quality PPF installation for ultimate paint defense', 9999, true),
    (uuid_generate_v4(), 'Custom Modification', 'Modification', 'Consultation for bespoke vehicle modifications', 0, true);
