import { beforeEach, describe, expect, it, vi } from "vitest";
import { searchFlights } from "@/lib/flight-search";

const { query, from } = vi.hoisted(() => {
  const query = {
    select: vi.fn(), eq: vi.fn(), gte: vi.fn(), order: vi.fn(), abortSignal: vi.fn(),
  };
  Object.values(query).forEach((fn) => fn.mockReturnValue(query));
  return { query, from: vi.fn().mockReturnValue(query) };
});

vi.mock("@/integrations/supabase/client", () => ({ supabase: { from } }));

describe("flight search", () => {
  beforeEach(() => vi.clearAllMocks());

  it("filters the selected origin and destination", () => {
    searchFlights({ from: "KLAF", to: "KORD", date: "", passengers: 2 }, new AbortController().signal);
    expect(from).toHaveBeenCalledWith("flights");
    expect(query.eq.mock.calls).toEqual([["from_code", "KLAF"], ["to_code", "KORD"]]);
  });

  it("requires enough seats for the selected passengers", () => {
    searchFlights({ from: "KLAF", to: "KIND", date: "", passengers: 3 }, new AbortController().signal);
    expect(query.gte).toHaveBeenCalledWith("available_seats", 3);
  });

  it("filters the exact date when supplied", () => {
    searchFlights({ from: "KLAF", to: "KORD", date: "2026-11-28", passengers: 1 }, new AbortController().signal);
    expect(query.eq).toHaveBeenCalledWith("departure_date", "2026-11-28");
  });

  it("loads all routes before a search without applying hidden filters", () => {
    searchFlights(null, new AbortController().signal);
    expect(query.eq).not.toHaveBeenCalled();
    expect(query.gte).not.toHaveBeenCalled();
    expect(query.order).toHaveBeenCalledWith("departure_date");
  });
});