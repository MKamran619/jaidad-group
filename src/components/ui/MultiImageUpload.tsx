import { useRef, useState } from 'react'
import { FiPlus, FiX } from 'react-icons/fi'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'

interface MultiImageUploadProps {
  values: string[]
  onChange: (urls: string[]) => void
  folder: string
  label?: string
  max?: number
}

export function MultiImageUpload({ values, onChange, folder, label, max = 12 }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadOne = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { data, error: upErr } = await supabase.storage
      .from('media')
      .upload(path, file, { cacheControl: '3600', upsert: false })
    if (upErr) throw upErr
    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path)
    return publicUrl
  }

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, max - values.length)
    if (!files.length) return
    setUploading(true)
    setError(null)
    try {
      const newUrls = await Promise.all(files.map(uploadOne))
      onChange([...values, ...newUrls])
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Upload failed. Ensure the "media" Storage bucket exists and is set to public.'
      )
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-medium text-[var(--color-text-muted)]">{label}</label>
      )}

      <div className="flex flex-wrap gap-2">
        {values.map((url, i) => (
          <div
            key={`${i}-${url.slice(-16)}`}
            className="relative group h-20 w-20 rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] flex-shrink-0"
          >
            <img
              src={url}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => { e.currentTarget.style.opacity = '0.3' }}
            />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="absolute top-0.5 right-0.5 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <FiX className="h-2.5 w-2.5" />
            </button>
            {i === 0 && (
              <span className="absolute bottom-0 left-0 right-0 text-center bg-[var(--color-brand-gold)] text-white text-[8px] font-bold py-0.5 leading-tight uppercase">
                Cover
              </span>
            )}
          </div>
        ))}

        {values.length < max && (
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className={cn(
              'h-20 w-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all flex-shrink-0 text-[var(--color-text-muted)]',
              uploading
                ? 'border-[var(--color-brand-gold)]/50 bg-[var(--color-brand-gold)]/5 cursor-wait'
                : 'border-[var(--color-border)] hover:border-[var(--color-brand-gold)]/60 hover:bg-[var(--color-surface)] cursor-pointer'
            )}
          >
            {uploading ? (
              <div className="h-5 w-5 border-2 border-[var(--color-brand-gold)] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <FiPlus className="h-4 w-4" />
                <span className="text-[9px] font-medium">Add</span>
              </>
            )}
          </button>
        )}
      </div>

      {values.length === 0 && !uploading && (
        <p className="text-xs text-[var(--color-text-muted)]">
          Click "Add" to upload images. The first image becomes the cover photo.
        </p>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
    </div>
  )
}
