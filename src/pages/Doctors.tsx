import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDoctors, getAllSpecialties } from "@/db/api";
import type { DoctorWithSpecialty, Specialty } from "@/types/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar, Mail, Phone, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Doctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<DoctorWithSpecialty[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [doctorsData, specialtiesData] = await Promise.all([
      getAllDoctors(),
      getAllSpecialties()
    ]);
    setDoctors(doctorsData);
    setSpecialties(specialtiesData);
    setLoading(false);
  }

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSpecialty = selectedSpecialty === "all" || doctor.specialty_id === selectedSpecialty;
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  return (
    <div className="container py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find a Doctor</h1>
        <p className="text-muted-foreground">Browse our network of qualified medical professionals</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Search by doctor name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
          <SelectTrigger className="xl:w-64">
            <SelectValue placeholder="Filter by specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>
            {specialties.map((specialty) => (
              <SelectItem key={specialty.id} value={specialty.id}>
                {specialty.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2 bg-muted" />
                <Skeleton className="h-4 w-1/2 bg-muted" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredDoctors.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No doctors found matching your criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{doctor.name}</CardTitle>
                <CardDescription>
                  {doctor.specialty?.name || "General Practice"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {doctor.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{doctor.email}</span>
                  </div>
                )}
                {doctor.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{doctor.phone}</span>
                  </div>
                )}
                {doctor.availability && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{doctor.availability}</span>
                  </div>
                )}
                <Button 
                  className="w-full mt-4" 
                  onClick={() => navigate(`/book-appointment/${doctor.id}`)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
