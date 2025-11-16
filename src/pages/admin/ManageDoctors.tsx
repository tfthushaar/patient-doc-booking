import { useState, useEffect } from "react";
import { getAllDoctors, getAllSpecialties, createDoctor, deleteDoctor, updateDoctor } from "@/db/api";
import type { DoctorWithSpecialty, Specialty } from "@/types/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Upload, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState<DoctorWithSpecialty[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<DoctorWithSpecialty | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    specialty_id: "",
    email: "",
    phone: "",
    availability: ""
  });

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

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.specialty_id) {
      toast.error("Name and specialty are required");
      return;
    }

    const result = await createDoctor(formData);
    if (result) {
      toast.success("Doctor added successfully");
      setIsAddDialogOpen(false);
      setFormData({ name: "", specialty_id: "", email: "", phone: "", availability: "" });
      loadData();
    } else {
      toast.error("Failed to add doctor");
    }
  };

  const handleEditDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingDoctor) return;

    const success = await updateDoctor(editingDoctor.id, formData);
    if (success) {
      toast.success("Doctor updated successfully");
      setIsEditDialogOpen(false);
      setEditingDoctor(null);
      setFormData({ name: "", specialty_id: "", email: "", phone: "", availability: "" });
      loadData();
    } else {
      toast.error("Failed to update doctor");
    }
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    const success = await deleteDoctor(doctorId);
    if (success) {
      toast.success("Doctor deleted successfully");
      loadData();
    } else {
      toast.error("Failed to delete doctor");
    }
  };

  const handleCsvUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!csvFile) {
      toast.error("Please select a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error("CSV file is empty or invalid");
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const nameIndex = headers.indexOf('name');
      const specialtyIndex = headers.indexOf('specialty');
      const emailIndex = headers.indexOf('email');
      const phoneIndex = headers.indexOf('phone');
      const availabilityIndex = headers.indexOf('availability');

      if (nameIndex === -1 || specialtyIndex === -1) {
        toast.error("CSV must have 'name' and 'specialty' columns");
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const name = values[nameIndex];
        const specialtyName = values[specialtyIndex];
        
        if (!name || !specialtyName) continue;

        const specialty = specialties.find(s => 
          s.name.toLowerCase() === specialtyName.toLowerCase()
        );

        if (!specialty) {
          errorCount++;
          continue;
        }

        const result = await createDoctor({
          name,
          specialty_id: specialty.id,
          email: emailIndex !== -1 ? values[emailIndex] : undefined,
          phone: phoneIndex !== -1 ? values[phoneIndex] : undefined,
          availability: availabilityIndex !== -1 ? values[availabilityIndex] : undefined
        });

        if (result) {
          successCount++;
        } else {
          errorCount++;
        }
      }

      toast.success(`Imported ${successCount} doctors. ${errorCount} errors.`);
      setCsvFile(null);
      loadData();
    };

    reader.readAsText(csvFile);
  };

  const openEditDialog = (doctor: DoctorWithSpecialty) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialty_id: doctor.specialty_id || "",
      email: doctor.email || "",
      phone: doctor.phone || "",
      availability: doctor.availability || ""
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container py-8 max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Doctors</h1>
          <p className="text-muted-foreground">Add, edit, or remove doctors from the system</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import CSV
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Doctors from CSV</DialogTitle>
                <DialogDescription>
                  Upload a CSV file with columns: name, specialty, email, phone, availability
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCsvUpload} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="csv">CSV File</Label>
                  <Input
                    id="csv"
                    type="file"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Example: name,specialty,email,phone,availability
                  </p>
                </div>
                <Button type="submit" className="w-full">Upload</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Doctor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Doctor</DialogTitle>
                <DialogDescription>Enter the doctor's information</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddDoctor} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty *</Label>
                  <Select
                    value={formData.specialty_id}
                    onValueChange={(value) => setFormData({ ...formData, specialty_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty.id} value={specialty.id}>
                          {specialty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Input
                    id="availability"
                    placeholder="e.g., Mon-Fri 9AM-5PM"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">Add Doctor</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-8">
            <Skeleton className="h-64 w-full bg-muted" />
          </CardContent>
        </Card>
      ) : doctors.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No doctors in the system</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Doctor
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Doctors List</CardTitle>
            <CardDescription>Total: {doctors.length} doctors</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell className="font-medium">{doctor.name}</TableCell>
                    <TableCell>{doctor.specialty?.name || "N/A"}</TableCell>
                    <TableCell>{doctor.email || "N/A"}</TableCell>
                    <TableCell>{doctor.phone || "N/A"}</TableCell>
                    <TableCell>{doctor.availability || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(doctor)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Doctor?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {doctor.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteDoctor(doctor.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Doctor</DialogTitle>
            <DialogDescription>Update the doctor's information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditDoctor} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-specialty">Specialty *</Label>
              <Select
                value={formData.specialty_id}
                onValueChange={(value) => setFormData({ ...formData, specialty_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty.id} value={specialty.id}>
                      {specialty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-availability">Availability</Label>
              <Input
                id="edit-availability"
                placeholder="e.g., Mon-Fri 9AM-5PM"
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">Update Doctor</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
