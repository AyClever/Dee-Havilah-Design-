import React, { useState, useEffect } from 'react';
import { Product, ProductCategory, CartItem, CurrencyCode, ColorOption, AdminUser, CategoryCard } from './types';
import { CURRENCIES, PRODUCTS, CATEGORIES } from './data/fashionData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { FeaturedCollection } from './components/FeaturedCollection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CustomDesignSection } from './components/CustomDesignSection';
import { AboutSection } from './components/AboutSection';
import { Testimonials } from './components/Testimonials';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { CheckoutSuccessModal } from './components/CheckoutSuccessModal';
import { Toast } from './components/Toast';
import { MessageCircle } from 'lucide-react';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { getCurrentAdmin, fetchProducts, fetchCategories } from './services/supabase';

export default function App() {
  // Navigation / Admin Route Detection
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return (
      window.location.hash === '#admin' ||
      window.location.hash.startsWith('#admin') ||
      window.location.pathname.startsWith('/admin')
    );
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => getCurrentAdmin());

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin' || hash.startsWith('#admin')) {
        setIsAdminRoute(true);
      } else if (isAdminRoute && !hash.startsWith('#admin')) {
        setIsAdminRoute(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAdminRoute]);

  // Dynamic Storefront Data (synchronized with Supabase database)
  const [storeProducts, setStoreProducts] = useState<Product[]>(PRODUCTS);
  const [storeCategories, setStoreCategories] = useState<CategoryCard[]>(CATEGORIES);

  useEffect(() => {
    const syncData = async () => {
      try {
        const [prods, cats] = await Promise.all([fetchProducts(), fetchCategories()]);
        if (prods && prods.length > 0) setStoreProducts(prods);
        if (cats && cats.length > 0) setStoreCategories(cats);
      } catch (e) {
        console.warn('Using baseline catalog for storefront:', e);
      }
    };
    syncData();
  }, []);

  // Global Commerce & UI State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const firstProduct = PRODUCTS[0];
    return [
      {
        id: 'cart-init-1',
        product: firstProduct,
        selectedSize: 'L',
        selectedColor: firstProduct.colors[0],
        quantity: 1,
      },
    ];
  });

  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>(['dh-002']);
  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>('USD');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');

  // Modals & Drawers Visibility
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutSuccessOpen, setIsCheckoutSuccessOpen] = useState(false);
  const [confirmedOrderInfo, setConfirmedOrderInfo] = useState<{
    orderNumber: string;
    customerName: string;
    whatsappNumber: string;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // Cart Operations
  const handleAddToCart = (product: Product, size?: string, color?: ColorOption) => {
    const chosenSize = size || product.sizes[0] || 'Standard';
    const chosenColor = color || product.colors[0] || { name: 'Emerald Jewel', hex: '#062319' };

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === chosenSize &&
          item.selectedColor.name === chosenColor.name
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            product,
            selectedSize: chosenSize,
            selectedColor: chosenColor,
            quantity: 1,
          },
        ];
      }
    });

    showToast(`Added "${product.name}" to your shopping bag.`);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Garment removed from shopping bag.');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Wishlist Operations
  const handleToggleWishlist = (product: Product) => {
    setWishlistProductIds((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from your saved list.`);
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`Added "${product.name}" to your saved list.`);
        return [...prev, product.id];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlistProductIds.includes(productId);

  const wishlistProducts = storeProducts.filter((p) => wishlistProductIds.includes(p.id));

  // Navigation Smooth Scroll
  const scrollToSection = (href: string) => {
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // =========================================================================
  // ADMIN DASHBOARD VIEW
  // =========================================================================
  if (isAdminRoute) {
    if (!adminUser) {
      return (
        <AdminLogin
          onLoginSuccess={(user) => {
            setAdminUser(user);
          }}
          onBackToStore={() => {
            window.location.hash = '';
            setIsAdminRoute(false);
          }}
        />
      );
    }

    return (
      <AdminLayout
        user={adminUser}
        onLogout={() => {
          setAdminUser(null);
        }}
        onBackToBoutique={() => {
          window.location.hash = '';
          setIsAdminRoute(false);
        }}
      />
    );
  }

  // =========================================================================
  // CUSTOMER-FACING STOREFRONT VIEW (Completely Preserved & Enhanced with Supabase)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#041A13] text-cream-50 font-sans selection:bg-[#D4AF37]/30 selection:text-white relative">
      {/* 1. Header & Navigation */}
      <Navbar
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        wishlistCount={wishlistProductIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        activeCurrency={activeCurrency}
        onCurrencyChange={(curr) => setActiveCurrency(curr)}
        onNavClick={scrollToSection}
      />

      {/* 2. Main Content Stream */}
      <main>
        {/* Hero Banner with Custom Atelier Commission CTA */}
        <Hero
          onExplore={() => scrollToSection('#categories')}
          onCustomCommission={() => scrollToSection('#custom-design')}
        />

        {/* 6 Signature Line Categories */}
        <Categories
          categories={storeCategories}
          onSelectCategory={(category) => {
            setSelectedCategory(category);
            scrollToSection('#collections');
          }}
          onOpenCustomDesign={() => scrollToSection('#custom-design')}
        />

        {/* Featured Ready-to-Wear and Bespoke Showcase */}
        <FeaturedCollection
          products={storeProducts}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onSelectProduct={(product) => setSelectedProduct(product)}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={isWishlisted}
          currency={CURRENCIES[activeCurrency]}
        />

        {/* Bespoke Haute Couture Commission Interactive Section */}
        <CustomDesignSection onSuccessToast={showToast} />

        {/* The Story Behind Dee Havilah Atelier */}
        <AboutSection onOpenCustomCommission={() => scrollToSection('#custom-design')} />

        {/* Verified Connoisseurs Testimonials */}
        <Testimonials />

        {/* Contact & Atelier Visiting */}
        <ContactSection onSuccessToast={showToast} />
      </main>

      {/* Footer */}
      <Footer
        onNavClick={scrollToSection}
        onSuccessToast={showToast}
        onOpenAdmin={() => {
          window.location.hash = '#admin';
          setIsAdminRoute(true);
        }}
      />

      {/* Floating WhatsApp Quick Concierge Button */}
      <a
        id="floating-whatsapp-concierge-btn"
        href="https://wa.me/2349069215630?text=Hello%20Dee%20Havilah%20Design%20Atelier,%20I%20would%20like%20to%20speak%20with%20a%20private%20stylist."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-30 p-3.5 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center gap-2 group border border-white/20"
        title="Chat with Dee Havilah Concierge on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs uppercase tracking-wider font-bold">
          VIP Concierge
        </span>
      </a>

      {/* Modals and Slide-overs */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(product, size, color) => {
          handleAddToCart(product, size, color);
          setSelectedProduct(null);
        }}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={selectedProduct ? isWishlisted(selectedProduct.id) : false}
        currency={CURRENCIES[activeCurrency]}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        currency={CURRENCIES[activeCurrency]}
        onCheckoutComplete={(info) => {
          setConfirmedOrderInfo(info);
          handleClearCart();
          setIsCheckoutSuccessOpen(true);
        }}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlistProducts}
        onRemoveFromWishlist={(id) => {
          setWishlistProductIds((prev) => prev.filter((item) => item !== id));
          showToast('Item removed from saved list.');
        }}
        onAddToCart={(product) => {
          handleAddToCart(product);
          setIsCartOpen(true);
        }}
        onSelectProduct={(product) => setSelectedProduct(product)}
        currency={CURRENCIES[activeCurrency]}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(product) => setSelectedProduct(product)}
        currency={CURRENCIES[activeCurrency]}
      />

      <CheckoutSuccessModal
        isOpen={isCheckoutSuccessOpen}
        onClose={() => {
          setIsCheckoutSuccessOpen(false);
          setConfirmedOrderInfo(null);
        }}
        orderInfo={confirmedOrderInfo}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
