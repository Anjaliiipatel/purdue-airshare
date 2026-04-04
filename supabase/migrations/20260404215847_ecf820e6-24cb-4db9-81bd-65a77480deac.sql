
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Flights table
CREATE TABLE public.flights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_code TEXT NOT NULL,
  to_code TEXT NOT NULL,
  from_name TEXT NOT NULL,
  to_name TEXT NOT NULL,
  departure_date DATE NOT NULL,
  departure_time TIME,
  duration TEXT NOT NULL,
  price INTEGER NOT NULL,
  total_seats INTEGER NOT NULL DEFAULT 4,
  available_seats INTEGER NOT NULL DEFAULT 4,
  aircraft TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.flights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view flights"
  ON public.flights FOR SELECT
  USING (true);

-- Bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flight_id UUID NOT NULL REFERENCES public.flights(id) ON DELETE CASCADE,
  passengers INTEGER NOT NULL DEFAULT 1,
  total_price INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON public.bookings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel their own bookings"
  ON public.bookings FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
