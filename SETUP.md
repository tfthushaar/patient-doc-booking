# Patient Doctor Booking System - Local Development Setup

A modern medical appointment booking system built with React, TypeScript, and Supabase.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **pnpm** (v8 or higher) - Install with `npm install -g pnpm`
- **Git** - [Download](https://git-scm.com/)

## Step 1: Clone the Repository

```bash
git clone https://github.com/tfthushaar/patient-doc-booking.git
cd patient-doc-booking
```

## Step 2: Set Up Supabase Project

1. **Create a Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up for a free account
   - Create a new project

2. **Get Your Credentials**
   - Navigate to **Project Settings → API**
   - Copy your **Project URL** (Supabase URL)
   - Copy your **anon public** key (Supabase Anon Key)

3. **Run Database Migrations**
   - Go to **SQL Editor** in your Supabase dashboard
   - Open and execute the migration file: `supabase/migrations/01_create_medical_appointment_schema.sql`
   - This will create all necessary tables: `profiles`, `specialties`, `doctors`, and `appointments`

## Step 3: Configure Environment Variables

1. **Copy the Example File**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with Your Supabase Credentials**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_LOGIN_TYPE=gmail
   VITE_APP_ID=patient-doc-booking
   ```

   Replace:
   - `your-project.supabase.co` with your actual Supabase URL
   - `your-anon-key-here` with your actual Supabase anon key

## Step 4: Install Dependencies

```bash
pnpm install
```

This will install all project dependencies from the `package.json` file.

## Step 5: Run the Development Server

```bash
pnpm dev
```

The application will start on `http://localhost:5173` and automatically open in your browser.

### Dev Server Features
- **Hot Module Replacement (HMR)** - Changes reflect instantly without page reload
- **Port**: `5173` (will use another port if 5173 is busy)
- **Auto-open**: Browser opens automatically when server starts

## Step 6: Build for Production

To create a production build:

```bash
pnpm build
```

This generates optimized files in the `dist/` folder.

### Preview Production Build

```bash
pnpm preview
```

## Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production with type checking
- `pnpm preview` - Preview the production build locally
- `pnpm lint` - Run linting and type checks
- `pnpm type-check` - Check TypeScript types

## Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication components
│   │   ├── AuthProvider.tsx
│   │   ├── RequireAuth.tsx
│   │   └── ErrorBoundary.tsx
│   ├── common/            # Shared components
│   ├── ui/                # UI component library (Shadcn)
│   └── dropzone.tsx       # File upload component
├── pages/                 # Page components
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Doctors.tsx
│   ├── BookAppointment.tsx
│   ├── MyAppointments.tsx
│   ├── Profile.tsx
│   └── admin/             # Admin pages
├── db/
│   ├── supabase.ts        # Supabase client initialization
│   └── api.ts             # API functions
├── hooks/
│   ├── useAuth.ts         # Authentication hook
│   ├── use-debounce.ts
│   ├── use-mobile.ts
│   └── ...
├── lib/
│   ├── utils.ts           # Utility functions
│   └── env.ts             # Environment validation
├── types/
│   ├── index.ts
│   └── types.ts           # TypeScript type definitions
└── App.tsx                # Main app component
```

## Features

### User Features
- **User Registration & Login** - Secure authentication with Supabase
- **Browse Doctors** - Filter by specialty
- **Book Appointments** - Choose doctor and time slot
- **Manage Appointments** - View and manage your bookings
- **User Profile** - Update personal information

### Admin Features
- **Dashboard** - Overview of system statistics
- **Manage Doctors** - Add, edit, delete doctors
- **Manage Users** - View and manage patient accounts
- **Manage Appointments** - Update appointment status
- **Manage Specialties** - Manage medical specialties

## Authentication

The system uses Supabase Authentication with email/password.

### First User
- The first user to register automatically becomes an **admin**
- Admin users have access to the admin dashboard

### Login Flow
1. Enter username and password on the login page
2. System converts username to email format: `username@miaoda.com`
3. On successful login, redirected to home page
4. Session persists across page reloads

## Database Schema

### Tables
- **profiles** - User information and roles
- **specialties** - Medical specialties (e.g., Cardiology, Neurology)
- **doctors** - Doctor information linked to specialties
- **appointments** - Appointment bookings linked to doctors and patients

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically use the next available port (5174, 5175, etc.).

### Environment Variables Not Recognized
- Make sure `.env` file is in the root directory
- Check that variable names start with `VITE_`
- Restart the dev server after updating `.env`

### Supabase Connection Issues
1. Verify your Supabase URL and key are correct
2. Check that your Supabase project is active
3. Ensure your IP is not blocked by Supabase firewall
4. Try accessing the Supabase dashboard to verify credentials

### Migration Issues
- Ensure all SQL migrations have been run
- Check Supabase SQL Editor for any error messages
- Verify tables exist: `profiles`, `specialties`, `doctors`, `appointments`

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **Routing**: React Router v7
- **Forms**: React Hook Form
- **Toast Notifications**: Sonner
- **State Management**: React Context API

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- **Code Splitting** - Routes are lazy loaded
- **Image Optimization** - Uses modern formats
- **Bundle Optimization** - Tree-shaking and minification
- **Caching** - Service worker for offline support (when enabled)

## Development Tips

1. **Use Chrome DevTools** - React Developer Tools extension recommended
2. **Check Console Errors** - Browser console shows detailed error messages
3. **Use Network Tab** - Monitor API calls to Supabase
4. **TypeScript Checking** - Run `pnpm type-check` before commits

## License

MIT

## Support

For issues or questions:
1. Check this README and troubleshooting section
2. Check the project GitHub issues
3. Review Supabase documentation at [supabase.com/docs](https://supabase.com/docs)

## Next Steps

1. Set up your Supabase project following Step 2
2. Configure environment variables in Step 3
3. Install dependencies in Step 4
4. Start the dev server in Step 5

Happy coding! 🚀
