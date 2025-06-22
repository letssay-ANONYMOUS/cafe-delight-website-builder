
import { Coffee, Star } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-coffee-800 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Coffee className="h-8 w-8 text-cream-400" />
              <span className="font-playfair text-2xl font-bold">
                Brew & Bliss
              </span>
            </div>
            <p className="text-cream-200 leading-relaxed mb-4">
              Where every cup tells a story. Experience the perfect blend of artisanal coffee, 
              cozy atmosphere, and exceptional service.
            </p>
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }, (_, index) => (
                <Star key={index} className="w-4 h-4 text-amber-400 fill-current" />
              ))}
              <span className="ml-2 text-cream-200">4.9/5 Customer Rating</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-playfair text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button className="text-cream-200 hover:text-cream-100 transition-colors duration-200">
                  Our Menu
                </button>
              </li>
              <li>
                <button className="text-cream-200 hover:text-cream-100 transition-colors duration-200">
                  About Us
                </button>
              </li>
              <li>
                <button className="text-cream-200 hover:text-cream-100 transition-colors duration-200">
                  Catering
                </button>
              </li>
              <li>
                <button className="text-cream-200 hover:text-cream-100 transition-colors duration-200">
                  Events
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-playfair text-xl font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-cream-200">
              <p>123 Coffee Street</p>
              <p>New York, NY 10001</p>
              <p>(555) 123-BREW</p>
              <p>hello@brewandbliss.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-coffee-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-cream-300 text-sm">
            © 2024 Brew & Bliss Cafe. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button className="text-cream-300 hover:text-cream-100 transition-colors duration-200 text-sm">
              Privacy Policy
            </button>
            <button className="text-cream-300 hover:text-cream-100 transition-colors duration-200 text-sm">
              Terms of Service
            </button>
            <button className="text-cream-300 hover:text-cream-100 transition-colors duration-200 text-sm">
              Cookie Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
