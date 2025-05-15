-- Eliminar tablas existentes
DROP TABLE IF EXISTS watering_events CASCADE;
DROP TABLE IF EXISTS plants CASCADE;
DROP TABLE IF EXISTS auth.users CASCADE;

-- Crear tabla de usuarios
CREATE TABLE auth.users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de plantas
CREATE TABLE plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT,
  watering_interval INT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de eventos de riego
CREATE TABLE watering_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID REFERENCES plants(id),
  user_id UUID REFERENCES auth.users(id),
  water_amount INT NOT NULL,
  watered_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS en las tablas
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE watering_events ENABLE ROW LEVEL SECURITY;

-- Configurar políticas RLS para la tabla `plants`
DROP POLICY IF EXISTS "Allow user to insert plants" ON plants;
CREATE POLICY "Allow user to insert plants"
ON plants
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow user to access their plants" ON plants;
CREATE POLICY "Allow user to access their plants"
ON plants
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Configurar políticas RLS para la tabla `watering_events`
DROP POLICY IF EXISTS "Allow user to insert watering events" ON watering_events;
CREATE POLICY "Allow user to insert watering events"
ON watering_events
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow user to access their watering events" ON watering_events;
CREATE POLICY "Allow user to access their watering events"
ON watering_events
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Habilitar RLS en la tabla auth.users
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir que los usuarios autenticados accedan a sus propios datos
CREATE POLICY "Allow authenticated users to access their data"
ON auth.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Insertar datos de prueba
INSERT INTO auth.users (id, email, created_at)
VALUES ('00000000-0000-0000-0000-000000000001', 'test@example.com', NOW());

INSERT INTO plants (id, name, watering_interval, user_id, created_at)
VALUES (gen_random_uuid(), 'Test Plant', 7, '00000000-0000-0000-0000-000000000001', NOW());