import { Flame, MapPin, Phone, Clock, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export function Footer() {
  const { branches } = useStore();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12 pb-16 sm:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
                <Flame size={22} className="text-amber-50" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Dawood Spices</h3>
                <p className="text-xs text-gray-400">Premium Spice Collection</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Bringing authentic, farm-fresh spices and milled products to your
              kitchen since 1985. Quality you can taste in every pinch.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-amber-700 flex items-center justify-center transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-amber-700 flex items-center justify-center transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-amber-700 flex items-center justify-center transition-colors">
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-amber-400 transition-colors">Whole Spices</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Ground Spices</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Spice Blends</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Premium Spices</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Milled Products</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Seasonings</a></li>
            </ul>
          </div>

          {/* Branches */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Our Branches</h4>
            <ul className="space-y-3 text-sm">
              {branches.map((branch) => (
                <li key={branch.id}>
                  <p className="font-medium text-gray-200">
                    {branch.name.replace('Dawood Spices - ', '')}
                  </p>
                  <p className="text-xs text-gray-500 flex items-start gap-1 mt-0.5">
                    <MapPin size={12} className="mt-0.5 shrink-0" />
                    {branch.address}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone size={16} className="text-amber-500 mt-0.5 shrink-0" />
                <span>+1 (555) 100-2000</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="text-amber-500 mt-0.5 shrink-0" />
                <span>hello@dawoodspices.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={16} className="text-amber-500 mt-0.5 shrink-0" />
                <span>Mon-Sun: 8am - 10pm</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            (c) 2026 Dawood Spices. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Shipping Info</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
