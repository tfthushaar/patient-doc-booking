# Medical Appointment Booking System - System Overview

## System Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Authentication + Real-time)
- **Routing**: React Router v6
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Date Handling**: date-fns

### Design System
- **Primary Color**: Medical Blue (#2C5F8D / HSL: 206 55% 35%)
- **Success Color**: Green (#4CAF50 / HSL: 152 50% 45%)
- **Design Philosophy**: Clean, professional, accessible
- **Responsive**: Desktop-first with mobile adaptation

## Database Schema

### Tables

#### 1. profiles
Stores user account information
- `id` (uuid, primary key, references auth.users)
- `username` (text, unique, not null)
- `full_name` (text, nullable)
- `email` (text, nullable)
- `phone` (text, nullable)
- `role` (user_role enum: 'patient' | 'admin', default: 'patient')
- `selected_specialty` (uuid, references specialties)
- `created_at` (timestamptz, default: now())

**Security**: RLS enabled
- Admins have full access
- Users can view and update their own profile (cannot change role)

#### 2. specialties
Medical specialties available in the system
- `id` (uuid, primary key, default: gen_random_uuid())
- `name` (text, unique, not null)
- `description` (text, nullable)
- `created_at` (timestamptz, default: now())

**Security**: Public read access (no RLS)

**Initial Data**: 10 specialties pre-populated:
- Cardiology, Dermatology, Orthopedics, Pediatrics, Neurology
- Ophthalmology, Psychiatry, General Practice, Gynecology, Dentistry

#### 3. doctors
Doctor profiles and information
- `id` (uuid, primary key, default: gen_random_uuid())
- `name` (text, not null)
- `specialty_id` (uuid, references specialties)
- `email` (text, nullable)
- `phone` (text, nullable)
- `availability` (text, nullable)
- `created_at` (timestamptz, default: now())

**Security**: Public read access (no RLS)

#### 4. appointments
Patient appointment bookings
- `id` (uuid, primary key, default: gen_random_uuid())
- `patient_id` (uuid, references profiles, not null)
- `doctor_id` (uuid, references doctors, not null)
- `appointment_date` (date, not null)
- `appointment_time` (time, not null)
- `status` (appointment_status enum: 'pending' | 'confirmed' | 'cancelled' | 'completed', default: 'pending')
- `notes` (text, nullable)
- `created_at` (timestamptz, default: now())

**Security**: RLS enabled
- Admins have full access
- Patients can view their own appointments
- Patients can create new appointments
- Patients can update their own pending appointments

### Database Functions

#### is_admin(uid uuid)
Helper function to check if a user is an administrator
- Returns: boolean
- Security: SECURITY DEFINER

### Database Triggers

#### on_auth_user_created
Automatically creates a profile when a new user signs up
- First user gets 'admin' role
- Subsequent users get 'patient' role

## Authentication System

### Login Method
- **Username + Password** authentication
- Usernames are converted to email format: `{username}@miaoda.com`
- Email verification is disabled for seamless login

### User Roles
1. **Patient** (default)
   - Book appointments
   - View own appointments
   - Update profile
   - Browse doctors

2. **Admin** (first registered user)
   - All patient permissions
   - Manage doctors (add, edit, delete, CSV import)
   - Manage users (view, change roles)
   - View all appointments
   - Update appointment statuses

### Route Protection
- Public routes: `/`, `/login`, `/doctors`
- Protected routes: All other routes require authentication
- Admin routes: `/admin/*` require admin role

## Application Features

### Patient Interface

#### Home Page
- Hero section with call-to-action
- Feature highlights
- Quick access to main functions

#### Doctor Listing
- Search by doctor name
- Filter by specialty
- View doctor details
- Book appointment button

#### Appointment Booking
- Select date and time
- Add notes for doctor
- View doctor information
- Validation for past dates

#### My Appointments
- View all appointments
- Filter by status
- Cancel pending appointments
- See appointment details

#### Profile Management
- Update personal information
- Select preferred specialty
- View account details

### Admin Interface

#### Admin Dashboard
- System statistics overview
- Quick action buttons
- Recent activity feed

#### Doctor Management
- Add doctors manually
- Import doctors via CSV
- Edit doctor information
- Delete doctors
- View all doctors in table format

#### User Management
- View all users
- Promote users to admin
- Revoke admin privileges
- View user details

#### Appointment Management
- View all appointments
- Filter by status
- Update appointment status
- View patient and doctor details

## API Functions

### Authentication
- `useAuth()` - Hook for accessing auth state
- `useAuthContext()` - Context for user, profile, and admin status

### Database Operations

#### Profiles
- `getProfile(userId)` - Get user profile
- `updateProfile(userId, data)` - Update profile
- `getAllProfiles()` - Get all users (admin)
- `updateUserRole(userId, role)` - Change user role (admin)

#### Specialties
- `getAllSpecialties()` - Get all medical specialties

#### Doctors
- `getAllDoctors()` - Get all doctors
- `getDoctorById(doctorId)` - Get single doctor
- `createDoctor(data)` - Add new doctor (admin)
- `updateDoctor(doctorId, data)` - Update doctor (admin)
- `deleteDoctor(doctorId)` - Delete doctor (admin)

#### Appointments
- `getMyAppointments()` - Get current user's appointments
- `getAllAppointments()` - Get all appointments (admin)
- `createAppointment(data)` - Book new appointment
- `updateAppointmentStatus(appointmentId, status)` - Update status

## File Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthProvider.tsx      # Authentication context provider
│   │   └── RequireAuth.tsx       # Route protection component
│   ├── common/
│   │   └── Header.tsx            # Main navigation header
│   └── ui/                       # shadcn/ui components
├── db/
│   ├── api.ts                    # Database API functions
│   └── supabase.ts               # Supabase client setup
├── hooks/
│   └── useAuth.ts                # Authentication hook
├── pages/
│   ├── Home.tsx                  # Landing page
│   ├── Login.tsx                 # Login/Register page
│   ├── Doctors.tsx               # Doctor listing
│   ├── BookAppointment.tsx       # Appointment booking
│   ├── MyAppointments.tsx        # User appointments
│   ├── Profile.tsx               # User profile
│   └── admin/
│       ├── AdminDashboard.tsx    # Admin overview
│       ├── ManageDoctors.tsx     # Doctor management
│       ├── ManageUsers.tsx       # User management
│       └── AllAppointments.tsx   # Appointment management
├── types/
│   └── types.ts                  # TypeScript interfaces
├── App.tsx                       # Main app component
├── routes.tsx                    # Route configuration
└── index.css                     # Global styles & design tokens

supabase/
└── migrations/
    └── 01_create_medical_appointment_schema.sql

public/
└── sample-doctors.csv            # Sample CSV for import
```

## CSV Import Format

For bulk doctor import, use the following CSV format:

```csv
name,specialty,email,phone,availability
Dr. John Smith,Cardiology,john@example.com,555-0101,Mon-Fri 9AM-5PM
```

**Required columns**: name, specialty
**Optional columns**: email, phone, availability
**Note**: Specialty names must match existing specialties exactly (case-insensitive)

## Environment Variables

```env
VITE_APP_ID=app-7llbr06vytc1
VITE_SUPABASE_URL=https://bpffccnaugjcxdkaxwti.supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
VITE_LOGIN_TYPE=gmail
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

## Security Considerations

1. **Row Level Security (RLS)**: Enabled on profiles and appointments tables
2. **Role-Based Access**: Admin functions protected at database and UI level
3. **Input Validation**: All forms validate user input
4. **SQL Injection Prevention**: Using Supabase parameterized queries
5. **Authentication**: Secure token-based authentication via Supabase

## Future Enhancements

Potential features for future development:
- Email notifications for appointments
- SMS reminders
- Doctor availability calendar
- Online payment integration
- Patient medical history
- Prescription management
- Video consultation support
- Multi-language support
- Advanced search filters
- Appointment rescheduling
- Doctor ratings and reviews

## Support and Maintenance

For system maintenance:
1. Regular database backups via Supabase
2. Monitor error logs in Supabase dashboard
3. Review user feedback for improvements
4. Update dependencies regularly
5. Test new features in development environment first

## License

This project is proprietary software developed for medical appointment management.
