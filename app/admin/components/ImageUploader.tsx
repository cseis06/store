"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { uploadImage, deleteImage, type ImageBucket } from "@/lib/storage"

interface ImageUploaderProps {
  value?: string | null
  onChange: (url: string | null) => void
  bucket: ImageBucket
  folder?: string
  label?: string
  aspectRatio?: "square" | "video" | "portrait" | "banner"
}

const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  banner: "aspect-[21/9]",
}

export default function ImageUploader({
  value,
  onChange,
  bucket,
  folder,
  label = "Imagen",
  aspectRatio = "square",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const result = await uploadImage(formData, bucket, folder)

      if (result.success && result.url) {
        // Si había una imagen anterior, eliminarla
        if (value) {
          await deleteImage(value, bucket)
        }
        onChange(result.url)
      } else {
        setError(result.error || "Error al subir la imagen")
      }
    } catch (err) {
      setError("Error inesperado")
    } finally {
      setIsUploading(false)
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }

  const handleRemove = async () => {
    if (!value) return

    setIsUploading(true)
    try {
      await deleteImage(value, bucket)
      onChange(null)
    } catch (err) {
      setError("Error al eliminar la imagen")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block font-inter text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}

      <div
        className={`relative ${aspectRatioClasses[aspectRatio]} bg-neutral-100 rounded-lg border-2 border-dashed border-neutral-300 overflow-hidden hover:border-neutral-400 transition-colors`}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
                className="px-3 py-1.5 bg-white text-black font-inter text-xs rounded hover:bg-neutral-100 transition-colors"
              >
                Cambiar
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className="px-3 py-1.5 bg-red-600 text-white font-inter text-xs rounded hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400 hover:text-neutral-500 transition-colors"
          >
            {isUploading ? (
              <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                </svg>
                <span className="font-inter text-sm">Subir imagen</span>
                <span className="font-inter text-xs mt-1">JPG, PNG, WebP hasta 5MB</span>
              </>
            )}
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && (
        <p className="font-inter text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
