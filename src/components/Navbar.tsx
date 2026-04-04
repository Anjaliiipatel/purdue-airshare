import { Plane, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Plane className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            Purdue <span className="text-primary">AirShare</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="/#routes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Routes</a>
          <a href="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="/#tech" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tech Stack</a>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user.user_metadata?.full_name || user.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/my-bookings")}
                className="text-muted-foreground"
              >
                My Bookings
              </Button>
              <Button variant="ghost" size="icon" onClick={signOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
              <Button size="sm" onClick={() => navigate("/auth")}>
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
