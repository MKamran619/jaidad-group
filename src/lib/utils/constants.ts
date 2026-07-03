export const PROPERTY_TYPES = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'plot', label: 'Plot' },
  { value: 'agricultural', label: 'Agricultural Land' },
  { value: 'industrial', label: 'Industrial Land' },
  { value: 'farmhouse', label: 'Farm House' },
  { value: 'shop', label: 'Shop' },
  { value: 'office', label: 'Office' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'building', label: 'Building' },
] as const

export const PROPERTY_PURPOSES = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
  { value: 'construction', label: 'Construction' },
] as const

export const PROPERTY_STATUSES = [
  { value: 'available', label: 'Available' },
  { value: 'sold', label: 'Sold' },
  { value: 'rented', label: 'Rented' },
  { value: 'under_construction', label: 'Under Construction' },
  { value: 'off_plan', label: 'Off Plan' },
] as const

export const AREA_UNITS = [
  { value: 'marla', label: 'Marla' },
  { value: 'kanal', label: 'Kanal' },
  { value: 'sqft', label: 'Sq. Ft.' },
  { value: 'sqm', label: 'Sq. M.' },
  { value: 'sqyd', label: 'Sq. Yd.' },
] as const

export const GALLERY_CATEGORIES = [
  'All', 'Properties', 'Construction', 'Projects', 'Events', 'Office',
] as const

export const BRAND = {
  name: 'J+ Jaidad Group',
  tagline: 'Your Trusted Real Estate Partner',
  phone: '+92-300-0000000',
  whatsapp: '+923000000000',
  email: 'info@jaidadgroup.com',
  address: 'Main Boulevard, DHA Phase 6, Lahore, Pakistan',
  google_maps: 'https://maps.google.com',
} as const

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/jaidadgroup',
  instagram: 'https://instagram.com/jaidadgroup',
  youtube: 'https://youtube.com/jaidadgroup',
  linkedin: 'https://linkedin.com/company/jaidadgroup',
  twitter: 'https://twitter.com/jaidadgroup',
} as const

export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Properties', href: '/properties' },
  { label: 'Projects', href: '/projects' },
  { label: 'Construction', href: '/construction' },
  { label: 'Blog', href: '/blog' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const

export const PRICE_RANGES = [
  { label: 'Under 50 Lakh', min: 0, max: 5_000_000 },
  { label: '50L – 1 Crore', min: 5_000_000, max: 10_000_000 },
  { label: '1 – 3 Crore', min: 10_000_000, max: 30_000_000 },
  { label: '3 – 5 Crore', min: 30_000_000, max: 50_000_000 },
  { label: '5+ Crore', min: 50_000_000, max: Infinity },
] as const
