import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plane, Shield, Zap, Code2, Server, Smartphone, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import FlightSearch from "@/components/FlightSearch";
import RouteCard from "@/components/RouteCard";
import heroImage from "@/assets/hero-aircraft.jpg";
import { supabase } from "@/integrations/supabase/client";

interface Flight {
  id: string;
  from_code: string;
  to_code: string;
  from_name: string;
  to_name: string;
  duration: string;
  price: number;
  available_seats: number;
  aircraft: string;
}

const steps = [
  { icon: Plane, title: "Search Routes", desc: "Browse available flights from Purdue Airport (KLAF) to major cities." },
  { icon: Shield, title: "Book & Share", desc: "Reserve your seat and split costs with fellow Boilermakers." },
  { icon: Zap, title: "Fly Together", desc: "Meet at the airport and enjoy a quick, affordable flight." },
];

const techStack = [
  { icon: Server, label: "FastAPI", desc: "Python backend with Pydantic validation" },
  { icon: Smartphone, label: "React Native + Expo", desc: "Cross-platform mobile UI" },
  { icon: Code2, label: "REST APIs", desc: "Dynamic query filtering & CORS" },
  { icon: Shield, label: "Secure Architecture", desc: "Modular, cloud-ready design" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Aircraft over Indiana" className="w-full h-full object-cover opacity-30" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 border border-border rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-gold" />
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Purdue University · Est. 2025
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-display leading-[0.9] mb-6">
              <span className="text-foreground">Fly </span>
              <span className="text-gold-gradient">Smarter</span>
              <br />
              <span className="text-foreground">Fly </span>
              <span className="text-gold-gradient">Together</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
              Cost-shared aircraft rides for Purdue students.
              <br className="hidden md:block" />
              Lafayette to Chicago, Indy, and beyond.
            </p>

            <p className="font-mono text-sm text-primary tracking-wider">
              KLAF → KORD · KLAF → KIND · KLAF → KDTW
            </p>
          </motion.div>

          <FlightSearch />
        </div>
      </section>

      {/* Popular Routes */}
      <section id="routes" className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-primary mb-2 block">Available Routes</span>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">Popular Destinations</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {routes.map((route, i) => (
            <RouteCard key={route.to} {...route} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-primary mb-2 block">Simple Process</span>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">How It Works</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl surface-elevated border border-border flex items-center justify-center mx-auto mb-5">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="font-mono text-xs text-muted-foreground mb-2">0{i + 1}</div>
              <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section id="tech" className="container mx-auto px-4 py-24 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-primary mb-2 block">Engineering</span>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">Tech Stack</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="surface-elevated border border-border rounded-xl p-5 text-center hover:border-gold-glow transition-all"
            >
              <tech.icon className="w-6 h-6 text-primary mx-auto mb-3" />
              <h4 className="font-mono text-sm font-semibold text-foreground mb-1">{tech.label}</h4>
              <p className="text-xs text-muted-foreground">{tech.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="surface-elevated border border-border rounded-2xl p-12 text-center glow-gold max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-4">
            Ready to <span className="text-gold-gradient">Fly</span>?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Join fellow Boilermakers and start sharing flights today.
          </p>
          <a
            href="https://github.com/Anjaliiipatel/purdue-airshare"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            View on GitHub <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-primary" />
            <span className="font-display font-bold text-sm text-foreground">
              Purdue AirShare
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Built with FastAPI · React Native · Expo · Purdue University 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
