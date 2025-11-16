import { supabase } from "./supabase";
import type {
  Profile,
  Specialty,
  Doctor,
  Appointment,
  DoctorWithSpecialty,
  AppointmentWithDetails,
  AppointmentStatus
} from "@/types/types";

// Profile APIs
export async function getCurrentUserProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
  return data;
}

export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching profiles:", error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

export async function updateProfile(id: string, updates: Partial<Profile>): Promise<boolean> {
  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("Error updating profile:", error);
    return false;
  }
  return true;
}

export async function updateUserRole(userId: string, role: 'patient' | 'admin'): Promise<boolean> {
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user role:", error);
    return false;
  }
  return true;
}

// Specialty APIs
export async function getAllSpecialties(): Promise<Specialty[]> {
  const { data, error } = await supabase
    .from("specialties")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching specialties:", error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

export async function getSpecialtyById(id: string): Promise<Specialty | null> {
  const { data, error } = await supabase
    .from("specialties")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching specialty:", error);
    return null;
  }
  return data;
}

// Doctor APIs
export async function getAllDoctors(): Promise<DoctorWithSpecialty[]> {
  const { data, error } = await supabase
    .from("doctors")
    .select(`
      *,
      specialty:specialties(*)
    `)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

export async function getDoctorsBySpecialty(specialtyId: string): Promise<DoctorWithSpecialty[]> {
  const { data, error } = await supabase
    .from("doctors")
    .select(`
      *,
      specialty:specialties(*)
    `)
    .eq("specialty_id", specialtyId)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching doctors by specialty:", error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

export async function getDoctorById(id: string): Promise<DoctorWithSpecialty | null> {
  const { data, error } = await supabase
    .from("doctors")
    .select(`
      *,
      specialty:specialties(*)
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching doctor:", error);
    return null;
  }
  return data;
}

export async function createDoctor(doctor: {
  name: string;
  specialty_id: string;
  email?: string;
  phone?: string;
  availability?: string;
}): Promise<Doctor | null> {
  const { data, error } = await supabase
    .from("doctors")
    .insert([doctor])
    .select()
    .maybeSingle();

  if (error) {
    console.error("Error creating doctor:", error);
    return null;
  }
  return data;
}

export async function deleteDoctor(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("doctors")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting doctor:", error);
    return false;
  }
  return true;
}

export async function updateDoctor(id: string, updates: Partial<Doctor>): Promise<boolean> {
  const { error } = await supabase
    .from("doctors")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("Error updating doctor:", error);
    return false;
  }
  return true;
}

// Appointment APIs
export async function createAppointment(appointment: {
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
}): Promise<Appointment | null> {
  const { data, error } = await supabase
    .from("appointments")
    .insert([{ ...appointment, status: 'pending' }])
    .select()
    .maybeSingle();

  if (error) {
    console.error("Error creating appointment:", error);
    return null;
  }
  return data;
}

export async function getMyAppointments(): Promise<AppointmentWithDetails[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("appointments")
    .select(`
      *,
      doctor:doctors(
        *,
        specialty:specialties(*)
      )
    `)
    .eq("patient_id", user.id)
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: false });

  if (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

export async function getAllAppointments(): Promise<AppointmentWithDetails[]> {
  const { data, error } = await supabase
    .from("appointments")
    .select(`
      *,
      doctor:doctors(
        *,
        specialty:specialties(*)
      ),
      patient:profiles(*)
    `)
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: false });

  if (error) {
    console.error("Error fetching all appointments:", error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<boolean> {
  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Error updating appointment status:", error);
    return false;
  }
  return true;
}

export async function deleteAppointment(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting appointment:", error);
    return false;
  }
  return true;
}
