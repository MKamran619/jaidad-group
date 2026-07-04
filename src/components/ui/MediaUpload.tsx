import { useRef, useState } from 'react'
import { FiUpload, FiX, FiLink } from 'react-icons/fi'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'

interface MediaUploadProps {
  value: string
  onChange: (url: string) => void
  folder: string
  accept?: string
  label?: string
  aspectRatio?: 'square' | 'video' | 'auto'
}

export function MediaUpload({
  value,
  onChange,
  folder,
  accept = 'image/*',
  label,
  aspectRatio = 'video',
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [previewFailed, setPreviewFailed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File) => {
    setUploading(true)
    setError(null)
    try {
      const ext = file.name.split('.').pop() ?? 'bin'
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const { data, error: upErr } = await supabase.storage
        .from('media')
        .upload(path, file, { cacheControl: '3600', upsert: false })
      if (upErr) throw upErr
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path)
      setPreviewFailed(false)
      onChange(publicUrl)
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Upload failed. Ensure the "media" Storage bucket exists and is set to public.'
      )
    } finally {
      setUploading(false)
    }
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  const confirmUrl = () => {
    const url = urlInput.trim()
    if (url) {
      onChange(url)
      setShowUrlInput(false)
      setUrlInput('')
      setPreviewFailed(false)
    }
  }

  const previewClass = cn(
    'w-full object-cover',
    aspectRatio === 'square' ? 'aspect-square' : aspectRatio === 'video' ? 'aspect-video' : 'max-h-48'
  )

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-[var(--text-muted)]">{label}</label>
      )}

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
          {!previewFailed ? (
            <img
              key={value}
              src={value}
              alt=""
              className={previewClass}
              onError={() => setPreviewFailed(true)}
            />
          ) : (
            <div
              className={cn(
                'flex items-center gap-2 p-4 bg-[var(--background)]',
                aspectRatio === 'square' ? 'aspect-square' : 'min-h-[72px]'
              )}
            >
              <FiLink className="h-4 w-4 text-[var(--primary)] flex-shrink-0" />
              <span className="text-xs text-[var(--text)] break-all line-clamp-2">{value}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-black text-xs font-semibold rounded-lg hover:bg-white/90 transition-colors"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => { onChange(''); setPreviewFailed(false) }}
              className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <FiX className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'relative rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer min-h-[100px]',
            isDragOver
              ? 'border-[var(--primary)] bg-[var(--primary)]/5'
              : 'border-[var(--border)] hover:border-[var(--primary)]/60 hover:bg-[var(--surface)]'
          )}
          onClick={() => !uploading && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={() => setIsDragOver(false)}
        >
          {uploading ? (
            <>
              <div className="h-7 w-7 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-[var(--text-muted)]">Uploading...</p>
            </>
          ) : (
            <>
              <FiUpload className="h-6 w-6 text-[var(--text-muted)]" />
              <p className="text-xs text-[var(--text-muted)] text-center px-6 leading-relaxed">
                Click or drag & drop to upload
              </p>
              <button
                type="button"
                className="text-xs text-[var(--primary)] hover:underline"
                onClick={(e) => { e.stopPropagation(); setShowUrlInput(!showUrlInput) }}
              >
                or paste a URL
              </button>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      {showUrlInput && !value && (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://..."
            className="flex-1 h-9 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            onKeyDown={(e) => e.key === 'Enter' && confirmUrl()}
          />
          <button
            type="button"
            onClick={confirmUrl}
            className="px-3 h-9 bg-[var(--primary)] text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Set
          </button>
          <button
            type="button"
            onClick={() => { setShowUrlInput(false); setUrlInput('') }}
            className="px-2 h-9 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface)] transition-colors"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
      )}

      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFiles} />
    </div>
  )
}
