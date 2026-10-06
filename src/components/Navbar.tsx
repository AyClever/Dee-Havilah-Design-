import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, MessageCircle, ChevronDown } from 'lucide-react';
import { Logo } from './Logo';
import { CurrencyCode, CurrencyConfig } from '../types';
import { CURRENCIES } from '../data/fashionData';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenCustomDesign: () => void;
  activeCurrency: CurrencyCode;
  onChangeCurrency: (code: CurrencyCode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenCustomDesign,
  activeCurrency,
  onChangeCurrency,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Collections', href: '#categories' },
    { label: 'Shop', href: '#collections' },
    { label: 'Custom Design', href: '#custom-design' },
    { label: 'The Atelier', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#041A13]/90 backdrop-blur-md py-3 shadow-xl border-b border-[#D4AF37]/20 text-white'
            : 'bg-gradient-to-b from-[#041A13]/85 via-[#041A13]/60 to-transparent py-5 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
            className="group flex items-center"
            aria-label="DEE HAVILAH DESIGN Home"
          >
            <Logo variant="light" showTagline={!isScrolled} />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-xs uppercase tracking-[0.2em] text-cream-100/85 hover:text-[#D4AF37] font-medium transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#D4AF37] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Icons & Button */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Currency Selector */}
            <div className="relative">
              <button
                id="currency-selector-btn"
                type="button"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1 text-[11px] font-medium tracking-wider text-cream-100/90 hover:text-[#D4AF37] bg-white/5 border border-[#D4AF37]/30 px-2.5 py-1.5 rounded-full transition-all"
                title="Select Currency"
              >
                <span>{CURRENCIES[activeCurrency]?.code}</span>
                <ChevronDown className="w-3 h-3 text-[#D4AF37]" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-[#062319] border border-[#D4AF37]/30 rounded-lg shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {Object.values(CURRENCIES).map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        onChangeCurrency(curr.code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#D4AF37]/15 transition-colors ${
                        activeCurrency === curr.code ? 'text-[#D4AF37] font-semibold' : 'text-cream-100/90'
                      }`}
                    >
                      <span>{curr.label}</span>
                      <span className="text-[#D4AF37]">{curr.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Icon */}
            <button
              id="search-btn"
              type="button"
              onClick={onOpenSearch}
              className="p-2 text-cream-100/80 hover:text-[#D4AF37] transition-colors rounded-full hover:bg-white/5"
              aria-label="Search Collections"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Wishlist Icon */}
            <button
              id="wishlist-btn"
              type="button"
              onClick={onOpenWishlist}
              className="relative p-2 text-cream-100/80 hover:text-[#D4AF37] transition-colors rounded-full hover:bg-white/5"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#D4AF37] text-[#041A13] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Icon */}
            <button
              id="cart-btn"
              type="button"
              onClick={onOpenCart}
              className="relative p-2 text-cream-100/80 hover:text-[#D4AF37] transition-colors rounded-full hover:bg-white/5"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#D4AF37] text-[#041A13] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* WhatsApp Concierge Direct Link */}
            <a
              id="navbar-whatsapp-btn"
              href="https://wa.me/2349069215630?text=Hello%20Dee%20Havilah%20Design%20Atelier,%20I%20would%20like%20to%20inquire%20about%20your%20luxury%20collections."
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#25D366] hover:text-[#42e880] transition-colors rounded-full hover:bg-white/5"
              title="Chat with Concierge on WhatsApp"
              aria-label="WhatsApp Concierge"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>

            {/* Shop Collection CTA (Desktop) */}
            <a
              id="shop-collection-nav-btn"
              href="#collections"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#collections');
              }}
              className="hidden md:inline-flex items-center px-4 py-2 text-xs uppercase tracking-[0.18em] font-bold bg-[#D4AF37] hover:bg-[#E5C378] text-[#041A13] rounded-sm transition-all duration-300 shadow-md hover:shadow-[#D4AF37]/30"
            >
              Shop Collection
            </a>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-cream-100 hover:text-[#D4AF37] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-300">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-[#041A13] border-l border-[#D4AF37]/30 p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#D4AF37]/20">
                <Logo variant="light" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-cream-200 hover:text-[#D4AF37]"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="py-6 flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="text-base uppercase tracking-[0.18em] text-cream-100 hover:text-[#D4AF37] font-medium transition-colors py-2 border-b border-white/5"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#D4AF37]/20 space-y-3">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCustomDesign();
                }}
                className="w-full py-3 px-4 text-center text-xs uppercase tracking-[0.2em] font-bold bg-[#D4AF37] text-[#041A13] rounded-md shadow hover:bg-[#E5C378] transition-colors"
              >
                Book Custom Design
              </button>

              <a
                href="https://wa.me/2349069215630?text=Hello%20Dee%20Havilah%20Design,%20I%20would%20like%20to%20inquire%20about%20your%20luxury%20collections."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 text-center text-xs uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 border border-[#D4AF37]/50 text-[#D4AF37] rounded-md hover:bg-[#D4AF37]/10 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                Concierge on WhatsApp
              </a>

              <p className="text-[11px] text-center text-cream-200/60 font-serif italic pt-2">
                Elegance Woven Into Every Style
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
