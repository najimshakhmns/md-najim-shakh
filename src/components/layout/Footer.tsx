import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Send,
  Heart,
  Globe,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { PolicyType } from '../info/PolicyModal';

interface FooterProps {
  onSelectCategory: (category: string) => void;
  onOpenPolicy: (type: PolicyType) => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenPolicy,
  onOpenTracking,
  onOpenAdmin,
}) => {
  const { settings } = useSettings();
  const { language, t } = useLanguage();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-[#111111] text-zinc-300 border-t border-[#242424] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: Brand & Founder Lockup (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] p-0.5 overflow-hidden bg-black shrink-0">
                <img
                  src={settings.brandLogo}
                  alt={settings.companyName}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold tracking-wider text-white">
                  MNS <span className="text-[#D4AF37]">FASHION</span>
                </h3>
                <p className="text-xs text-zinc-400 font-light italic">
                  "{language === 'bn' ? settings.taglineBn : settings.tagline}"
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Premium Bangladesh fashion atelier founded by{' '}
              <strong className="text-zinc-200 font-semibold">{settings.founderName}</strong> in{' '}
              <strong className="text-zinc-200 font-semibold">{settings.businessAddress}</strong>.
              Crafting luxury Panjabis, heavyweight streetwear, and modern tailoring with pride.
            </p>

            <div className="pt-2 space-y-2 text-xs text-zinc-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{settings.businessAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a
                  href={`tel:${settings.contactNumber}`}
                  className="hover:text-white font-mono font-semibold"
                >
                  {settings.contactNumber}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href={`mailto:${settings.emailAddress}`} className="hover:text-white">
                  {settings.emailAddress}
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Collections & Shop (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono border-b border-zinc-800 pb-2">
              Collections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectCategory('panjabi')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Royal Panjabi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('streetwear')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Monarch Hoodies
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('shirts')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Luxury Shirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('women')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Women's Kurtis
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('men')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Men's Fashion
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('kids')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Kids Collection
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono border-b border-zinc-800 pb-2">
              Customer Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenTracking}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Track Your Order</span>
                  <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('about')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  About MD: Najim Shakh & Brand
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('shipping')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Shipping & Delivery Across 64 Districts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('returns')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  7-Day Return & Size Exchange
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('privacy')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('terms')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="text-xs text-[#D4AF37] hover:underline font-semibold flex items-center gap-1 cursor-pointer pt-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Command Console</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Bangladesh Gateways (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono border-b border-zinc-800 pb-2">
              The MNS Journal
            </h4>
            <p className="text-xs text-zinc-400 font-light">
              Subscribe to receive exclusive invitations to limited seasonal drops and private salon showings.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full text-xs bg-[#1C1C1C] border border-zinc-700 text-white rounded-lg p-2.5 pr-9 focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#D4AF37] hover:text-white cursor-pointer"
                  title="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {newsletterSubscribed && (
                <p className="text-[11px] text-[#D4AF37]">
                  Thank you! You are subscribed to MNS Fashion Brand private journal.
                </p>
              )}
            </form>

            {/* Official Payment Methods Strip */}
            <div className="pt-2">
              <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-2">
                Supported Payment Methods
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-[#1C1C1C] border border-[#D12053]/40 text-[#D12053] font-bold text-[10px] tracking-wide">
                  bKash
                </span>
                <span className="px-2.5 py-1 rounded bg-[#1C1C1C] border border-[#F7941D]/40 text-[#F7941D] font-bold text-[10px] tracking-wide">
                  Nagad
                </span>
                <span className="px-2.5 py-1 rounded bg-[#1C1C1C] border border-[#8C3494]/40 text-[#8C3494] font-bold text-[10px] tracking-wide">
                  Rocket
                </span>
                <span className="px-2.5 py-1 rounded bg-[#1C1C1C] border border-zinc-700 text-zinc-300 font-bold text-[10px] tracking-wide">
                  Cash on Delivery
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-light">
          <p>
            © {new Date().getFullYear()} {settings.companyName}. {t('allRightsReserved')}
          </p>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Founder & Owner: {settings.founderName}</span>
            <span>·</span>
            <span>Palashbari, Gaibandha, Bangladesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
