import { useState, useEffect, useRef, useCallback } from 'react';
import { Flame, ArrowRight, Truck, Shield, Star, Sparkles } from 'lucide-react';

interface Banner {
  id: number;
  title: string;
  highlight: string;
  subtitle: string;
  cta: string;
  image: string;
  gradient: string;
  badge: string;
  badgeIcon: 'Flame' | 'Sparkles' | 'Star';
}

const BANNERS: Banner[] = [
  {
    id: 0,
    title: 'Premium Spices,',
    highlight: 'Sourced & Milled',
    subtitle:
      'From farm-fresh whole spices to expertly ground blends, authentic flavor across 5 locations.',
    cta: 'Shop Now',
    image: 'https://images.pexels.com/photos/5332494/pexels-photo-5332494.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gradient: 'from-amber-900 via-amber-800 to-amber-950',
    badge: '100% Authentic Spices',
    badgeIcon: 'Flame',
  },
  {
    id: 1,
    title: 'Up to 30% Off',
    highlight: 'Premium Collection',
    subtitle:
      'Saffron, cardamom, cinnamon and more. Handpicked quality at unbeatable prices this season.',
    cta: 'View Deals',
    image: 'https://images.pexels.com/photos/8250269/pexels-photo-8250269.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gradient: 'from-orange-800 via-red-800 to-amber-950',
    badge: 'Limited Time Offer',
    badgeIcon: 'Sparkles',
  },
  {
    id: 2,
    title: 'Fresh Milled Flours',
    highlight: 'Stone-Ground Daily',
    subtitle:
      'Rice flour, chickpea flour, and more. Milled in-house for maximum freshness and flavor.',
    cta: 'Explore Milled',
    image: 'https://images.pexels.com/photos/5336705/pexels-photo-5336705.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gradient: 'from-amber-800 via-amber-700 to-orange-950',
    badge: 'New Arrivals',
    badgeIcon: 'Star',
  },
];

const AUTO_SLIDE_MS = 3000;

interface BannerCarouselProps {
  onShopNow: () => void;
}

export function BannerCarousel({ onShopNow }: BannerCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % BANNERS.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + BANNERS.length) % BANNERS.length);
  }, []);

  // Auto-slide
  useEffect(() => {
    if (isDragging) return;
    const timer = setInterval(next, AUTO_SLIDE_MS);
    return () => clearInterval(timer);
  }, [next, isDragging, current]);

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startX.current = e.touches[0].clientX;
    currentX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    currentX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!isDragging) return;
    const delta = currentX.current - startX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) next();
      else prev();
    }
    setIsDragging(false);
  };

  // Mouse handlers (for desktop drag)
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
    currentX.current = e.clientX;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    currentX.current = e.clientX;
  };

  const onMouseUp = () => {
    if (!isDragging) return;
    const delta = currentX.current - startX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) next();
      else prev();
    }
    setIsDragging(false);
  };

  const badgeIcons = { Flame, Sparkles, Star };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div
        ref={trackRef}
        className="flex transition-transform duration-500 ease-out"
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {BANNERS.map((banner) => {
          const BadgeIcon = badgeIcons[banner.badgeIcon];
          return (
            <div
              key={banner.id}
              className={`relative min-w-full bg-gradient-to-br ${banner.gradient}`}
            >
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

              <div className="relative max-w-7xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
                <div className="grid lg:grid-cols-2 gap-6 items-center">
                  {/* Text content */}
                  <div className="text-center lg:text-left order-2 lg:order-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 mb-4">
                      <BadgeIcon size={14} className="text-amber-300" />
                      <span className="text-xs font-medium text-amber-100">
                        {banner.badge}
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-2">
                      {banner.title}
                      <br />
                      <span className="text-amber-400">{banner.highlight}</span>
                    </h1>
                    <p className="text-amber-100/80 text-sm sm:text-base mb-5 max-w-md mx-auto lg:mx-0">
                      {banner.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                      <button
                        onClick={onShopNow}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-amber-950 font-semibold rounded-lg transition-colors shadow-lg shadow-amber-500/30"
                      >
                        {banner.cta}
                        <ArrowRight size={18} />
                      </button>
                      <button
                        onClick={onShopNow}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors border border-white/20"
                      >
                        View Bestsellers
                      </button>
                    </div>

                    {/* Trust badges */}
                    <div className="flex flex-wrap gap-4 mt-6 justify-center lg:justify-start">
                      <div className="flex items-center gap-1.5 text-amber-100/70">
                        <Truck size={16} className="text-amber-400" />
                        <span className="text-xs">Free delivery $50+</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-amber-100/70">
                        <Shield size={16} className="text-amber-400" />
                        <span className="text-xs">Quality guaranteed</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-amber-100/70">
                        <Star size={16} className="text-amber-400" />
                        <span className="text-xs">4.8/5 rating</span>
                      </div>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative order-1 lg:order-2">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]">
                      <img
                        src={banner.image}
                        alt={banner.highlight}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-950/40 to-transparent" />
                    </div>
                    {/* Floating badge */}
                    <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 bg-white rounded-xl shadow-xl p-3 sm:p-4 flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-100 flex items-center justify-center">
                        <Flame size={20} className="text-amber-700" />
                      </div>
                      <div>
                        <p className="text-xl sm:text-2xl font-bold text-gray-800">
                          20+
                        </p>
                        <p className="text-xs text-gray-500">Premium Products</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current
                ? 'w-8 bg-amber-400'
                : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Arrow buttons (desktop) */}
      <button
        onClick={prev}
        className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm items-center justify-center text-white transition-colors z-10"
        aria-label="Previous"
      >
        <ArrowRight size={20} className="rotate-180" />
      </button>
      <button
        onClick={next}
        className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm items-center justify-center text-white transition-colors z-10"
        aria-label="Next"
      >
        <ArrowRight size={20} />
      </button>
    </div>
  );
}
