import { motion } from "framer-motion";
import { Plane, Clock, DollarSign, Users, User, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
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
  const [showConfirm, setShowConfirm] = useState(false);
  const [passengers, setPassengers] = useState(1);

  const serviceFee = Math.round(price * 0.05);
  const totalPrice = price * passengers + serviceFee;

  const handleBookClick = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!flightId) {
      toast({ title: "Flight unavailable", variant: "destructive" });
      return;
    }
    setPassengers(1);
    setShowConfirm(true);
  };

  const handleConfirmBooking = async () => {
    if (!flightId) return;
    setBooking(true);
    const { error } = await supabase.from("bookings").insert({
      user_id: user!.id,
      flight_id: flightId,
      passengers,
      total_price: totalPrice,
    });

    if (error) {
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Booked!", description: `${from} → ${to} confirmed. Check My Bookings.` });
      setShowConfirm(false);
    }
    setBooking(false);
  };

  return (
    <>
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
          onClick={handleBookClick}
          disabled={seats === 0}
        >
          {user ? "Book This Route" : "Sign in to Book"}
        </Button>
      </motion.div>

      {/* Booking Confirmation Modal */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-primary" />
              Confirm Booking
            </DialogTitle>
            <DialogDescription>Review your flight details before confirming.</DialogDescription>
          </DialogHeader>

          {/* Flight Info */}
          <div className="surface-elevated border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="font-mono text-xl font-bold text-foreground">{from}</p>
                <p className="text-xs text-muted-foreground">{fromName}</p>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <div className="w-6 h-px bg-border" />
                <Plane className="w-4 h-4 text-primary" />
                <div className="w-6 h-px bg-border" />
              </div>
              <div className="text-center">
                <p className="font-mono text-xl font-bold text-foreground">{to}</p>
                <p className="text-xs text-muted-foreground">{toName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {duration}</span>
              <span className="flex items-center gap-1"><Info className="w-3 h-3" /> {aircraft}</span>
            </div>
          </div>

          {/* Passenger Selection */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-foreground">
              <User className="w-4 h-4 text-muted-foreground" /> Passengers
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline" size="sm"
                onClick={() => setPassengers(Math.max(1, passengers - 1))}
                disabled={passengers <= 1}
              >−</Button>
              <span className="font-mono text-sm w-6 text-center text-foreground">{passengers}</span>
              <Button
                variant="outline" size="sm"
                onClick={() => setPassengers(Math.min(seats, passengers + 1))}
                disabled={passengers >= seats}
              >+</Button>
            </div>
          </div>

          <Separator />

          {/* Fare Breakdown */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Base fare × {passengers}</span>
              <span className="font-mono">${price * passengers}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Service fee</span>
              <span className="font-mono">${serviceFee}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-foreground">
              <span>Total</span>
              <span className="font-mono text-primary">${totalPrice}</span>
            </div>
          </div>

          {/* Passenger Info */}
          <div className="text-xs text-muted-foreground flex items-start gap-2 bg-muted/50 rounded-lg p-3">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>Booking as <strong className="text-foreground">{user?.email}</strong>. You can manage this booking from the My Bookings page.</span>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
            <Button onClick={handleConfirmBooking} disabled={booking}>
              {booking ? "Confirming..." : `Confirm · $${totalPrice}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}