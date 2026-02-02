# UniManage - Complete Structure Explanation for Beginners

## What is This Project?

UniManage is a web application that helps university students and club organizers:
1. **Browse events** organized by college clubs
2. **Register for events** they want to attend
3. **Create events** if they're organizers
4. **Book venues** for their events
5. **Check in attendees** using QR codes
6. **Get notifications** about events

## Understanding the Technology

### Next.js
Think of Next.js as a recipe book for building web pages. Instead of writing pure HTML, we use React components (reusable building blocks).

### React Components
A component is like a LEGO brick - you build it once, then use it many times.

Example:
\`\`\`tsx
// This is a component - a reusable building block
function ClubCard() {
  return <div>IEEE Club</div>;
}

// Use it 6 times in the dashboard
<ClubCard />
<ClubCard />
<ClubCard />
\`\`\`

### Tailwind CSS
Instead of writing CSS code, Tailwind lets you style elements using class names:
\`\`\`tsx
// "p-6" means add padding of 24px
// "bg-card" means use the card background color
<div className="p-6 bg-card rounded-lg">Hello</div>
\`\`\`

## Folder Organization Explained

### `/app` - All Your Pages
\`\`\`
/app
├── dashboard/page.tsx      → When user visits /dashboard
├── login/page.tsx          → When user visits /login
├── register-events/page.tsx → When user visits /register-events
\`\`\`

Think of it like a website structure:
- `dashboard/page.tsx` = the /dashboard page
- `login/page.tsx` = the /login page
- `layout.tsx` = shared structure for all pages

### `/components` - Reusable Building Blocks
\`\`\`
/components
├── club-card.tsx      → Card showing one club
├── sidebar.tsx        → Left navigation menu
├── navbar.tsx         → Top bar with user info
\`\`\`

### `/public` - Images and Files
\`\`\`
/public
├── ieee-logo.jpg      → Image of IEEE logo
├── acm-logo.jpg       → Image of ACM logo
\`\`\`

## How Pages Work

### The Dashboard Page (`app/dashboard/page.tsx`)

\`\`\`tsx
// Step 1: Import what you need
import { ClubCard } from '@/components/club-card';

// Step 2: Create the page component
export default function DashboardPage() {
  
  // Step 3: Define your data
  const clubs = [
    { id: 'ieee', name: 'IEEE', logo: '...' },
    { id: 'acm', name: 'ACM', logo: '...' },
  ];
  
  // Step 4: Return the JSX (HTML-like code)
  return (
    <div>
      <h1>Dashboard</h1>
      {clubs.map(club => (
        <ClubCard key={club.id} {...club} />
      ))}
    </div>
  );
}
\`\`\`

**What happens when a user visits `/dashboard`:**
1. Next.js reads this file
2. Runs the function
3. Returns the JSX code
4. Converts it to HTML
5. Sends HTML to browser
6. Browser displays the page

## How Components Work

### The Club Card Component (`components/club-card.tsx`)

\`\`\`tsx
// Step 1: Define what information the component needs (props)
interface ClubCardProps {
  id: string;
  name: string;
  logo: string;
}

// Step 2: Create the component function
export function ClubCard({ id, name, logo }: ClubCardProps) {
  return (
    <div className="border rounded-lg p-6">
      <img src={logo || "/placeholder.svg"} alt={name} />
      <h3>{name}</h3>
      <button>View Events</button>
    </div>
  );
}
\`\`\`

**How it's used:**
\`\`\`tsx
// Pass data to component
<ClubCard id="ieee" name="IEEE" logo="/ieee.jpg" />

// Component receives data and renders it
// Result: A card showing IEEE with its logo
\`\`\`

## State Management Explained

Some components need to remember things (like form input values).

\`\`\`tsx
'use client'; // This runs in the browser, not server

import { useState } from 'react';

export function LoginForm() {
  // "state" is how components remember things
  const [email, setEmail] = useState('');
  
  // When user types, update the email
  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  
  return (
    <input 
      value={email}
      onChange={handleChange}
      placeholder="Enter email"
    />
  );
}
\`\`\`

**The flow:**
1. User types email → handleChange runs → setEmail updates → Component re-renders → Show new value

## Styling Explained

### Tailwind Classes
\`\`\`tsx
// Space (p = padding, m = margin)
<div className="p-4">   {/* Add 16px padding */}
<div className="m-2">   {/* Add 8px margin */}
<div className="gap-6"> {/* Add 24px gap between items */}

// Size
<div className="w-full"> {/* Take full width */}
<div className="h-96">  {/* Set height to 384px */}

// Colors
<div className="bg-primary">        {/* Use primary color */}
<div className="text-foreground">   {/* Use foreground color */}
<div className="border-border">     {/* Use border color */}

// Display
<div className="flex items-center justify-between">
{/* Flexbox: arrange items in row, center vertically, space out */}

<div className="grid grid-cols-3 gap-4">
{/* Grid: 3 columns, 16px gap */}

// Responsive
<div className="text-sm md:text-base lg:text-lg">
{/* Small on mobile, medium on tablet, large on desktop */}
\`\`\`

### Color Theme
Colors are defined in `globals.css` and used throughout:
\`\`\`css
/* Define once */
:root {
  --primary: oklch(0.45 0.2 280);      /* Purple */
  --secondary: oklch(0.65 0.15 200);   /* Blue */
}

/* Use everywhere */
<button className="bg-primary text-primary-foreground">
\`\`\`

## Form Handling Explained

### A Simple Form Example
\`\`\`tsx
'use client';
import { useState } from 'react';

export function EventForm() {
  // Create state for each field
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    console.log({ eventName, date }); // Log the data
    // In real app, send to backend API here
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        placeholder="Event name"
      />
      
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      
      <button type="submit">Create Event</button>
    </form>
  );
}
\`\`\`

## Navigation Explained

### How Users Move Between Pages

\`\`\`tsx
import Link from 'next/link';

// Create a clickable link
<Link href="/dashboard">
  <a>Go to Dashboard</a>
</Link>

// When user clicks, Next.js:
// 1. Reads /app/dashboard/page.tsx
// 2. Renders that page
// 3. Updates the URL to /dashboard
// 4. Shows the new page (fast!)
\`\`\`

## The Sidebar Component

\`\`\`tsx
const menuItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Register for Events', href: '/register-events' },
  // ... more items
];

// For each item, create a link
menuItems.map(item => (
  <Link href={item.href}>
    {item.label}
  </Link>
))
\`\`\`

## Common Patterns

### 1. Displaying a List
\`\`\`tsx
const items = ['Item 1', 'Item 2', 'Item 3'];

return (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);
\`\`\`

### 2. Conditional Rendering
\`\`\`tsx
const isLoggedIn = true;

return (
  <>
    {isLoggedIn ? (
      <p>Welcome back!</p>
    ) : (
      <p>Please log in</p>
    )}
  </>
);
\`\`\`

### 3. Handling Click Events
\`\`\`tsx
const handleClick = () => {
  console.log('Button clicked!');
};

return (
  <button onClick={handleClick}>
    Click me
  </button>
);
\`\`\`

## Deployment Explained

When you're ready to share your app:

1. **Push to GitHub**
   - Create a GitHub account
   - Push your code

2. **Deploy to Vercel**
   - Go to vercel.com
   - Connect your GitHub account
   - Select your repository
   - Click Deploy
   - Your app is now live!

## Tips for Learning

1. **Start Small**: Understand one component first
2. **Read the Code**: Every file has comments explaining what it does
3. **Experiment**: Change values and see what happens
4. **Use Browser DevTools**: Press F12 to see errors
5. **Check Console**: Press F12 → Console tab to see logs

## Common Errors and Solutions

**Error: Component not found**
\`\`\`
Solution: Check import path matches actual file location
❌ import { Card } from './Card';  // Wrong
✓ import { Card } from '@/components/card';  // Correct
\`\`\`

**Error: Styles not showing**
\`\`\`
Solution: Check class names are spelled correctly
❌ className="pd-4"  // Wrong (typo)
✓ className="p-4"   // Correct
\`\`\`

**Error: Page not rendering**
\`\`\`
Solution: Make sure page exports default component
✓ export default function Page() {
    return <div>Hello</div>;
  }
\`\`\`

---

Now you're ready to explore and understand the UniManage system! Start by reading `app/dashboard/page.tsx` - it's the simplest example!
