import { useState, useEffect } from "react";
import { getAllProfiles, updateUserRole } from "@/db/api";
import type { Profile } from "@/types/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Shield, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export default function ManageUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    const data = await getAllProfiles();
    setUsers(data);
    setLoading(false);
  }

  const handleRoleChange = async (userId: string, newRole: 'patient' | 'admin') => {
    const success = await updateUserRole(userId, newRole);
    if (success) {
      toast.success(`User role updated to ${newRole}`);
      loadUsers();
    } else {
      toast.error("Failed to update user role");
    }
  };

  return (
    <div className="container py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Users</h1>
        <p className="text-muted-foreground">View and manage user roles</p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-8">
            <Skeleton className="h-64 w-full bg-muted" />
          </CardContent>
        </Card>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No users in the system</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Users List</CardTitle>
            <CardDescription>Total: {users.length} users</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.full_name || "N/A"}</TableCell>
                    <TableCell>{user.email || "N/A"}</TableCell>
                    <TableCell>{user.phone || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role === "admin" ? (
                          <>
                            <Shield className="mr-1 h-3 w-3" />
                            Admin
                          </>
                        ) : (
                          <>
                            <User className="mr-1 h-3 w-3" />
                            Patient
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.role === "patient" ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Make Admin
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Promote to Admin?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to make {user.username} an administrator? 
                                They will have full access to the system.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleRoleChange(user.id, "admin")}>
                                Promote
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Revoke Admin
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Revoke Admin Access?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to revoke admin access from {user.username}? 
                                They will become a regular patient.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleRoleChange(user.id, "patient")}>
                                Revoke
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
