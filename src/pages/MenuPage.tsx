import { useEffect } from 'react';
import Header from '@/components/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/Footer';

const MenuPage = () => {
  useEffect(() => {
    // Restore scroll position if returning from detail page
    const savedScrollY = sessionStorage.getItem('menuScrollY');
    if (savedScrollY) {
      // Small delay to ensure the page is rendered
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollY));
        sessionStorage.removeItem('menuScrollY');
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-16">
        <Menu />
      </div>
      <Footer />
    </div>
  );
};

export default MenuPage;
