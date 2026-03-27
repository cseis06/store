-- ============================================
-- SUPABASE STORAGE - BUCKETS PARA IMÁGENES
-- Ejecutar en SQL Editor de Supabase
-- ============================================

-- Crear bucket para imágenes de productos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Crear bucket para imágenes de categorías
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'categories',
  'categories',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Crear bucket para imágenes de colecciones
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'collections',
  'collections',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Crear bucket para banners
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'banners',
  'banners',
  true,
  10485760, -- 10MB para banners grandes
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- POLÍTICAS DE STORAGE
-- ============================================

-- Política: Todos pueden ver imágenes públicas
CREATE POLICY "Public can view images" ON storage.objects
FOR SELECT USING (bucket_id IN ('products', 'categories', 'collections', 'banners'));

-- Política: Solo admins pueden subir/editar/eliminar
CREATE POLICY "Admins can upload images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id IN ('products', 'categories', 'collections', 'banners')
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update images" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id IN ('products', 'categories', 'collections', 'banners')
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete images" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id IN ('products', 'categories', 'collections', 'banners')
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- ============================================
-- ASEGURAR QUE PROFILES TENGA COLUMNA ROLE
-- ============================================

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin'));

-- Crear índice para búsqueda rápida de admins
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ============================================
-- PARA HACER UN USUARIO ADMIN
-- Reemplazar 'tu-email@ejemplo.com' con el email del admin
-- ============================================

-- UPDATE profiles SET role = 'admin' WHERE email = 'tu-email@ejemplo.com';
