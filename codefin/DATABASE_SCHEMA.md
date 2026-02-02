# CAMPUSFLOW - Database Schema & Backend Setup

## Database Schema Overview

Your backend will need the following tables to support the CAMPUSFLOW event management system.

### 1. **Users Table**
\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  registration_number VARCHAR(50) UNIQUE,
  department VARCHAR(100),
  phone VARCHAR(20),
  role ENUM('student', 'club_owner', 'admin', 'dsw') DEFAULT 'student',
  club_id UUID REFERENCES clubs(id),
  is_club_president BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### 2. **Clubs Table**
\`\`\`sql
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  president_id UUID REFERENCES users(id),
  established_date DATE,
  logo_url VARCHAR(500),
  contact_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### 3. **Events Table**
\`\`\`sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  club_id UUID NOT NULL REFERENCES clubs(id),
  venue_id UUID REFERENCES venues(id),
  category VARCHAR(50),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  capacity INT,
  poster_url VARCHAR(500),
  registration_fee DECIMAL(10, 2) DEFAULT 0,
  payment_qr_code VARCHAR(500),
  approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### 4. **Venues Table**
\`\`\`sql
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  capacity INT NOT NULL,
  location VARCHAR(200),
  amenities TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert venues
INSERT INTO venues (name, capacity, location) VALUES
  ('SHARDA PAI AUDITORIUM', 350, 'Main Building'),
  ('VASANTI PAI AUDITORIUM', 500, 'West Wing'),
  ('TMA PAI AUDITORIUM', 300, 'East Wing');
\`\`\`

### 5. **Venue Bookings Table**
\`\`\`sql
CREATE TABLE venue_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id),
  event_id UUID REFERENCES events(id),
  club_id UUID NOT NULL REFERENCES clubs(id),
  booked_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  expected_attendees INT,
  special_requirements TEXT,
  approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(venue_id, booked_date, start_time, end_time)
);
\`\`\`

### 6. **Event Registrations Table**
\`\`\`sql
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id),
  user_id UUID NOT NULL REFERENCES users(id),
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  number_of_tickets INT DEFAULT 1,
  total_amount DECIMAL(10, 2),
  payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  payment_method VARCHAR(50),
  transaction_id VARCHAR(100),
  qr_code_data VARCHAR(500),
  check_in_status BOOLEAN DEFAULT FALSE,
  check_in_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, user_id)
);
\`\`\`

### 7. **Proposal Letters Table**
\`\`\`sql
CREATE TABLE proposal_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id),
  club_id UUID NOT NULL REFERENCES clubs(id),
  content TEXT NOT NULL,
  pdf_url VARCHAR(500),
  submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  dsw_approval_status ENUM('pending', 'approved', 'rejected', 'revisions_needed') DEFAULT 'pending',
  dsw_comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### 8. **Notifications Table**
\`\`\`sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  message TEXT,
  notification_type VARCHAR(50),
  related_event_id UUID REFERENCES events(id),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP
);
\`\`\`

## Key Relationships

\`\`\`
users (1) ──────── (many) event_registrations
users (1) ──────── (many) venue_bookings
users (1) ──────── (many) events (as creator)

clubs (1) ──────── (many) events
clubs (1) ──────── (many) venue_bookings
clubs (1) ──────── (many) users (as members)
clubs (1) ──────── (1) users (as president)

events (1) ──────── (many) event_registrations
events (1) ──────── (1) venue_bookings
events (1) ──────── (1) proposal_letters

venues (1) ──────── (many) venue_bookings
\`\`\`

## API Endpoints You'll Need

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (club_owner only)
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Event Registration
- `POST /api/events/:id/register` - Register for event
- `GET /api/events/:id/registrations` - Get event registrations
- `POST /api/registrations/:id/payment` - Process payment
- `POST /api/registrations/:id/qr-checkin` - Check-in via QR

### Venue Booking
- `GET /api/venues` - Get all venues
- `POST /api/venues/:id/book` - Book venue (club_owner only)
- `GET /api/venues/:id/availability` - Check availability
- `PUT /api/bookings/:id` - Update booking request

### Proposal Letters
- `POST /api/proposals` - Create proposal letter
- `GET /api/proposals/:id` - Get proposal
- `POST /api/proposals/:id/download-pdf` - Download as PDF
- `POST /api/proposals/:id/send-to-dsw` - Send to DSW email

## Email Setup

To send emails from your backend, use a service like:

### Option 1: SendGrid
\`\`\`javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'recipient@example.com',
  from: 'noreply@campusflow.app',
  subject: 'Event Registration Confirmation',
  html: `<p>You have successfully registered for the event...</p>`,
};

await sgMail.send(msg);
\`\`\`

### Option 2: Nodemailer (Gmail)
\`\`\`javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

await transporter.sendMail({
  from: 'noreply@campusflow.app',
  to: 'recipient@example.com',
  subject: 'Event Registration Confirmation',
  html: `<p>You have successfully registered for the event...</p>`,
});
\`\`\`

### Option 3: AWS SES
\`\`\`javascript
const AWS = require('aws-sdk');
const ses = new AWS.SES();

await ses.sendEmail({
  Source: 'noreply@campusflow.app',
  Destination: { ToAddresses: ['recipient@example.com'] },
  Message: {
    Subject: { Data: 'Event Registration Confirmation' },
    Body: { Html: { Data: '<p>You have successfully registered...</p>' } },
  },
}).promise();
\`\`\`

## Environment Variables Needed

\`\`\`env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/campusflow
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=campusflow

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=7d

# Email
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_sendgrid_key
EMAIL_FROM=noreply@campusflow.app

# Payment (if using payment gateway)
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# File Storage (for QR codes, PDFs)
AWS_S3_BUCKET=campusflow-bucket
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=CAMPUSFLOW
\`\`\`

## Club Owner Authentication Flow

1. **Registration**: User registers with their email
2. **Club Verification**: Admin manually marks user as `club_owner` and assigns to club
3. **Role Check**: Before creating events/booking venues, frontend checks if `role === 'club_owner'`
4. **Backend Validation**: API routes verify `req.user.role === 'club_owner'` before allowing creation

## Next Steps

1. Set up PostgreSQL database
2. Run the SQL schema to create tables
3. Set up backend framework (Node.js/Express, Python/FastAPI, etc.)
4. Implement authentication system
5. Create API endpoints
6. Set up email service
7. Integrate payment gateway if needed
8. Deploy backend
