import React, { useState } from 'react';
import {
  Database,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Server,
  FolderLock,
} from 'lucide-react';
import {
  isSupabaseConfigured,
  getStoredSupabaseConfig,
  saveSupabaseConfig,
  getSupabase,
  AUTHORIZED_ADMIN_EMAIL,
} from '../../services/supabase';

export const AdminDatabaseSetup: React.FC = () => {
  const [config, setConfig] = useState(getStoredSupabaseConfig);
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const isConnected = isSupabaseConfigured();

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig({
      url: config.url.trim(),
      anonKey: config.anonKey.trim(),
    });
    setTestResult({
      tested: true,
      success: true,
      message: 'Supabase configuration saved to app storage.',
    });
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    const supabase = getSupabase();
    if (!supabase) {
      setIsTesting(false);
      setTestResult({
        tested: true,
        success: false,
        message: 'No Supabase URL and Anon Key provided. Enter credentials below.',
      });
      return;
    }

    try {
      const { data, error } = await supabase.from('products').select('count', { count: 'exact' });

      if (error) {
        if (error.code === '42P01') {
          // Relation does not exist
          setTestResult({
            tested: true,
            success: false,
            message:
              'Connected to Supabase project, but the "products" table was not found. Please run the SQL schema below in your Supabase SQL Editor.',
          });
        } else {
          setTestResult({
            tested: true,
            success: false,
            message: `Supabase returned: ${error.message} (Code: ${error.code})`,
          });
        }
      } else {
        setTestResult({
          tested: true,
          success: true,
          message: 'Connection verified! Supabase database and tables are active and reachable.',
        });
      }
    } catch (err: any) {
      setTestResult({
        tested: true,
        success: false,
        message: `Connection failed: ${err.message || 'Network error'}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const sqlSchemaText = `-- ==============================================================================
-- DEE HAVILAH DESIGN - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================
-- Paste this script into your Supabase SQL Editor and click "Run".
-- Authorized Admin: ${AUTHORIZED_ADMIN_EMAIL}
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PRODUCTS
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

-- CATEGORIES
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

-- ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'Pending',
  shipping_address JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- CUSTOM DESIGN REQUESTS
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
  status TEXT NOT NULL DEFAULT 'New',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'New',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- TESTIMONIALS
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

-- GALLERY ITEMS
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id TEXT PRIMARY KEY,
  title TEXT,
  category TEXT,
  gender TEXT DEFAULT 'editorial',
  image TEXT NOT NULL,
  caption TEXT,
  likes TEXT DEFAULT '1.2k',
  comments TEXT DEFAULT '45',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- PROMOTIONS
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

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_design_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- ADMIN CHECK FUNCTION
CREATE OR REPLACE FUNCTION public.is_deehavilah_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() ->> 'email' = '${AUTHORIZED_ADMIN_EMAIL}');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS POLICIES
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin write products" ON public.products FOR ALL USING (public.is_deehavilah_admin()) WITH CHECK (public.is_deehavilah_admin());

CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin write categories" ON public.categories FOR ALL USING (public.is_deehavilah_admin()) WITH CHECK (public.is_deehavilah_admin());

CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete orders" ON public.orders FOR DELETE USING (true);

CREATE POLICY "Public insert custom requests" ON public.custom_design_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read custom requests" ON public.custom_design_requests FOR SELECT USING (true);
CREATE POLICY "Public update custom requests" ON public.custom_design_requests FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete custom requests" ON public.custom_design_requests FOR DELETE USING (true);

CREATE POLICY "Public insert messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read messages" ON public.contact_messages FOR SELECT USING (true);
CREATE POLICY "Public update messages" ON public.contact_messages FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete messages" ON public.contact_messages FOR DELETE USING (true);

CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Admin write testimonials" ON public.testimonials FOR ALL USING (public.is_deehavilah_admin()) WITH CHECK (public.is_deehavilah_admin());

CREATE POLICY "Public read gallery" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Admin write gallery" ON public.gallery_items FOR ALL USING (public.is_deehavilah_admin()) WITH CHECK (public.is_deehavilah_admin());

CREATE POLICY "Public read promotions" ON public.promotions FOR SELECT USING (true);
CREATE POLICY "Admin write promotions" ON public.promotions FOR ALL USING (public.is_deehavilah_admin()) WITH CHECK (public.is_deehavilah_admin());

-- STORAGE BUCKETS: product-images & brand-assets
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Public read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admin upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.jwt() ->> 'email' = '${AUTHORIZED_ADMIN_EMAIL}');

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('brand-assets', 'brand-assets', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET public = true;
CREATE POLICY "Public read brand assets" ON storage.objects FOR SELECT USING (bucket_id = 'brand-assets');
CREATE POLICY "Public and admin upload brand assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'brand-assets');
CREATE POLICY "Public and admin update brand assets" ON storage.objects FOR UPDATE USING (bucket_id = 'brand-assets');
`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlSchemaText);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-cream-50">
          Supabase Database & Infrastructure
        </h2>
        <p className="text-xs text-cream-200/70 mt-1">
          Verify database connectivity, configure API keys, and review Row Level Security (RLS) policies.
        </p>
      </div>

      {/* Connection Status Card */}
      <div className="bg-[#062319]/80 border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D4AF37]/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#041A13] border border-[#D4AF37]/30 rounded-xl text-[#D4AF37]">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-cream-50">
                  Supabase Backend Engine
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                    isConnected
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {isConnected ? 'Configuration Active' : 'Offline / Preview Mode'}
                </span>
              </div>
              <p className="text-xs text-cream-200/60 mt-0.5">
                Authorized Admin: <strong className="text-[#D4AF37] font-mono">{AUTHORIZED_ADMIN_EMAIL}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-[#D4AF37]/40 text-[#D4AF37] rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Testing Link...' : 'Test Connection'}</span>
          </button>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div
            className={`mt-4 p-4 rounded-xl border text-xs flex items-start gap-3 ${
              testResult.success
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                : 'bg-amber-950/70 border-amber-500/50 text-amber-200'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="leading-relaxed">{testResult.message}</div>
          </div>
        )}

        {/* Settings Form */}
        <form onSubmit={handleSaveConfig} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-1.5">
                Supabase Project URL
              </label>
              <input
                type="url"
                value={config.url}
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-3.5 py-2.5 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs font-mono text-cream-100 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-1.5">
                Supabase Anon / Public Key
              </label>
              <input
                type="text"
                value={config.anonKey}
                onChange={(e) => setConfig({ ...config, anonKey: e.target.value })}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3.5 py-2.5 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs font-mono text-cream-100 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-[11px] text-cream-200/50 italic">
              Note: Never use service-role secret keys here; anon public key is sufficient with RLS.
            </span>
            <button
              type="submit"
              className="px-5 py-2 bg-[#D4AF37] text-[#041A13] font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#E5C378] transition-colors"
            >
              Update Credentials
            </button>
          </div>
        </form>
      </div>

      {/* SQL Setup Script & Guide */}
      <div className="bg-[#062319]/80 border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/20 mb-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-cream-50">
              Supabase SQL Schema & Row Level Security (RLS)
            </h3>
            <p className="text-xs text-cream-200/60 font-light mt-0.5">
              Copy this schema into your Supabase Dashboard (SQL Editor) to configure all 8 tables, storage bucket, and admin security policies.
            </p>
          </div>

          <button
            type="button"
            onClick={copySqlToClipboard}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#E5C378] text-[#041A13] font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 transition-colors cursor-pointer shrink-0 shadow"
          >
            {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
          </button>
        </div>

        {/* Code display */}
        <div className="relative rounded-xl overflow-hidden border border-[#D4AF37]/30 bg-[#041A13]">
          <pre className="p-4 text-[11px] font-mono text-cream-200/80 overflow-x-auto max-h-80 leading-relaxed">
            {sqlSchemaText}
          </pre>
        </div>
      </div>
    </div>
  );
};
