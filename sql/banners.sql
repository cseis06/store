-- ============================================
-- TABLA BANNERS (para Hero y Promociones)
-- ============================================

CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('hero', 'promo', 'category')),
  title TEXT,
  subtitle TEXT,
  description TEXT,
  cta_text TEXT,
  cta_link TEXT,
  image_url TEXT,
  image_alt TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_banners_type ON banners(type);
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(is_active);
CREATE INDEX IF NOT EXISTS idx_banners_dates ON banners(start_date, end_date);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_banners_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS banners_updated_at ON banners;
CREATE TRIGGER banners_updated_at
  BEFORE UPDATE ON banners
  FOR EACH ROW
  EXECUTE FUNCTION update_banners_updated_at();

-- RLS
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Todos pueden leer banners activos
CREATE POLICY "Public can view active banners"
ON banners FOR SELECT
USING (is_active = true);

-- ============================================
-- SEED DATA
-- ============================================

INSERT INTO banners (type, title, subtitle, description, cta_text, cta_link, image_url, image_alt, display_order) VALUES
-- Hero slides
('hero', NULL, NULL, 'Colección minimalista KIREN', NULL, NULL, '/images/hero/slide-1.jpg', 'Colección minimalista KIREN', 1),
('hero', NULL, NULL, 'Esenciales de temporada', NULL, NULL, '/images/hero/slide-2.jpg', 'Esenciales de temporada', 2),
('hero', NULL, NULL, 'Nueva colección KIREN', NULL, NULL, '/images/hero/slide-3.jpg', 'Nueva colección KIREN', 3),

-- Promo banner
('promo', 'Nueva Temporada', 'Promoción', 'Descubrí los nuevos esenciales', 'Comprar ahora', '/catalogo', '/images/banners/promo-banner.jpg', 'Nueva temporada', 1);

-- ============================================
-- AGREGAR COLUMNA is_featured A COLLECTIONS SI NO EXISTE
-- ============================================

ALTER TABLE collections 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Marcar una colección como destacada (ejemplo)
UPDATE collections SET is_featured = true WHERE slug = 'essentials-aw25' OR display_order = 1;
