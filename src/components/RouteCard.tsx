import { motion } from "framer-motion";
import { Plane, Clock, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface RouteCardProps {
  from: string;
  to: string;
  fromName: string;
  toName: string;
  duration: string;
  price: number;
  seats: number;
  aircraft: string;
  delay?: number;
  flightId?: string;
}

export default function RouteCard({
  from, to, fromName, toName, duration, price, seats, aircraft, delay = 0, flightId
}: RouteCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState(false);

  const handleBook = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!flightId) {
      toast({ title: "Flight unavailable", variant: "destructive" });
      return;
    }

    setBooking(true);
    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      flight_id: flightId,
      passengers: 1,
      total_price: price,
    });

    if (error) {
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Booked!", description: `${from} → ${to} confirmed. Check My Bookings.` });
    }
    setBooking(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      className="surface-elevated border border-border rounded-xl p-6 hover:border-gold-glow transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-2xl font-bold text-foreground">{from}</span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <div className="w-8 h-px bg-border" />
            <Plane className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
            <div className="w-8 h-px bg-border" />
          </div>
          <span className="font-mono text-2xl font-bold text-foreground">{to}</span>
        </div>
        <span className="font-mono text-2xl font-bold text-primary">${price}</span>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <span>{fromName} → {toName}</span>
        <span className="font-mono text-xs">{aircraft}</span>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> {duration}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" /> {seats} seats left
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5" /> cost-shared
        </span>
      </div>

      <Button
        variant="outline"
        className="w-full border-border hover:bg-primary hover:text-primary-foreground transition-colors"
        onClick={handleBook}
        disabled={booking || seats === 0}
      >
        {booking ? "Booking..." : user ? "Book This Route" : "Sign in to Book"}
      </Button>
    </motion.div>
  );
}
