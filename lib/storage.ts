'use server'

import { createClient } from '@/lib/supabase/server'
import { getAdminUser } from '@/lib/admin'

export type ImageBucket = 'products' | 'categories' | 'collections' | 'banners'

interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

// Subir imagen a Supabase Storage
export async function uploadImage(
  formData: FormData,
  bucket: ImageBucket,
  folder?: string
): Promise<UploadResult> {
  try {
    // Verificar que sea admin
    const admin = await getAdminUser()
    if (!admin) {
      return { success: false, error: 'No autorizado' }
    }

    const file = formData.get('file') as File
    if (!file) {
      return { success: false, error: 'No se proporcionó archivo' }
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Tipo de archivo no permitido' }
    }

    // Validar tamaño (max 5MB para productos/categorías/colecciones, 10MB para banners)
    const maxSize = bucket === 'banners' ? 10 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      return { success: false, error: `El archivo excede el tamaño máximo (${maxSize / 1024 / 1024}MB)` }
    }

    const supabase = await createClient()

    // Generar nombre único
    const ext = file.name.split('.').pop()
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const fileName = folder 
      ? `${folder}/${timestamp}-${randomStr}.${ext}`
      : `${timestamp}-${randomStr}.${ext}`

    // Subir archivo
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Upload error:', error)
      return { success: false, error: 'Error al subir la imagen' }
    }

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return { success: true, url: publicUrl }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: 'Error inesperado al subir la imagen' }
  }
}

// Eliminar imagen de Supabase Storage
export async function deleteImage(
  url: string,
  bucket: ImageBucket
): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await getAdminUser()
    if (!admin) {
      return { success: false, error: 'No autorizado' }
    }

    const supabase = await createClient()

    // Extraer el path del archivo de la URL
    const urlParts = url.split(`/${bucket}/`)
    if (urlParts.length < 2) {
      return { success: false, error: 'URL de imagen inválida' }
    }
    const filePath = urlParts[1]

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      return { success: false, error: 'Error al eliminar la imagen' }
    }

    return { success: true }
  } catch (error) {
    console.error('Delete error:', error)
    return { success: false, error: 'Error inesperado' }
  }
}

// Subir múltiples imágenes (para galería de productos)
export async function uploadMultipleImages(
  formData: FormData,
  bucket: ImageBucket,
  folder?: string
): Promise<{ success: boolean; urls?: string[]; errors?: string[] }> {
  const files = formData.getAll('files') as File[]
  const urls: string[] = []
  const errors: string[] = []

  for (const file of files) {
    const singleFormData = new FormData()
    singleFormData.append('file', file)
    
    const result = await uploadImage(singleFormData, bucket, folder)
    
    if (result.success && result.url) {
      urls.push(result.url)
    } else {
      errors.push(result.error || 'Error desconocido')
    }
  }

  return {
    success: errors.length === 0,
    urls: urls.length > 0 ? urls : undefined,
    errors: errors.length > 0 ? errors : undefined,
  }
}
