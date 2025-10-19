import { useEffect } from 'react';
import Header from '@/components/Header';
import About from '@/components/About';
import Footer from '@/components/Footer';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-16">
        <About />
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
