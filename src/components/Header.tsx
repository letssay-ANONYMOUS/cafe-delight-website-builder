
import { useState } from 'react';
import { Coffee, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/menu', label: 'Menu' },
    { path: '/about', label: 'About' },
    { path: '/locations', label: 'Locations' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-coffee-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Coffee className="h-8 w-8 text-coffee-600" />
            <span className="font-playfair text-2xl font-bold text-coffee-800">
              NAWA CAFÉ
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-coffee-900 border-b-2 border-coffee-600 pb-1'
                    : 'text-coffee-700 hover:text-coffee-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/cart">
              <Button variant="outline" size="icon" className="rounded-full">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <Button className="bg-coffee-600 hover:bg-coffee-700 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105">
              Order Now
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex flex-col space-y-1 w-6 h-6"
          >
            <span className={`w-full h-0.5 bg-coffee-700 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`w-full h-0.5 bg-coffee-700 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-full h-0.5 bg-coffee-700 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-coffee-200 shadow-lg">
            <nav className="flex flex-col space-y-4 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-medium py-2 text-left transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'text-coffee-900 font-semibold'
                      : 'text-coffee-700 hover:text-coffee-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" size="sm" className="rounded-full w-fit gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Cart
                </Button>
              </Link>
              <Button className="bg-coffee-600 hover:bg-coffee-700 text-white px-6 py-2 rounded-full w-fit">
                Order Now
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
