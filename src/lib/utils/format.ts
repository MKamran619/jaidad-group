export function formatPrice(price: number, currency = 'PKR'): string {
  if (price >= 10_000_000) {
    return `${currency} ${(price / 10_000_000).toFixed(2)} Crore`
  }
  if (price >= 100_000) {
    return `${currency} ${(price / 100_000).toFixed(2)} Lakh`
  }
  return `${currency} ${price.toLocaleString('en-PK')}`
}

export function formatArea(area: number, unit: string): string {
  return `${area.toLocaleString()} ${unit}`
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '...' : str
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function whatsappLink(phone: string, message = ''): string {
  const clean = phone.replace(/\D/g, '')
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
}

export function relativeTime(date: string): string {
  const now = Date.now()
  const then = new Date(date).getTime()
  const diff = (now - then) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`
  return formatDate(date)
}
