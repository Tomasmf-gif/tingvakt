'use client'

interface MPPhotoProps {
  src: string
  name: string
  className?: string
  size?: number
}

export function MPPhoto({ src, name, className = '', size = 96 }: MPPhotoProps) {
  return (
    <img
      src={src}
      alt={name}
      className={className}
      onError={(e) => {
        ;(e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=e2e8f0&color=64748b`
      }}
    />
  )
}
