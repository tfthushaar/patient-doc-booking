-- =========================================
-- 1. ENUM TYPES
-- =========================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('patient', 'admin');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
    CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
  END IF;
END$$;

-- =========================================
-- 2. TABLES
-- =========================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text,
  phone text,
  email text,
  role user_role NOT NULL DEFAULT 'patient',
  selected_specialty uuid REFERENCES public.specialties(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- specialties
CREATE TABLE IF NOT EXISTS public.specialties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- doctors
CREATE TABLE IF NOT EXISTS public.doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialty_id uuid REFERENCES public.specialties(id) ON DELETE SET NULL,
  email text,
  phone text,
  availability text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- appointments
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status appointment_status NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- =========================================
-- 3. RLS
-- =========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Optional but safer: force RLS
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.specialties FORCE ROW LEVEL SECURITY;
ALTER TABLE public.doctors FORCE ROW LEVEL SECURITY;
ALTER TABLE public.appointments FORCE ROW LEVEL SECURITY;

-- =========================================
-- 4. HELPER: is_admin()
-- =========================================

CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = uid
      AND p.role = 'admin'
  );
$$;

-- =========================================
-- 5. POLICIES
-- =========================================

-- PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins have full access to profiles"
ON public.profiles
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- SPECIALTIES (public read)
DROP POLICY IF EXISTS "Anyone can view specialties" ON public.specialties;
DROP POLICY IF EXISTS "Admins can manage specialties" ON public.specialties;

CREATE POLICY "Anyone can view specialties"
ON public.specialties
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can manage specialties"
ON public.specialties
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- DOCTORS (public read)
DROP POLICY IF EXISTS "Anyone can view doctors" ON public.doctors;
DROP POLICY IF EXISTS "Admins can manage doctors" ON public.doctors;

CREATE POLICY "Anyone can view doctors"
ON public.doctors
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can manage doctors"
ON public.doctors
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- APPOINTMENTS
DROP POLICY IF EXISTS "Users can view own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can manage all appointments" ON public.appointments;

CREATE POLICY "Users can view own appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (patient_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Users can create appointments"
ON public.appointments
FOR INSERT
TO authenticated
WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Users can update own appointments"
ON public.appointments
FOR UPDATE
TO authenticated
USING (patient_id = auth.uid() OR public.is_admin(auth.uid()))
WITH CHECK (patient_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all appointments"
ON public.appointments
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- =========================================
-- 6. TRIGGER: AUTO-CREATE PROFILE, FIRST USER = ADMIN
-- =========================================

-- We hook into auth.users AFTER INSERT (simpler & works fine for Supabase)

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  user_count int;
  username text;
  is_first boolean;
BEGIN
  -- Count existing profiles
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  is_first := (user_count = 0);

  -- Extract username from email before "@"
  IF NEW.email IS NOT NULL THEN
    username := split_part(NEW.email, '@', 1);
  ELSE
    username := gen_random_uuid()::text;
  END IF;

  INSERT INTO public.profiles (id, username, email, role)
  VALUES (
    NEW.id,
    username,
    NEW.email,
    CASE WHEN is_first THEN 'admin'::user_role ELSE 'patient'::user_role END
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- =========================================
-- 7. INITIAL DATA: SPECIALTIES
-- =========================================

INSERT INTO public.specialties (name, description) VALUES
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
