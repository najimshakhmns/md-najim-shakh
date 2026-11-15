import React from 'react';
import { ArrowRight, Sparkles, Shield, Truck, RefreshCw, Award } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';

interface HeroProps {
  onShopNow: () => void;
  onExploreCollection: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopNow, onExploreCollection }) => {
  const { settings } = useSettings();
  const { language, t } = useLanguage();

  return (
    <div className="relative bg-[#111111] text-[#FAF9F6] overflow-hidden border-b border-[#242424]">
      {/* Hero Visual Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Editorial Brand Typography */}
          <div className="lg:col-span-7 space-y-6 z-10">
            {/* Top Brand Monogram Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1F1F1F] border border-[#333333] rounded-full text-xs text-[#D4AF37]">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-semibold tracking-wider uppercase text-[11px]">
                {language === 'bn' ? 'এমএনএস সিগনেচার কালেকশন ২০২৬' : 'MNS SIGNATURE COLLECTION 2026'}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF9F6] leading-[1.12]">
              {language === 'bn' ? (
                <>
                  নিজের স্টাইল তৈরি করুন। <br />
                  <span className="text-[#D4AF37] italic font-normal">নিজস্ব পরিচয় গড়ে তুলুন।</span>
                </>
              ) : (
                <>
                  DEFINE YOUR STYLE. <br />
                  <span className="text-[#D4AF37] italic font-normal">OWN YOUR IDENTITY.</span>
                </>
              )}
            </h1>

            {/* Description */}
            <p className="text-zinc-300 text-sm sm:text-base max-w-xl leading-relaxed font-light">
              {language === 'bn' ? settings.heroDescriptionBn : settings.heroDescription}
            </p>

            {/* Founder Note Badge */}
            <div className="flex items-center gap-3 pt-1">
              <div className="w-10 h-10 rounded-full border border-[#D4AF37] p-0.5 shrink-0 overflow-hidden bg-[#181818]">
                <img
                  src={settings.brandLogo}
                  alt={settings.founderName}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-200">
                  {settings.founderName}
                </p>
                <p className="text-[11px] text-[#D4AF37] tracking-wider uppercase">
                  {t('founderTitle')} · Palashbari, Gaibandha
                </p>
              </div>
            </div>

            {/* Call To Actions */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                onClick={onShopNow}
                className="inline-flex items-center justify-center gap-2.5 bg-[#D4AF37] hover:bg-[#B89628] text-[#111111] font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-full shadow-lg transition-all hover:scale-105 cursor-pointer"
              >
                <span>{t('shopNow')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreCollection}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-zinc-700 hover:border-[#D4AF37] text-zinc-200 hover:text-[#D4AF37] text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer bg-[#181818]/60 backdrop-blur-sm"
              >
                <span>{t('exploreCollection')}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Fashion Campaign Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Gold decorative ambient glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/30 to-amber-600/20 rounded-2xl blur-xl opacity-50" />

              <div className="relative rounded-2xl overflow-hidden border border-[#2E2E2E] shadow-2xl bg-zinc-900 aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5]">
                <img
                  src={settings.heroImage}
                  alt="MNS Luxury Fashion Campaign"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <div className="flex items-center justify-between text-xs text-zinc-300">
                    <span className="font-mono uppercase tracking-widest text-[#D4AF37]">
                      AUTUMN/WINTER 2026
                    </span>
                    <span className="text-zinc-400">Palashbari Atelier</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white mt-1">
                    Royal Heritage Panjabi & Streetwear
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Craftsmanship Strip */}
      <div className="border-t border-[#222222] bg-[#141414] py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-zinc-300 text-xs">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <div>
              <p className="font-semibold text-zinc-100">Master Craftsmanship</p>
              <p className="text-[11px] text-zinc-400">Authentic Bangladeshi tailoring</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <div>
              <p className="font-semibold text-zinc-100">Nationwide Delivery</p>
              <p className="text-[11px] text-zinc-400">All 64 districts in Bangladesh</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <div>
              <p className="font-semibold text-zinc-100">bKash, Nagad & COD</p>
              <p className="text-[11px] text-zinc-400">100% verified secure payment</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <div>
              <p className="font-semibold text-zinc-100">7-Day Easy Exchange</p>
              <p className="text-[11px] text-zinc-400">Direct helpline: 01341422732</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
