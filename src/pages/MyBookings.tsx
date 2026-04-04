import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plane, Calendar, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  passengers: number;
  total_price: number;
  status: string;
  created_at: string;
  flights: {
    from_code: string;
    to_code: string;
    from_name: string;
    to_name: string;
    departure_date: string;
    duration: string;
    aircraft: string;
  } | null;
}

export default function MyBookings() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, flights(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) setBookings(data as unknown as Booking[]);
      setFetching(false);
    };
    fetchBookings();
  }, [user]);

  const cancelBooking = async (id: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", id);

    if (error) {
      toast({ title: "Cancel failed", description: error.message, variant: "destructive" });
    } else {
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "cancelled" } : b));
      toast({ title: "Booking cancelled" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <h1 className="text-3xl font-bold font-display text-foreground mb-8">My Bookings</h1>

        {fetching ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No bookings yet. Time to fly!</p>
            <Button onClick={() => navigate("/")}>Browse Routes</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="surface-elevated border border-border rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xl font-bold text-foreground">
                      {booking.flights?.from_code}
                    </span>
                    <Plane className="w-4 h-4 text-primary" />
                    <span className="font-mono text-xl font-bold text-foreground">
                      {booking.flights?.to_code}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-mono uppercase px-2 py-1 rounded ${
                      booking.status === "confirmed"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {booking.flights?.from_name} → {booking.flights?.to_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {booking.flights?.departure_date}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {booking.passengers} passenger(s) · <span className="text-primary font-mono font-bold">${booking.total_price}</span>
                  </div>
                  {booking.status === "confirmed" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => cancelBooking(booking.id)}
                    >
                      <X className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
