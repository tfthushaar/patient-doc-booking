import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAppointments, getAllDoctors, getAllProfiles } from "@/db/api";
import type { AppointmentWithDetails, DoctorWithSpecialty, Profile } from "@/types/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Stethoscope, Calendar, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [doctors, setDoctors] = useState<DoctorWithSpecialty[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [appointmentsData, doctorsData, usersData] = await Promise.all([
      getAllAppointments(),
      getAllDoctors(),
      getAllProfiles()
    ]);
    setAppointments(appointmentsData);
    setDoctors(doctorsData);
    setUsers(usersData);
    setLoading(false);
  }

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      description: "Registered patients and admins",
      action: () => navigate("/admin/users")
    },
    {
      title: "Total Doctors",
      value: doctors.length,
      icon: Stethoscope,
      description: "Medical professionals",
      action: () => navigate("/admin/doctors")
    },
    {
      title: "Total Appointments",
      value: appointments.length,
      icon: Calendar,
      description: "All time bookings",
      action: () => navigate("/admin/appointments")
    },
    {
      title: "Pending Appointments",
      value: appointments.filter(a => a.status === "pending").length,
      icon: TrendingUp,
      description: "Awaiting confirmation",
      action: () => navigate("/admin/appointments")
    }
  ];

  return (
    <div className="container py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your medical appointment system</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2 bg-muted" />
                <Skeleton className="h-8 w-16 bg-muted" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={stat.action}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate("/admin/doctors")}
            >
              <Stethoscope className="mr-2 h-4 w-4" />
              Manage Doctors
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate("/admin/users")}
            >
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate("/admin/appointments")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              View All Appointments
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No appointments yet</p>
            ) : (
              <div className="space-y-4">
                {appointments.slice(0, 5).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{appointment.patient?.username}</p>
                      <p className="text-muted-foreground">
                        with {appointment.doctor?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">
                        {new Date(appointment.appointment_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
