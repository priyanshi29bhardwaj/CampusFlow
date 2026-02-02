-- CAMPUSFLOW Database Schema
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1️⃣ USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  registration_number VARCHAR(50) UNIQUE,
  department VARCHAR(100),
  role VARCHAR(50) DEFAULT 'student', -- student / club_owner / admin
  club_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2️⃣ CLUBS
CREATE TABLE IF NOT EXISTS clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  contact_email VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3️⃣ VENUES
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  capacity INTEGER,
  location VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4️⃣ EVENTS
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  venue_id UUID REFERENCES venues(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  capacity INTEGER,
  registration_fee NUMERIC(10,2) DEFAULT 0,
  payment_qr_code TEXT,
  club_id UUID REFERENCES clubs(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5️⃣ VENUE BOOKINGS
CREATE TABLE IF NOT EXISTS venue_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID REFERENCES venues(id),
  club_id UUID REFERENCES clubs(id),
  booked_start TIMESTAMPTZ NOT NULL,
  booked_end TIMESTAMPTZ NOT NULL,
  expected_attendees INTEGER,
  special_requirements TEXT,
  created_by UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6️⃣ EVENT REGISTRATIONS
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  user_id UUID REFERENCES users(id),
  number_of_tickets INTEGER DEFAULT 1,
  total_amount NUMERIC(10,2) DEFAULT 0,
  payment_method VARCHAR(50),
  transaction_id VARCHAR(255),
  payment_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7️⃣ PROPOSAL LETTERS
CREATE TABLE IF NOT EXISTS proposal_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  club_id UUID REFERENCES clubs(id),
  content TEXT,
  pdf_url TEXT,
  submitted_to VARCHAR(255),
  status VARCHAR(50) DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8️⃣ NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title VARCHAR(255),
  body TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9️⃣ SEED VENUES
INSERT INTO venues (name, capacity, location)
VALUES
  ('SHARDA PAI AUDITORIUM', 350, 'Main Building'),
  ('VASANTI PAI AUDITORIUM', 500, 'West Wing'),
  ('TMA PAI AUDITORIUM', 300, 'East Wing')
ON CONFLICT (name) DO NOTHING;
