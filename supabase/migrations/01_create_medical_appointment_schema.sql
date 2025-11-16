/*
# Create Medical Appointment Booking System Schema

## 1. New Tables

### profiles
- `id` (uuid, primary key, references auth.users)
- `username` (text, unique, not null)
- `full_name` (text)
- `phone` (text)
- `email` (text)
- `role` (user_role enum: 'patient', 'admin')
- `selected_specialty` (text) - Patient's medical specialty preference
- `created_at` (timestamptz, default: now())

### specialties
- `id` (uuid, primary key)
- `name` (text, unique, not null) - e.g., "Cardiology", "Dermatology"
- `description` (text)
- `created_at` (timestamptz, default: now())

### doctors
- `id` (uuid, primary key)
- `name` (text, not null)
- `specialty_id` (uuid, references specialties)
- `email` (text)
- `phone` (text)
- `availability` (text) - e.g., "Mon-Fri 9AM-5PM"
- `created_at` (timestamptz, default: now())

### appointments
- `id` (uuid, primary key)
- `patient_id` (uuid, references profiles, not null)
- `doctor_id` (uuid, references doctors, not null)
- `appointment_date` (date, not null)
- `appointment_time` (time, not null)
- `status` (appointment_status enum: 'pending', 'confirmed', 'cancelled', 'completed')
- `notes` (text)
- `created_at` (timestamptz, default: now())

## 2. Security

- Enable RLS on all tables
- Patients can view their own profile and appointments
- Patients can create appointments
- Patients can view all doctors
- Admins have full access to all tables
- First registered user becomes admin
- Public read access to specialties and doctors tables for non-authenticated users

## 3. Triggers

- Auto-create profile on user registration
- First user gets admin role, subsequent users get patient role

## 4. Initial Data

- Insert common medical specialties
*/

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('patient', 'admin');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text,
  phone text,
  email text,
  role user_role DEFAULT 'patient'::user_role NOT NULL,
  selected_specialty text,
  created_at timestamptz DEFAULT now()
);

-- Create specialties table
CREATE TABLE IF NOT EXISTS specialties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialty_id uuid REFERENCES specialties(id) ON DELETE SET NULL,
  email text,
  phone text,
  availability text,
  created_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status appointment_status DEFAULT 'pending'::appointment_status NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id OR is_admin(auth.uid()));

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (role = (SELECT role FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Specialties policies (public read access)
CREATE POLICY "Anyone can view specialties" ON specialties
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage specialties" ON specialties
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Doctors policies (public read access)
CREATE POLICY "Anyone can view doctors" ON doctors
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage doctors" ON doctors
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Appointments policies
CREATE POLICY "Users can view own appointments" ON appointments
  FOR SELECT USING (auth.uid() = patient_id OR is_admin(auth.uid()));

CREATE POLICY "Users can create appointments" ON appointments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update own appointments" ON appointments
  FOR UPDATE USING (auth.uid() = patient_id OR is_admin(auth.uid()));

CREATE POLICY "Admins can manage all appointments" ON appointments
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Trigger to auto-create profile on user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
  extracted_username text;
BEGIN
  -- Only insert after user is confirmed
  IF OLD IS DISTINCT FROM NULL AND OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL THEN
    -- Count existing users
    SELECT COUNT(*) INTO user_count FROM profiles;
    
    -- Extract username from email (remove @miaoda.com)
    extracted_username := REPLACE(NEW.email, '@miaoda.com', '');
    
    -- Insert profile with first user as admin
    INSERT INTO profiles (id, username, email, phone, role)
    VALUES (
      NEW.id,
      extracted_username,
      NEW.email,
      NEW.phone,
      CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'patient'::user_role END
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Insert initial specialties
INSERT INTO specialties (name, description) VALUES
  ('Cardiology', 'Heart and cardiovascular system specialists'),
  ('Dermatology', 'Skin, hair, and nail care specialists'),
  ('Orthopedics', 'Bone, joint, and muscle specialists'),
  ('Pediatrics', 'Children''s health specialists'),
  ('Neurology', 'Brain and nervous system specialists'),
  ('Ophthalmology', 'Eye care specialists'),
  ('Psychiatry', 'Mental health specialists'),
  ('General Practice', 'Primary care physicians'),
  ('Gynecology', 'Women''s reproductive health specialists'),
  ('Dentistry', 'Oral health specialists')
ON CONFLICT (name) DO NOTHING;
