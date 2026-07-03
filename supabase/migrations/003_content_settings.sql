-- Content settings — run this in Supabase SQL Editor
-- Adds all dynamic content: contact, team, offices, why-choose-us, construction, etc.

INSERT INTO site_settings (key, value, "group") VALUES

-- ─── Contact ──────────────────────────────────────────────────────────────────
('phone',           '"+92-300-0000000"',                       'contact'),
('whatsapp',        '"923000000000"',                          'contact'),
('email',           '"info@jaidadgroup.com"',                  'contact'),
('address',         '"Main Boulevard, DHA Phase 6, Lahore, Pakistan"', 'contact'),
('google_maps_url', '"https://maps.google.com"',               'contact'),
('blog_author_name','"Jaidad Team"',                           'general'),

-- ─── Social Links ─────────────────────────────────────────────────────────────
('social_facebook',  '"https://facebook.com/jaidadgroup"',     'social'),
('social_instagram', '"https://instagram.com/jaidadgroup"',    'social'),
('social_youtube',   '"https://youtube.com/jaidadgroup"',      'social'),
('social_linkedin',  '"https://linkedin.com/company/jaidadgroup"', 'social'),
('social_twitter',   '"https://twitter.com/jaidadgroup"',      'social'),

-- ─── Header / Footer ──────────────────────────────────────────────────────────
('header_welcome',    '"Welcome to J+ Jaidad Group — Pakistan''s Premium Real Estate Partner"', 'general'),
('footer_description','"Pakistan''s premier real estate group offering luxury residential, commercial, and investment properties with unmatched expertise since 2005."', 'general'),

-- ─── Images ───────────────────────────────────────────────────────────────────
('property_fallback_image',  '"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80"', 'general'),
('about_hero_image',         '"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=60"', 'about'),
('about_office_image',       '"https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&q=80"',    'about'),
('construction_hero_image',  '"https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1400&q=80"',   'construction'),

-- ─── Popular Locations ────────────────────────────────────────────────────────
('popular_locations', '["DHA Lahore","Bahria Town","Gulberg","F-10 Islamabad"]', 'general'),

-- ─── About: Mission & Vision ──────────────────────────────────────────────────
('about_mission', '"Making real estate accessible and transparent for every Pakistani family"', 'about'),
('about_vision',  '"To be South Asia''s most trusted and innovative real estate group by 2030"', 'about'),
('about_story_1', '"Founded in 2005 by Muhammad Jaaid, J+ Jaidad Group started as a small brokerage in Lahore with a simple yet powerful mission: to make real estate transactions transparent, honest, and rewarding for every client."', 'about'),
('about_story_2', '"Today, with 80+ certified agents, offices in 5 major cities, and a portfolio of 2,500+ properties, we are Pakistan''s most trusted real estate partner for families, investors, and businesses alike."', 'about'),

-- ─── Team Members ─────────────────────────────────────────────────────────────
('team_members', '[
  {"name":"Muhammad Jaaid","role":"CEO & Founder","image":"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80","bio":"20+ years of real estate expertise"},
  {"name":"Sara Ahmed","role":"Head of Sales","image":"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80","bio":"Expert in luxury residential properties"},
  {"name":"Ali Hassan","role":"Property Analyst","image":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80","bio":"Data-driven market research specialist"},
  {"name":"Nadia Khan","role":"Legal Advisor","image":"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80","bio":"Property law and documentation expert"}
]', 'about'),

-- ─── Company Milestones ───────────────────────────────────────────────────────
('milestones', '[
  {"year":"2005","event":"J+ Jaidad Group Founded in Lahore"},
  {"year":"2008","event":"Expanded to Islamabad & Karachi"},
  {"year":"2012","event":"Launched Construction Division"},
  {"year":"2015","event":"Completed 1,000+ Property Transactions"},
  {"year":"2018","event":"Launched J+ Heights Residential Project"},
  {"year":"2022","event":"Awarded Most Trusted Real Estate Company"},
  {"year":"2024","event":"Reached 2,500+ Properties Portfolio"}
]', 'about'),

-- ─── Office Locations ─────────────────────────────────────────────────────────
('offices', '[
  {"city":"Lahore (HQ)","address":"Main Boulevard, DHA Phase 6, Lahore","phone":"+92-42-0000000","hours":"Mon–Sat: 9am–7pm"},
  {"city":"Islamabad","address":"F-10 Markaz, Islamabad","phone":"+92-51-0000000","hours":"Mon–Sat: 9am–6pm"},
  {"city":"Karachi","address":"Clifton Block 5, Karachi","phone":"+92-21-0000000","hours":"Mon–Sat: 9am–6pm"}
]', 'contact'),

-- ─── Why Choose Us ────────────────────────────────────────────────────────────
('why_choose_us', '[
  {"icon":"FiShield","title":"Verified Properties","description":"Every listing is verified by our expert team ensuring 100% authentic and fraud-free transactions.","color":"from-blue-500 to-blue-600"},
  {"icon":"FiTrendingUp","title":"Best Investment ROI","description":"Our market analysts identify high-growth areas to maximize your investment returns.","color":"from-green-500 to-emerald-600"},
  {"icon":"FiHome","title":"2,500+ Properties","description":"Pakistan''s largest curated portfolio of premium residential and commercial properties.","color":"from-amber-400 to-amber-600"},
  {"icon":"FiUsers","title":"Expert Agents","description":"Our certified agents bring 19+ years of combined market expertise and local knowledge.","color":"from-purple-500 to-violet-600"},
  {"icon":"FiAward","title":"Award Winning","description":"Recognized as Pakistan''s Most Trusted Real Estate Company for 5 consecutive years.","color":"from-rose-500 to-pink-600"},
  {"icon":"FiClock","title":"24/7 Support","description":"Our dedicated support team is available around the clock for all your property needs.","color":"from-cyan-500 to-teal-600"}
]', 'general'),

-- ─── Construction Stats ───────────────────────────────────────────────────────
('construction_stat_projects',  '"500+"', 'construction'),
('construction_stat_years',     '"19+"',  'construction'),
('construction_stat_quality',   '"100%"', 'construction'),
('construction_stat_engineers', '"50+"',  'construction'),

-- ─── Construction Process ─────────────────────────────────────────────────────
('construction_process', '[
  {"step":"01","title":"Free Consultation","description":"Meet our experts to discuss your vision, requirements, and budget. We listen carefully to understand exactly what you want."},
  {"step":"02","title":"Site Survey","description":"Our engineers visit the site to assess soil conditions, existing structures, and constraints before planning."},
  {"step":"03","title":"Design & Planning","description":"Our architects create detailed architectural designs, structural drawings, and 3D visualizations for your approval."},
  {"step":"04","title":"Contract & Timeline","description":"We provide a transparent contract with clear milestone-based payment schedule and committed completion dates."},
  {"step":"05","title":"Construction","description":"Our skilled teams begin construction with regular quality checks, daily progress reports, and strict adherence to timeline."},
  {"step":"06","title":"Handover","description":"After thorough inspection and punch list completion, we hand over your dream home with a comprehensive warranty."}
]', 'construction'),

-- ─── Construction Packages ────────────────────────────────────────────────────
('construction_packages', '[
  {"name":"Economy","price":"3,000 – 4,500","per":"per Sqft","popular":false,"features":["Standard Grade Materials","Basic RCC Structure","Standard Tiles & Paint","Basic Kitchen Cabinets","1 Year Warranty"]},
  {"name":"Standard","price":"5,000 – 7,500","per":"per Sqft","popular":true,"features":["Premium Grade Materials","Enhanced Structural Design","Imported Tiles & Premium Paint","Custom Kitchen Design","Branded Fixtures","2 Year Warranty"]},
  {"name":"Luxury","price":"8,500+","per":"per Sqft","popular":false,"features":["Luxury Grade Materials","German Machinery Used","Italian Marble Flooring","European Fixtures","Smart Home Integration","3 Year Structural Warranty","Dedicated Project Manager"]}
]', 'construction'),

-- ─── Construction FAQs ────────────────────────────────────────────────────────
('construction_faqs', '[
  {"q":"How long does it take to build a 5-Marla house?","a":"Typically 10–14 months for a 5-Marla house depending on the package. Grey structure takes 4–5 months, finishing 4–6 months, and final touches 1–2 months."},
  {"q":"Do you provide material or is it customer-supplied?","a":"We provide all materials under Standard and Premium packages. Under Economy package, we can work with customer-supplied materials with our supervision."},
  {"q":"What is included in the warranty?","a":"Structural defects (foundation, pillars, slabs) are covered for up to 3 years based on package. Finishing warranty covers waterproofing, paint, and tiling for 1 year."},
  {"q":"Do you handle approvals from CDA/LDA/DHA?","a":"Yes, our architecture team handles all permit applications and NOC documentation for approved housing societies and CDA/LDA registered projects."},
  {"q":"Can I make changes during construction?","a":"Minor changes are accommodated during the design phase. Changes during construction may incur additional costs."},
  {"q":"Do you offer payment plans?","a":"We offer milestone-based payment plans: 20% advance, 30% on foundation, 30% on structure, 15% on finishing, 5% on handover."}
]', 'construction')

ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
