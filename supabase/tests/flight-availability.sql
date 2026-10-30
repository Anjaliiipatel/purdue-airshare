-- Run with the managed read-query tool. Each rule must return true.
SELECT
  EXISTS (SELECT 1 FROM public.flights WHERE departure_date = DATE '2026-10-30' AND available_seats > 0) AS start_date_bookable,
  EXISTS (SELECT 1 FROM public.flights WHERE departure_date = DATE '2026-11-30' AND available_seats > 0) AS end_date_bookable,
  NOT EXISTS (
    SELECT 1 FROM generate_series(DATE '2026-10-30', DATE '2026-11-30', INTERVAL '1 day') AS day
    CROSS JOIN (VALUES ('KORD'), ('KIND'), ('KDTW'), ('KCMH')) AS route(code)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.flights f
      WHERE f.departure_date = day::date AND f.from_code = 'KLAF'
        AND f.to_code = route.code AND f.available_seats > 0
    )
  ) AS every_day_has_all_routes;