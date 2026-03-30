import { motion } from "framer-motion";
import { Plane, Clock, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

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
}

export default function RouteCard({
  from, to, fromName, toName, duration, price, seats, aircraft, delay = 0
}: RouteCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      className="surface-elevated border border-border rounded-xl p-6 hover:border-gold-glow transition-all duration-300 group"
    >
      {/* Route header */}
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

      {/* Details */}
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

      <Button variant="outline" className="w-full border-border hover:bg-primary hover:text-primary-foreground transition-colors">
        Book This Route
      </Button>
    </motion.div>
  );
}
