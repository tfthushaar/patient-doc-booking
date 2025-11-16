import { useState, useEffect } from "react";
import { getMyAppointments, updateAppointmentStatus } from "@/db/api";
import type { AppointmentWithDetails } from "@/types/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar, Clock, User, FileText, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    setLoading(true);
    const data = await getMyAppointments();
    setAppointments(data);
    setLoading(false);
  }

  const handleCancelAppointment = async (appointmentId: string) => {
    const success = await updateAppointmentStatus(appointmentId, "cancelled");
    if (success) {
      toast.success("Appointment cancelled successfully");
      loadAppointments();
    } else {
      toast.error("Failed to cancel appointment");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "cancelled":
        return "bg-destructive text-destructive-foreground";
      case "completed":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Appointments</h1>
        <p className="text-muted-foreground">View and manage your medical appointments</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2 bg-muted" />
                <Skeleton className="h-4 w-32 bg-muted" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">You have no appointments yet</p>
            <Button onClick={() => window.location.href = "/doctors"}>
              Book Your First Appointment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {appointment.doctor?.name || "Unknown Doctor"}
                    </CardTitle>
                    <CardDescription>
                      {appointment.doctor?.specialty?.name || "General Practice"}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {format(new Date(appointment.appointment_date), "MMMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.appointment_time}</span>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="flex items-start gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">Notes:</p>
                      <p className="text-muted-foreground">{appointment.notes}</p>
                    </div>
                  </div>
                )}

                {appointment.status === "pending" && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <X className="mr-2 h-4 w-4" />
                        Cancel Appointment
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to cancel this appointment? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>No, Keep It</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleCancelAppointment(appointment.id)}>
                          Yes, Cancel
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
