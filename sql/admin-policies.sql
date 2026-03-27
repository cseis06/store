-- ============================================
-- POLÍTICAS RLS PARA ADMIN
-- Ejecutar en SQL Editor de Supabase
-- ============================================

-- Función helper para verificar si el usuario es admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PRODUCTOS
-- ============================================

-- Admin puede ver todos los productos
CREATE POLICY "Admins can view all products"
ON products FOR SELECT TO authenticated
USING (is_admin());

-- Admin puede crear productos
CREATE POLICY "Admins can create products"
ON products FOR INSERT TO authenticated
WITH CHECK (is_admin());

-- Admin puede actualizar productos
CREATE POLICY "Admins can update products"
ON products FOR UPDATE TO authenticated
USING (is_admin());

-- Admin puede eliminar productos
CREATE POLICY "Admins can delete products"
ON products FOR DELETE TO authenticated
USING (is_admin());

-- ============================================
-- CATEGORÍAS
-- ============================================

CREATE POLICY "Admins can manage categories"
ON categories FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================
-- COLECCIONES
-- ============================================

CREATE POLICY "Admins can manage collections"
ON collections FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================
-- PRODUCT_COLLECTIONS (tabla de relación)
-- ============================================

CREATE POLICY "Admins can manage product_collections"
ON product_collections FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================
-- BANNERS
-- ============================================

CREATE POLICY "Admins can manage banners"
ON banners FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================
-- PRODUCT_IMAGES
-- ============================================

CREATE POLICY "Admins can manage product_images"
ON product_images FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================
-- PRODUCT_VARIANTS
-- ============================================

CREATE POLICY "Admins can manage product_variants"
ON product_variants FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================
-- PEDIDOS (solo lectura y actualización para admin)
-- ============================================

CREATE POLICY "Admins can view all orders"
ON orders FOR SELECT TO authenticated
USING (is_admin());

CREATE POLICY "Admins can update orders"
ON orders FOR UPDATE TO authenticated
USING (is_admin());

-- ============================================
-- ORDER_ITEMS
-- ============================================

CREATE POLICY "Admins can view all order_items"
ON order_items FOR SELECT TO authenticated
USING (is_admin());

-- ============================================
-- PROFILES (admin puede ver todos)
-- ============================================

CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT TO authenticated
USING (is_admin());

-- ============================================
-- NOTA: Si ya existen políticas con estos nombres,
-- primero debes eliminarlas con:
-- DROP POLICY IF EXISTS "nombre_de_policy" ON tabla;
-- ============================================
