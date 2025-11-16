import { useState, useEffect } from "react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { updateProfile, getAllSpecialties } from "@/db/api";
import type { Specialty } from "@/types/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { User, Mail, Phone, Stethoscope } from "lucide-react";

export default function Profile() {
  const { profile, isAdmin } = useAuthContext();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setEmail(profile.email || "");
      setSelectedSpecialty(profile.selected_specialty || "");
    }
    loadSpecialties();
  }, [profile]);

  async function loadSpecialties() {
    const data = await getAllSpecialties();
    setSpecialties(data);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setLoading(true);
    const success = await updateProfile(profile.id, {
      full_name: fullName || null,
      phone: phone || null,
      email: email || null,
      selected_specialty: selectedSpecialty || null,
    });

    setLoading(false);

    if (success) {
      toast.success("Profile updated successfully");
      window.location.reload();
    } else {
      toast.error("Failed to update profile");
    }
  };

  if (!profile) {
    return (
      <div className="container py-8 max-w-4xl">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Account Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Username</p>
              <p className="font-medium">{profile.username}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium">
                {isAdmin ? "Administrator" : "Patient"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-medium">
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your profile details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  <User className="inline h-4 w-4 mr-2" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="inline h-4 w-4 mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="inline h-4 w-4 mr-2" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {!isAdmin && (
                <div className="space-y-2">
                  <Label htmlFor="specialty">
                    <Stethoscope className="inline h-4 w-4 mr-2" />
                    Preferred Specialty
                  </Label>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No preference</SelectItem>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty.id} value={specialty.id}>
                          {specialty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
