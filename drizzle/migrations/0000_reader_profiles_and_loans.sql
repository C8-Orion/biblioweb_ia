CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL CHECK (char_length(trim(full_name)) BETWEEN 2 AND 120),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Readers can view their own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);
CREATE POLICY "Readers can update their own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.create_reader_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    new.id,
    left(coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
      nullif(trim(split_part(new.email, '@', 1)), ''),
      'Lector'
    ), 120)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

CREATE TRIGGER create_reader_profile_after_signup
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.create_reader_profile();

INSERT INTO public.profiles (id, full_name)
SELECT u.id, left(coalesce(
  nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''),
  nullif(trim(u.raw_user_meta_data ->> 'name'), ''),
  nullif(trim(split_part(u.email, '@', 1)), ''),
  'Lector'
), 120)
FROM auth.users u
ON CONFLICT (id) DO NOTHING;

CREATE TABLE public.prestamos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  libro_id text NOT NULL CHECK (char_length(libro_id) BETWEEN 1 AND 120),
  titulo text NOT NULL CHECK (char_length(trim(titulo)) BETWEEN 1 AND 240),
  autor text NOT NULL CHECK (char_length(trim(autor)) BETWEEN 1 AND 240),
  portada text NOT NULL DEFAULT '',
  comentario text NOT NULL DEFAULT '' CHECK (char_length(comentario) <= 1000),
  solicitado_en timestamptz NOT NULL DEFAULT now(),
  fecha_devolucion timestamptz NOT NULL DEFAULT (now() + interval '15 days'),
  estado text NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'devuelto', 'cancelado'))
);
GRANT SELECT ON public.prestamos TO authenticated;
GRANT ALL ON public.prestamos TO service_role;
ALTER TABLE public.prestamos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Readers can view their own loans"
ON public.prestamos FOR SELECT TO authenticated
USING (auth.uid() = user_id);
CREATE UNIQUE INDEX one_active_loan_per_reader_and_book
ON public.prestamos (user_id, libro_id) WHERE estado = 'activo';

CREATE OR REPLACE FUNCTION public.solicitar_prestamo(
  p_libro_id text,
  p_titulo text,
  p_autor text,
  p_portada text DEFAULT '',
  p_comentario text DEFAULT ''
)
RETURNS public.prestamos
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_prestamo public.prestamos;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Debes iniciar sesión para solicitar un préstamo.';
  END IF;
  IF char_length(trim(coalesce(p_libro_id, ''))) NOT BETWEEN 1 AND 120
    OR char_length(trim(coalesce(p_titulo, ''))) NOT BETWEEN 1 AND 240
    OR char_length(trim(coalesce(p_autor, ''))) NOT BETWEEN 1 AND 240
    OR char_length(coalesce(p_comentario, '')) > 1000 THEN
    RAISE EXCEPTION 'Los datos del préstamo no son válidos.';
  END IF;
  IF (SELECT count(*) FROM public.prestamos WHERE user_id = auth.uid() AND estado = 'activo') >= 5 THEN
    RAISE EXCEPTION 'Ya tienes 5 préstamos activos, el máximo permitido.';
  END IF;
  INSERT INTO public.prestamos (user_id, libro_id, titulo, autor, portada, comentario, solicitado_en, fecha_devolucion)
  VALUES (auth.uid(), trim(p_libro_id), trim(p_titulo), trim(p_autor), left(coalesce(p_portada, ''), 1000), trim(coalesce(p_comentario, '')), now(), now() + interval '15 days')
  RETURNING * INTO v_prestamo;
  RETURN v_prestamo;
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Ya tienes un préstamo activo de este libro.';
END;
$$;
REVOKE ALL ON FUNCTION public.solicitar_prestamo(text, text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.solicitar_prestamo(text, text, text, text, text) TO authenticated;