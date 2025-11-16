
# Patient Doctor Booking System

This is a modern medical appointment booking system built and maintained by Thush. It enables patients to book appointments with doctors, and provides administrators with tools to manage users, doctors, and appointments efficiently.

## Features

- Patient registration and login
- Browse and filter doctors by specialty
- Book, view, and manage appointments
- User profile management
- Admin dashboard for system statistics
- Manage doctors, users, and appointments
- CSV import for bulk doctor addition
- Secure authentication and role-based access

## Technology Stack

- **Frontend:** React, TypeScript, Vite
- **UI:** Tailwind CSS, shadcn/ui
- **Backend:** Supabase (PostgreSQL, Auth)
- **Routing:** React Router

## Getting Started

### Prerequisites

- Node.js >= 20
- npm >= 10 or pnpm >= 8
- Git

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/tfthushaar/patient-doc-booking.git
    cd patient-doc-booking
    ```
2. Install dependencies:
    ```bash
    npm install
    # or
    pnpm install
    ```
3. Configure environment variables:
    - Copy `.env.example` to `.env` and fill in your Supabase credentials.
4. Run database migrations in Supabase SQL editor using `supabase/migrations/01_create_medical_appointment_schema.sql`.
5. Start the development server:
    ```bash
    npm run dev
    # or
    pnpm dev
    ```

## Project Structure

```
├── src/
│   ├── components/
│   ├── db/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── types/
│   └── App.tsx
├── public/
├── supabase/
│   └── migrations/
├── package.json
├── README.md
└── ...
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_LOGIN_TYPE=gmail
VITE_APP_ID=patient-doc-booking
```

## License

This project is proprietary and developed by Thush for medical appointment management.

---

For more details, see `SYSTEM_OVERVIEW.md` and `USER_GUIDE.md`.
