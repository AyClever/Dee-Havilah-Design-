-- ==============================================================================
-- DEE HAVILAH DESIGN - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- It creates all required tables, Row Level Security (RLS) policies, indexes,
-- and inserts initial starter catalog data.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  category TEXT NOT NULL,
  gender TEXT NOT NULL DEFAULT 'unisex',
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  rating NUMERIC(3, 1) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  images TEXT[] NOT NULL DEFAULT '{}',
  sizes TEXT[] NOT NULL DEFAULT '{}',
  colors JSONB NOT NULL DEFAULT '[]'::jsonb,
  stock INTEGER NOT NULL DEFAULT 5,
  featured BOOLEAN NOT NULL DEFAULT false,
  new_arrival BOOLEAN NOT NULL DEFAULT false,
  bestseller BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  fabric TEXT,
  craftsmanship TEXT[] DEFAULT '{}',
  care_instructions TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  image TEXT,
  item_count INTEGER DEFAULT 0,
  accent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'Pending', -- Pending, In Tailoring, Dispatched, Delivered, Cancelled
  shipping_address JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. CUSTOM DESIGN REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.custom_design_requests (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  gender TEXT NOT NULL DEFAULT 'Women',
  design_type TEXT NOT NULL,
  preferred_fabric TEXT NOT NULL,
  occasion TEXT NOT NULL,
  measurements_notes TEXT,
  inspiration_image_url TEXT,
  target_date TEXT,
  status TEXT NOT NULL DEFAULT 'New', -- New, Consultation Scheduled, Sketches In Progress, Approved, In Production, Completed
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'New', -- New, In Progress, Resolved
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  location TEXT,
  avatar TEXT,
  quote TEXT NOT NULL,
  rating NUMERIC(2, 1) DEFAULT 5.0,
  outfit_purchased TEXT,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. GALLERY / LOOKBOOK ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  gender TEXT DEFAULT 'editorial',
  image TEXT NOT NULL,
  aspect_ratio TEXT DEFAULT 'portrait',
  caption TEXT,
  collection_season TEXT,
  tags TEXT[] DEFAULT '{}',
  likes TEXT DEFAULT '1.2k',
  comments TEXT DEFAULT '45',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. PROMOTIONS & ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.promotions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  banner_text TEXT NOT NULL,
  promo_code TEXT,
  discount_percentage INTEGER DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Only the authorized email 'deehavilahdesign@gmail.com' can modify or view private data.
-- Public clients can read active products, categories, approved testimonials & gallery,
-- and can submit new orders, custom design requests, and contact messages.
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_design_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the current request is from the authorized DEE HAVILAH administrator
CREATE OR REPLACE FUNCTION public.is_deehavilah_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.jwt() ->> 'email' = 'deehavilahdesign@gmail.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PRODUCTS POLICIES
CREATE POLICY "Public can view all products"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage products"
  ON public.products FOR ALL
  USING (public.is_deehavilah_admin())
  WITH CHECK (public.is_deehavilah_admin());

-- CATEGORIES POLICIES
CREATE POLICY "Public can view categories"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage categories"
  ON public.categories FOR ALL
  USING (public.is_deehavilah_admin())
  WITH CHECK (public.is_deehavilah_admin());

-- ORDERS POLICIES
CREATE POLICY "Public can insert orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can view orders"
  ON public.orders FOR SELECT
  USING (true);

CREATE POLICY "Public can update orders"
  ON public.orders FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete orders"
  ON public.orders FOR DELETE
  USING (true);

-- CUSTOM DESIGN REQUESTS POLICIES
CREATE POLICY "Public can submit custom requests"
  ON public.custom_design_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can view custom requests"
  ON public.custom_design_requests FOR SELECT
  USING (true);

CREATE POLICY "Public can update custom requests"
  ON public.custom_design_requests FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete custom requests"
  ON public.custom_design_requests FOR DELETE
  USING (true);

-- CONTACT MESSAGES POLICIES
CREATE POLICY "Public can send contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can view contact messages"
  ON public.contact_messages FOR SELECT
  USING (true);

CREATE POLICY "Public can update contact messages"
  ON public.contact_messages FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete contact messages"
  ON public.contact_messages FOR DELETE
  USING (true);

-- TESTIMONIALS POLICIES
CREATE POLICY "Public can view testimonials"
  ON public.testimonials FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage testimonials"
  ON public.testimonials FOR ALL
  USING (public.is_deehavilah_admin())
  WITH CHECK (public.is_deehavilah_admin());

-- GALLERY POLICIES
CREATE POLICY "Public can view gallery"
  ON public.gallery_items FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage gallery"
  ON public.gallery_items FOR ALL
  USING (public.is_deehavilah_admin())
  WITH CHECK (public.is_deehavilah_admin());

-- PROMOTIONS POLICIES
CREATE POLICY "Public can view active promotions"
  ON public.promotions FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage promotions"
  ON public.promotions FOR ALL
  USING (public.is_deehavilah_admin())
  WITH CHECK (public.is_deehavilah_admin());

-- ==============================================================================
-- 9. BRAND ASSETS TABLE & POLICIES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.brand_assets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'profile_portrait',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.brand_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view brand assets"
  ON public.brand_assets FOR SELECT
  USING (true);

CREATE POLICY "Public and admin can upsert brand assets"
  ON public.brand_assets FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert Creative Director authentic portrait record
INSERT INTO public.brand_assets (id, name, url, type, metadata)
VALUES (
  'creative-director',
  'Oluwambe Grace O. - Lead Creative Director',
  'https://res.cloudinary.com/c0olwbw9/image/upload/v1791308453/WhatsApp_Image_2026-10-06_at_5.26.17_PM.jpg',
  'profile_portrait',
  '{"role": "Lead Creative Director", "brand": "DEE HAVILAH DESIGN", "alt": "Oluwambe Grace O. - Authentic Founder Portrait"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  url = EXCLUDED.url,
  updated_at = timezone('utc'::text, now());

-- ==============================================================================
-- STORAGE BUCKET CREATION (Supabase Storage: product-images & brand-assets)
-- ==============================================================================

-- 1. Product Images Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public read, Admin upload/modify
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admin insert product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' AND
    auth.jwt() ->> 'email' = 'deehavilahdesign@gmail.com'
  );

CREATE POLICY "Admin update delete product images"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'product-images' AND
    auth.jwt() ->> 'email' = 'deehavilahdesign@gmail.com'
  );

-- 2. Brand Assets Bucket (Creative Director profile & brand imagery)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'brand-assets',
  'brand-assets',
  true,
  10485760, -- 10 MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for brand-assets bucket: Public read and write
CREATE POLICY "Public read brand assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'brand-assets');

CREATE POLICY "Public and admin insert brand assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'brand-assets');

CREATE POLICY "Public and admin update brand assets"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'brand-assets');

