import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { supabase } from "@/db/supabase";
import { toast } from "sonner";
import { Stethoscope, LogOut, User, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Header() {
  const { user, profile, isAdmin } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to logout");
    } else {
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">MediBook</span>
          </Link>
          
          {user && (
            <nav className="hidden xl:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/doctors" className="text-sm font-medium hover:text-primary transition-colors">
                Doctors
              </Link>
              <Link to="/my-appointments" className="text-sm font-medium hover:text-primary transition-colors">
                My Appointments
              </Link>
              {isAdmin && (
                <>
                  <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors">
                    Admin Dashboard
                  </Link>
                  <Link to="/admin/doctors" className="text-sm font-medium hover:text-primary transition-colors">
                    Manage Doctors
                  </Link>
                  <Link to="/admin/users" className="text-sm font-medium hover:text-primary transition-colors">
                    Manage Users
                  </Link>
                </>
              )}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {profile?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{profile?.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {isAdmin ? "Administrator" : "Patient"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate("/login")}>Login</Button>
          )}
        </div>
      </div>
    </header>
  );
}
