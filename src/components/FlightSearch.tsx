import { useState } from "react";
import { motion } from "framer-motion";
import { Plane, ArrowRight, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const airports = [
  { code: "KLAF", name: "Purdue University" },
  { code: "KORD", name: "Chicago O'Hare" },
  { code: "KIND", name: "Indianapolis" },
  { code: "KDTW", name: "Detroit Metro" },
  { code: "KCMH", name: "Columbus, OH" },
];

export default function FlightSearch() {
  const [from, setFrom] = useState("KLAF");
  const [to, setTo] = useState("KORD");
  const [date, setDate] = useState("2025-11-28");
  const [passengers, setPassengers] = useState(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="surface-elevated border border-border rounded-2xl p-6 md:p-8 glow-gold">
        <div className="flex items-center gap-2 mb-6">
          <Plane className="w-5 h-5 text-primary" />
          <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
            Search Flights
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* From */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-wider font-mono">From</label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 font-mono text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {airports.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.code}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              {airports.find((a) => a.code === from)?.name}
            </p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center pt-4">
            <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-primary" />
            </div>
          </div>

          {/* To */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-wider font-mono">To</label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 font-mono text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {airports.filter((a) => a.code !== from).map((a) => (
                <option key={a.code} value={a.code}>
                  {a.code}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              {airports.find((a) => a.code === to)?.name}
            </p>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <Button className="w-full h-[50px] text-base font-semibold">
              Search Flights
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-wider font-mono flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-wider font-mono flex items-center gap-1">
              <Users className="w-3 h-3" /> Passengers
            </label>
            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? "passenger" : "passengers"}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
