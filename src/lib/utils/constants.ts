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
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Construction',
    href: '/construction',
    groups: [
      {
        title: 'B-17, MPCHS',
        href: '',
        items: [
          { label: '5 Marla House Construction in B 17', href: '/construction/b-17-mpchs/5-marla-house-construction-in-b-17' },
          { label: '7 Marla House Construction in B 17', href: '/construction/b-17-mpchs/7-marla-house-construction' },
          { label: '10 Marla House Construction in B 17', href: '/construction/b-17-mpchs/10-marla-house-construction' },
          { label: '14 Marla House Construction in B 17', href: '/construction/b-17-mpchs/14-marla-house-construction' },
          { label: '1 Kanal House Construction in B 17', href: '/construction/b-17-mpchs/1-kanal-house-construction' },
          { label: '2 Kanal House Construction in B 17', href: '/construction/b-17-mpchs/2-kanal-house-construction' },
        ],
      },
      {
        title: 'Faisal Hills',
        href: '/construction/faisal-hills',
        items: [
          { label: '5 Marla House Construction in Faisal Hills', href: '/construction/faisal-hills/5-marla-house-construction' },
          { label: '7 Marla House Construction in Faisal Hills', href: '/construction/faisal-hills/7-marla-house-construction' },
          { label: '10 Marla House Construction in Faisal Hills', href: '/construction/faisal-hills/10-marla-house-construction' },
          { label: '14 Marla House Construction in Faisal Hills', href: '/construction/faisal-hills/14-marla-house-construction' },
          { label: '1 Kanal House Construction in Faisal Hills', href: '/construction/faisal-hills/1-kanal-house-construction' },
          { label: '2 Kanal House Construction in Faisal Hills', href: '/construction/faisal-hills/2-kanal-house-construction' },
        ],
      },
      {
        title: 'Faisal Margalla City',
        href: '/construction/faisal-margalla-city',
        items: [
          { label: '5 Marla House Construction in Faisal Margalla City', href: '/construction/faisal-margalla-city/5-marla-house-construction' },
          { label: '7 Marla House Construction in Faisal Margalla City', href: '/construction/faisal-margalla-city/7-marla-house-construction' },
          { label: '10 Marla House Construction in Faisal Margalla City', href: '/construction/faisal-margalla-city/10-marla-house-construction' },
          { label: '14 Marla House Construction in Faisal Margalla City', href: '/construction/faisal-margalla-city/14-marla-house-construction' },
          { label: '1 Kanal House Construction in Faisal Margalla City', href: '/construction/faisal-margalla-city/1-kanal-house-construction' },
          { label: '2 Kanal House Construction in Faisal Margalla City', href: '/construction/faisal-margalla-city/2-kanal-house-construction' },
        ],
      },
      {
        title: 'Faisal Town',
        href: '/construction/faisal-town',
        items: [
          { label: '5 Marla House Construction in Faisal Town', href: '/construction/faisal-town/5-marla-house-construction' },
          { label: '7 Marla House Construction in Faisal Town', href: '/construction/faisal-town/7-marla-house-construction' },
          { label: '10 Marla House Construction in Faisal Town', href: '/construction/faisal-town/10-marla-house-construction' },
          { label: '14 Marla House Construction in Faisal Town', href: '/construction/faisal-town/14-marla-house-construction' },
          { label: '1 Kanal House Construction in Faisal Town', href: '/construction/faisal-town/1-kanal-house-construction' },
          { label: '2 Kanal House Construction in Faisal Town', href: '/construction/faisal-town/2-kanal-house-construction' },
        ],
      },
    ],
  },
  {
    label: 'Residential Plots',
    href: '/residential-plots',
    subItems: [
      { label: 'All Residential', href: '/residential-plots/all-residential' },
      { label: 'Luxury Plots', href: '/residential-plots/luxury-plots' },
      { label: 'Affordable Plots', href: '/residential-plots/affordable-plots' },
    ],
  },
  {
    label: 'Commercial Plots',
    href: '/commercial-plots',
    subItems: [
      { label: 'Retail Plots', href: '/commercial-plots/retail-plots' },
      { label: 'Office Sites', href: '/commercial-plots/office-sites' },
      { label: 'Industrial Land', href: '/commercial-plots/industrial-land' },
    ],
  },
  {
    label: 'Houses',
    href: '/houses',
    subItems: [
      { label: 'Houses for Sale', href: '/houses/for-sale' },
      { label: 'Villas', href: '/houses/villas' },
      { label: 'Townhouses', href: '/houses/townhouses' },
    ],
  },
  {
    label: 'Shop Flat Offices',
    href: '/shop-flat-offices',
    subItems: [
      { label: 'Shops', href: '/shop-flat-offices/shops' },
      { label: 'Flats', href: '/shop-flat-offices/flats' },
      { label: 'Offices', href: '/shop-flat-offices/offices' },
    ],
  },
  {
    label: 'Projects & Marketing',
    href: '/projects',
    subItems: [
      { label: 'Projects', href: '/projects' },
      { label: 'Marketing', href: '/blog' },
      { label: 'Market Insights', href: '/blog' },
    ],
  },
  {
    label: 'Map Designing',
    href: '/map-designing',
    subItems: [
      { label: 'Location Map', href: '/location-map' },
      { label: 'Project Map', href: '/project-map' },
      { label: 'Office Locations', href: '/office-locations' },
    ],
  },
  {
    label: 'Others',
    href: '/about',
    subItems: [
      { label: 'About Us', href: '/about' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Contact', href: '/contact' },
    ],
  },
] as const

export const PRICE_RANGES = [
  { label: 'Under 50 Lakh', min: 0, max: 5_000_000 },
  { label: '50L – 1 Crore', min: 5_000_000, max: 10_000_000 },
  { label: '1 – 3 Crore', min: 10_000_000, max: 30_000_000 },
  { label: '3 – 5 Crore', min: 30_000_000, max: 50_000_000 },
  { label: '5+ Crore', min: 50_000_000, max: Infinity },
] as const
