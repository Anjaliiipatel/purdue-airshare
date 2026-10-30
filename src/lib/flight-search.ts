import { supabase } from "@/integrations/supabase/client";

export interface FlightSearchFilters {
  from: string;
  to: string;
  date: string;
  passengers: number;
}

export function searchFlights(filters: FlightSearchFilters | null, signal: AbortSignal) {
  let query = supabase.from("flights").select("*");
  if (filters) {
    query = query
      .eq("from_code", filters.from)
      .eq("to_code", filters.to)
      .gte("available_seats", filters.passengers);
    if (filters.date) query = query.eq("departure_date", filters.date);
  }
  return query.order("departure_date").abortSignal(signal);
}