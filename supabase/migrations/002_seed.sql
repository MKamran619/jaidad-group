-- ═══════════════════════════════════════════════════════════
--  J+ Jaidad Group — Seed Data
-- ═══════════════════════════════════════════════════════════

-- ─── CITIES ─────────────────────────────────────────────────
INSERT INTO cities (id, name, province) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Lahore',     'Punjab'),
  ('a1000000-0000-0000-0000-000000000002', 'Islamabad',  'Islamabad Capital Territory'),
  ('a1000000-0000-0000-0000-000000000003', 'Karachi',    'Sindh'),
  ('a1000000-0000-0000-0000-000000000004', 'Rawalpindi', 'Punjab'),
  ('a1000000-0000-0000-0000-000000000005', 'Faisalabad', 'Punjab'),
  ('a1000000-0000-0000-0000-000000000006', 'Peshawar',   'KPK'),
  ('a1000000-0000-0000-0000-000000000007', 'Multan',     'Punjab'),
  ('a1000000-0000-0000-0000-000000000008', 'Quetta',     'Balochistan');

-- ─── SOCIETIES ──────────────────────────────────────────────
INSERT INTO societies (name, city_id) VALUES
  ('DHA Phase 1',       'a1000000-0000-0000-0000-000000000001'),
  ('DHA Phase 5',       'a1000000-0000-0000-0000-000000000001'),
  ('DHA Phase 6',       'a1000000-0000-0000-0000-000000000001'),
  ('Bahria Town Lahore','a1000000-0000-0000-0000-000000000001'),
  ('Gulberg',           'a1000000-0000-0000-0000-000000000001'),
  ('Johar Town',        'a1000000-0000-0000-0000-000000000001'),
  ('Model Town',        'a1000000-0000-0000-0000-000000000001'),
  ('F-6',               'a1000000-0000-0000-0000-000000000002'),
  ('F-7',               'a1000000-0000-0000-0000-000000000002'),
  ('F-10',              'a1000000-0000-0000-0000-000000000002'),
  ('DHA Islamabad',     'a1000000-0000-0000-0000-000000000002'),
  ('Bahria Town Isl',   'a1000000-0000-0000-0000-000000000002'),
  ('Clifton',           'a1000000-0000-0000-0000-000000000003'),
  ('DHA Karachi',       'a1000000-0000-0000-0000-000000000003'),
  ('Defence Karachi',   'a1000000-0000-0000-0000-000000000003');

-- ─── AGENTS ─────────────────────────────────────────────────
INSERT INTO agents (name, designation, email, phone, specializations, languages) VALUES
  ('Muhammad Ali',  'Senior Property Advisor', 'ali@jaidadgroup.com',    '+92-300-1111111', ARRAY['Residential', 'DHA'], ARRAY['Urdu', 'English']),
  ('Sara Malik',    'Commercial Specialist',   'sara@jaidadgroup.com',   '+92-300-2222222', ARRAY['Commercial', 'Office'], ARRAY['Urdu', 'English']),
  ('Ahmed Raza',    'Investment Advisor',      'ahmed@jaidadgroup.com',  '+92-300-3333333', ARRAY['Investment', 'Plots'], ARRAY['Urdu', 'English', 'Punjabi']),
  ('Nadia Hussain', 'Property Consultant',     'nadia@jaidadgroup.com',  '+92-300-4444444', ARRAY['Apartments', 'Rent'], ARRAY['Urdu', 'English']),
  ('Usman Khan',    'Luxury Property Expert',  'usman@jaidadgroup.com',  '+92-300-5555555', ARRAY['Luxury', 'Farmhouse'], ARRAY['Urdu', 'English']);

-- ─── CONSTRUCTION SERVICES ──────────────────────────────────
INSERT INTO construction_services (title, slug, description, features, packages, sort_order) VALUES
  (
    'Residential Construction',
    'residential-construction',
    'Complete residential construction from foundation to finishing. We build your dream home with premium materials and expert craftsmanship.',
    ARRAY['Free architectural design', '3D visualization', 'Quality materials', '1-year warranty'],
    '[{"name":"Economy","price":"2,800","per_unit":"per sqft","features":["Basic finishes","Standard materials","1 year warranty"],"is_popular":false},{"name":"Standard","price":"3,500","per_unit":"per sqft","features":["Premium finishes","Quality materials","2 year warranty","Free design"],"is_popular":true},{"name":"Luxury","price":"5,000","per_unit":"per sqft","features":["Luxury finishes","Imported materials","5 year warranty","Full design team","Project manager"],"is_popular":false}]'::jsonb,
    1
  ),
  (
    'Commercial Construction',
    'commercial-construction',
    'State-of-the-art commercial buildings designed for maximum functionality and aesthetic appeal.',
    ARRAY['Commercial grade materials', 'Structural engineering', 'MEP services', 'Green building'],
    '[{"name":"Basic","price":"3,200","per_unit":"per sqft","features":["Standard commercial finish","Basic MEP"],"is_popular":false},{"name":"Professional","price":"4,200","per_unit":"per sqft","features":["Premium finish","Advanced MEP","Smart systems"],"is_popular":true}]'::jsonb,
    2
  ),
  (
    'Renovation & Remodeling',
    'renovation-remodeling',
    'Transform your existing space with our expert renovation services. From minor updates to complete overhauls.',
    ARRAY['Kitchen renovation', 'Bathroom remodeling', 'Interior redesign', 'Structural changes'],
    '[{"name":"Partial","price":"Contact Us","per_unit":"for quote","features":["Single room/area","Standard materials"],"is_popular":false},{"name":"Full Home","price":"Contact Us","per_unit":"for quote","features":["Complete renovation","Premium materials","Interior design"],"is_popular":true}]'::jsonb,
    3
  ),
  (
    'Interior Design',
    'interior-design',
    'Professional interior design services that transform spaces into stunning, functional environments.',
    ARRAY['3D rendering', 'Furniture selection', 'Color consultation', 'Project management'],
    '[{"name":"Consultation","price":"25,000","per_unit":"flat fee","features":["2-hour session","Mood board","Color palette"],"is_popular":false},{"name":"Full Design","price":"Contact Us","per_unit":"for quote","features":["Complete design package","3D visualization","Furniture sourcing","Supervision"],"is_popular":true}]'::jsonb,
    4
  ),
  (
    'Grey Structure',
    'grey-structure',
    'Expert grey structure construction with certified engineers ensuring structural integrity and durability.',
    ARRAY['Licensed engineers', 'Quality concrete', 'Steel reinforcement', 'Waterproofing'],
    '[{"name":"Standard","price":"1,800","per_unit":"per sqft","features":["RCC structure","Standard concrete"],"is_popular":false},{"name":"Premium","price":"2,200","per_unit":"per sqft","features":["RCC structure","M-30 grade concrete","Waterproofing"],"is_popular":true}]'::jsonb,
    5
  );

-- ─── SITE SETTINGS ──────────────────────────────────────────
INSERT INTO site_settings (key, value, "group") VALUES
  ('company_name',   '"J+ Jaidad Group"', 'general'),
  ('tagline',        '"Your Trusted Real Estate Partner"', 'general'),
  ('phone',          '"+92-300-0000000"', 'contact'),
  ('whatsapp',       '"+923000000000"', 'contact'),
  ('email',          '"info@jaidadgroup.com"', 'contact'),
  ('address',        '"Main Boulevard, DHA Phase 6, Lahore, Pakistan"', 'contact'),
  ('google_maps_url','"https://maps.google.com"', 'contact'),
  ('social_facebook', '"https://facebook.com/jaidadgroup"', 'social'),
  ('social_instagram','"https://instagram.com/jaidadgroup"', 'social'),
  ('social_youtube',  '"https://youtube.com/jaidadgroup"', 'social'),
  ('social_linkedin', '"https://linkedin.com/company/jaidadgroup"', 'social'),
  ('theme_primary',   '"#F5A623"', 'theme'),
  ('theme_secondary', '"#111111"', 'theme'),
  ('hero_image',      '"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80"', 'hero'),
  ('stats_properties','"2,500+"', 'stats'),
  ('stats_clients',   '"1,800+"', 'stats'),
  ('stats_years',     '"19+"', 'stats');

-- ─── TESTIMONIALS ───────────────────────────────────────────
INSERT INTO testimonials (name, designation, company, rating, review, property_purchased, is_featured) VALUES
  ('Ahmed Raza Khan',  'Business Owner',   'Khan Industries',  5, 'Jaidad Group found us the perfect commercial space in Gulberg within our budget. Professional, transparent, and knowledgeable.', 'Commercial Office, Gulberg III', true),
  ('Fatima Malik',     'Doctor',           'Services Hospital', 5, 'After 8 months of searching, Jaidad Group found exactly what I wanted in DHA Phase 5 within 3 weeks. Exceptional service!', 'Residential Villa, DHA Phase 5', true),
  ('Usman Shahid',     'Investment Manager','Alpha Capital',   5, 'We completed 3 transactions through Jaidad Group. Their market insights are invaluable. Our portfolio grew 40% in 2 years.', 'Multiple Investment Properties', true),
  ('Sara Hussain',     'Teacher',          'Govt College',     5, 'Bought my first home through Jaidad Group. The team guided me through every step. Could not have done it without them!', '5-Marla House, Bahria Town', true),
  ('Tariq Mahmood',    'Businessman',      'TM Enterprises',   5, 'Sold our property at 15% above market rate thanks to their marketing. Highly recommend Jaidad Group to everyone.', 'Plot, DHA Phase 6', true),
  ('Amna Siddiqui',    'Entrepreneur',     'AS Tech',          5, 'The construction team built my villa exactly as planned. Premium quality, on time, and within budget. Outstanding work!', 'Villa Construction, Johar Town', true),
  ('Zulfiqar Ali',     'Retired Officer',  null,               5, 'Professional and honest throughout. They found me a perfect apartment for retirement. Forever grateful to this team.', 'Apartment, Clifton Karachi', false),
  ('Nadia Sheikh',     'Pharmacist',       null,               5, 'J+ Jaidad Group turned my dream of owning a home into reality. Their financing guidance was incredibly helpful.', '10-Marla House, DHA Phase 4', false),
  ('Bilal Hassan',     'IT Professional',  'Techsol Inc',      4, 'Great service and good communication throughout the process. Will definitely use again for my next property purchase.', 'Apartment, F-10 Islamabad', false),
  ('Rukhsana Bibi',    'Homemaker',        null,               5, 'My family is so happy in our new home. Jaidad Group listened to all our requirements and delivered beyond expectations.', 'House, Model Town Lahore', false);

-- ─── FAQS ───────────────────────────────────────────────────
INSERT INTO faqs (question, answer, category, sort_order) VALUES
  ('How do I search for properties?', 'Use our advanced search on the properties page. Filter by type, purpose, price range, city, bedrooms, and more to find your perfect property.', 'search', 1),
  ('Are all properties verified?', 'Yes. Every listing on our platform goes through our rigorous verification process including title check, owner verification, and site inspection.', 'trust', 2),
  ('What documents are required to buy a property?', 'You will need your CNIC, proof of income, bank statements, and the property documents. Our legal team guides you through the entire documentation process.', 'legal', 3),
  ('Do you offer home financing?', 'We partner with leading banks to offer competitive home financing options. Contact our team to discuss the best financing solution for your situation.', 'finance', 4),
  ('How long does the property buying process take?', 'Typically 4-8 weeks from offer to completion, depending on financing and documentation. Our team works to expedite the process wherever possible.', 'process', 5),
  ('Can you help sell my property?', 'Absolutely! We provide complete property selling services including valuation, marketing, buyer screening, and transaction management. Contact us for a free valuation.', 'selling', 6),
  ('What construction packages do you offer?', 'We offer Economy (PKR 2,800/sqft), Standard (PKR 3,500/sqft), and Luxury (PKR 5,000/sqft) construction packages. Custom packages are also available.', 'construction', 7),
  ('Do you have properties in cities other than Lahore?', 'Yes! We have properties in Lahore, Islamabad, Karachi, Rawalpindi, Faisalabad, and more cities across Pakistan.', 'general', 8),
  ('Is there a fee for your services?', 'Our standard agent fee is 1% for buyers and sellers. Construction and renovation projects are quoted separately based on scope.', 'fees', 9),
  ('How do I schedule a property visit?', 'You can schedule a visit through our Contact page, WhatsApp, or by calling our office. We offer flexible viewing times including weekends.', 'visits', 10);

-- ─── BLOG AUTHORS ───────────────────────────────────────────
INSERT INTO blog_authors (name, bio, email) VALUES
  ('Jaidad Editorial Team', 'Real estate experts and market analysts at J+ Jaidad Group', 'editorial@jaidadgroup.com'),
  ('Muhammad Jaaid',        'CEO & Founder of J+ Jaidad Group with 19 years of market experience', 'ceo@jaidadgroup.com');

-- ─── GALLERY ────────────────────────────────────────────────
INSERT INTO gallery_items (title, category, type, url, sort_order) VALUES
  ('DHA Phase 6 Villa', 'Properties', 'image', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', 1),
  ('Luxury Apartment Interior', 'Properties', 'image', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80', 2),
  ('Commercial Building', 'Properties', 'image', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', 3),
  ('Construction Site Progress', 'Construction', 'image', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80', 4),
  ('J+ Heights Progress', 'Projects', 'image', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', 5),
  ('Office Interior', 'Office', 'image', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', 6),
  ('Award Ceremony 2024', 'Events', 'image', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', 7),
  ('Farm House', 'Properties', 'image', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', 8),
  ('Bahria Town Project', 'Projects', 'image', 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80', 9),
  ('Modern Kitchen Design', 'Construction', 'image', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', 10),
  ('Swimming Pool Construction', 'Construction', 'image', 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&q=80', 11),
  ('Team Photo 2024', 'Events', 'image', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80', 12);
