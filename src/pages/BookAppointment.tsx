import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDoctorById, createAppointment } from "@/db/api";
import { useAuthContext } from "@/components/auth/AuthProvider";
import type { DoctorWithSpecialty } from "@/types/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calendar, Clock, User, Mail, Phone, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookAppointment() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [doctor, setDoctor] = useState<DoctorWithSpecialty | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (doctorId) {
      loadDoctor();
    }
  }, [doctorId]);

  async function loadDoctor() {
    if (!doctorId) return;
    setLoading(true);
    const data = await getDoctorById(doctorId);
    setDoctor(data);
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !doctorId) {
      toast.error("You must be logged in to book an appointment");
      navigate("/login");
      return;
    }

    if (!appointmentDate || !appointmentTime) {
      toast.error("Please select both date and time");
      return;
    }

    const selectedDate = new Date(appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error("Cannot book appointments in the past");
      return;
    }

    setSubmitting(true);

    const result = await createAppointment({
      patient_id: user.id,
      doctor_id: doctorId,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      notes: notes || undefined
    });

    setSubmitting(false);

    if (result) {
      toast.success("Appointment booked successfully!");
      navigate("/my-appointments");
    } else {
      toast.error("Failed to book appointment. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container py-8 max-w-4xl">
        <Skeleton className="h-8 w-64 mb-8 bg-muted" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2 bg-muted" />
            <Skeleton className="h-4 w-32 bg-muted" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full bg-muted" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="container py-8 max-w-4xl">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Doctor not found</p>
            <Button onClick={() => navigate("/doctors")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Doctors
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="container py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate("/doctors")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Doctors
      </Button>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Doctor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{doctor.name}</p>
                <p className="text-sm text-muted-foreground">
                  {doctor.specialty?.name || "General Practice"}
                </p>
              </div>
            </div>
            {doctor.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{doctor.email}</span>
              </div>
            )}
            {doctor.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{doctor.phone}</span>
              </div>
            )}
            {doctor.availability && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{doctor.availability}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Book Appointment</CardTitle>
            <CardDescription>
              Select your preferred date and time for the appointment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="date">
                  <Calendar className="inline h-4 w-4 mr-2" />
                  Appointment Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  min={minDate}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">
                  <Clock className="inline h-4 w-4 mr-2" />
                  Appointment Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any specific concerns or information for the doctor..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Booking..." : "Confirm Appointment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
