export type UserRole = 'patient' | 'admin';
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  role: UserRole;
  selected_specialty: string | null;
  created_at: string;
}

export interface Specialty {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty_id: string | null;
  email: string | null;
  phone: string | null;
  availability: string | null;
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  notes: string | null;
  created_at: string;
}

export interface DoctorWithSpecialty extends Doctor {
  specialty?: Specialty;
}

export interface AppointmentWithDetails extends Appointment {
  doctor?: DoctorWithSpecialty;
  patient?: Profile;
}
