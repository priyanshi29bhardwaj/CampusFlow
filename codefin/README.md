# UniManage - University Event & Venue Management System

A modern, responsive web application for managing university events and venue bookings built with Next.js, React, and Tailwind CSS.

## Project Overview

UniManage is a comprehensive frontend-only system that allows students and club organizers to:
- Browse and register for university events
- Create and manage events for their clubs
- Book venues for events
- Track event check-ins with QR codes
- Receive notifications about events
- Generate proposal letters for DSW approval

## Folder Structure

\`\`\`
unimanage/
├── app/                          # Next.js app router pages
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home redirect to dashboard
│   ├── globals.css              # Global styles & theme
│   ├── dashboard/
│   │   ├── page.tsx             # Main dashboard with club cards
│   │   └── layout.tsx           # Dashboard layout with sidebar
│   ├── register-events/
│   │   └── page.tsx             # Event registration form
│   ├── create-event/
│   │   └── page.tsx             # Event creation form
│   ├── venue-booking/
│   │   └── page.tsx             # Venue booking with calendar
│   ├── proposal-letter/
│   │   └── page.tsx             # Proposal letter generator
│   ├── qr-checkin/
│   │   └── page.tsx             # QR code check-in system
│   ├── notifications/
│   │   └── page.tsx             # Notifications center
│   ├── login/
│   │   └── page.tsx             # Login page
│   └── signup/
│       └── page.tsx             # Sign-up page
│
├── components/                   # Reusable components
│   ├── sidebar.tsx              # Sidebar navigation
│   ├── navbar.tsx               # Top navigation bar
│   ├── club-card.tsx            # Club card component
│   ├── calendar.tsx             # Interactive calendar
│   ├── event-registration-form.tsx
│   ├── event-creation-form.tsx
│   ├── venue-booking-form.tsx
│   ├── event-preview.tsx        # Event details display
│   ├── qr-checkin.tsx           # QR check-in interface
│   └── ui/                      # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       └── ... (other UI components)
│
├── hooks/                        # Custom React hooks
│   ├── use-mobile.tsx           # Mobile detection hook
│   └── use-toast.ts             # Toast notifications hook
│
├── lib/                         # Utility functions
│   └── utils.ts                 # Helper functions (cn for classnames)
│
├── public/                      # Static assets
│   ├── ieee-logo-professional.jpg
│   ├── acm-logo-computing.jpg
│   ├── camera-aperture-logo.jpg
│   ├── film-reel-movie-logo.jpg
│   ├── dance-movement-logo.jpg
│   └── literature-book-logo.jpg
│
├── next.config.mjs              # Next.js configuration
├── package.json                 # Project dependencies
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
\`\`\`

## Key Features

### 1. Dashboard
- View all 6 college clubs with logos
- Display statistics (Total Clubs, Active Events, Upcoming Events)
- Search functionality for clubs
- Quick access to event details

### 2. Event Management
- **Register for Events**: Browse events and register with personal details
- **Create Events**: Club organizers can create and publish events
- **Event Preview**: Detailed event information, poster, capacity, and registration button
- **Add to Calendar**: Integration-ready for Google Calendar

### 3. Venue Booking
- Interactive calendar for date selection
- List of available venues (Auditorium, Seminar Halls, Conference Rooms, Open Ground)
- Special requirements tracking
- Approval workflow integration

### 4. QR Check-In System
- Real-time attendee check-in with QR scanning
- Live statistics (Total Check-ins, Capacity, Occupancy Rate)
- Recent check-ins history table
- Demo mode for testing

### 5. Notifications
- Event registration confirmations
- Venue booking status updates
- Event reminders
- Announcement alerts
- Customizable notification preferences

### 6. Proposal Letter Generator
- Auto-fill proposal letter to DSW (Dean of Student Welfare)
- PDF download option
- Direct submission to DSW

### 7. User Authentication
- Login page with demo account
- Sign-up page with validation
- Profile dropdown with settings

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Language**: TypeScript
- **Theming**: CSS Variables (oklch color model)

## Color Theme

- **Primary**: Deep Purple (oklch 0.45 0.2 280) - Primary actions and accents
- **Secondary**: Professional Blue (oklch 0.65 0.15 200) - Secondary elements
- **Accent**: Golden Yellow (oklch 0.95 0.1 45) - Highlights and borders
- **Sidebar**: Dark Gray (oklch 0.1 0 0) - Professional navigation
- **Background**: Light Gray (oklch 0.98 0 0) - Main background
- **Destructive**: Red - Warning and error states

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Open the project in v0**
   - Click the three dots (⋯) in the top right
   - Select "Download ZIP"
   - Use the shadcn CLI command or push to GitHub

2. **For GitHub users**:
   \`\`\`bash
   git clone your-repo-url
   cd unimanage
   npm install
   \`\`\`

3. **Run locally**:
   \`\`\`bash
   npm run dev
   \`\`\`
   
   The app will be available at `http://localhost:3000`

4. **Build for production**:
   \`\`\`bash
   npm run build
   npm start
   \`\`\`

## Demo Account

- **Email**: demo@university.edu
- **Password**: demo123
- Use the "Try Demo Account" button on the login page

## Usage Guide for Beginners

### Understanding Each Page

**1. Dashboard (`/dashboard`)**
- First page students see after login
- Shows all clubs with event counts
- Statistics about total and upcoming events

**2. Register for Events (`/register-events`)**
- Fill in personal details (name, email, registration number, department)
- Select an event and number of tickets
- Receive confirmation

**3. Create Event (`/create-event`)**
- Organizers create new events
- Set date, time, venue, and capacity
- Add event poster and description

**4. Venue Booking (`/venue-booking`)**
- Interactive calendar to select booking date
- Choose from available venues
- Submit special equipment requirements
- DSW approval workflow

**5. QR Check-In (`/qr-checkin`)**
- Real-time attendee tracking
- Click "Simulate QR Scan" button for demo
- View occupancy statistics

**6. Notifications (`/notifications`)**
- View all notifications (event, booking, reminder, announcement)
- Mark as read or delete
- Customize notification preferences

**7. Proposal Letter (`/proposal-letter`)**
- Generate formal proposal for DSW
- Download as PDF
- Email directly to DSW

## Component Breakdown

### Sidebar Component (`components/sidebar.tsx`)
- Collapsible navigation menu
- 7 main navigation items
- Mobile responsive with hamburger menu
- Active route highlighting

### Navbar Component (`components/navbar.tsx`)
- Notification bell with badge
- Dark/Light mode toggle
- Profile dropdown with logout
- User initials avatar

### Calendar Component (`components/calendar.tsx`)
- Interactive month/year navigation
- Date selection
- Highlights selected date
- Shows previous/next month buttons

### Form Components
- **EventRegistrationForm**: Student registration with validation
- **EventCreationForm**: Club organizer event creation
- **VenueBookingForm**: Venue booking with date picker

## Customization Guide

### Changing Colors
Edit `app/globals.css` and update CSS variables:
\`\`\`css
:root {
  --primary: oklch(0.45 0.2 280); /* Change this value */
  --secondary: oklch(0.65 0.15 200);
  /* ... other colors ... */
}
\`\`\`

### Adding New Clubs
Edit `app/dashboard/page.tsx` clubs array:
\`\`\`tsx
const clubs = [
  {
    id: 'your-club-id',
    name: 'Your Club Name',
    logo: '/path-to-logo.jpg',
    description: 'Club description',
    eventCount: 0,
  },
];
\`\`\`

### Modifying Navigation Items
Edit `components/sidebar.tsx` menuItems array to add or remove navigation options.

## Important Notes

- This is a **frontend-only** implementation with **dummy data**
- All forms show success states but don't persist data
- Demo QR scanning simulates the real functionality
- For production, connect with a backend API
- Placeholder images are used for club logos

## Next Steps for Production

1. **Connect Backend API**: Replace dummy data with real API calls
2. **Add Authentication**: Implement real auth with JWT/Sessions
3. **Database Integration**: Add real event and venue data
4. **Payment Gateway**: For paid events (Stripe/Razorpay)
5. **Email Service**: Send real confirmation and reminder emails
6. **QR Code Generation**: Generate actual QR codes for check-in
7. **PDF Generation**: Real proposal letter PDF download
8. **User Management**: Persistent user profiles and preferences

## Deployment

The app is ready to deploy to Vercel with one click:

1. Push your code to GitHub
2. Go to vercel.com and connect your repository
3. Click "Deploy"
4. Your app will be live in seconds!

## Beginner Tips

- **Start with Dashboard**: Understand the club card structure first
- **Explore Components**: Each component is self-contained and reusable
- **Check Form Validation**: All forms have built-in validation and feedback
- **Test Responsive Design**: Resize your browser to see mobile responsiveness
- **Try Dark Mode**: Toggle the theme in the navbar

## Troubleshooting

**Page not loading?**
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh the page (Ctrl+R)
- Check browser console for errors (F12)

**Styles not applying?**
- Tailwind classes require proper spacing (e.g., `p-4` not `p-4px`)
- Check if dark mode classes are correctly applied
- Ensure globals.css is imported in layout.tsx

**Component not rendering?**
- Verify component export in correct file
- Check import paths in page files
- Ensure 'use client' directive for interactive components

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [TypeScript Guide](https://www.typescriptlang.org/docs/)
- [React Docs](https://react.dev)

## License

This project is created for educational purposes.

---

Built with ❤️ for university event management
