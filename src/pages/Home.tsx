import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Calendar, Users, Clock, Shield } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuthContext();

  const features = [
    {
      icon: Calendar,
      title: "Easy Booking",
      description: "Book appointments with your preferred doctors in just a few clicks"
    },
    {
      icon: Users,
      title: "Expert Doctors",
      description: "Access to qualified medical professionals across various specialties"
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Choose appointment times that work best for your schedule"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your medical information is protected with enterprise-grade security"
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="container max-w-6xl mx-auto text-center">
          <h1 className="text-4xl xl:text-6xl font-bold mb-6">
            Your Health, Our Priority
          </h1>
          <p className="text-lg xl:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book appointments with top medical professionals. Simple, fast, and secure healthcare management.
          </p>
          <div className="flex flex-col xl:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Button size="lg" onClick={() => navigate("/doctors")}>
                  Find a Doctor
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/my-appointments")}>
                  My Appointments
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" onClick={() => navigate("/login")}>
                  Get Started
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/doctors")}>
                  Browse Doctors
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose MediBook?</h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {isAdmin && (
        <section className="py-16 px-4 bg-muted">
          <div className="container max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Admin Quick Access</h2>
            <p className="text-muted-foreground mb-8">
              Manage your medical appointment system efficiently
            </p>
            <div className="flex flex-col xl:flex-row gap-4 justify-center">
              <Button onClick={() => navigate("/admin")}>
                Admin Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate("/admin/doctors")}>
                Manage Doctors
              </Button>
              <Button variant="outline" onClick={() => navigate("/admin/users")}>
                Manage Users
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
