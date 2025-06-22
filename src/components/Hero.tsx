
import { Button } from '@/components/ui/button';

const Hero = () => {
  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=2000&q=80"
          alt="Premium coffee beans"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Where Every Cup
            <span className="block text-cream-200">Tells a Story</span>
          </h1>
          <p className="text-xl md:text-2xl text-cream-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience the perfect blend of artisanal coffee, cozy atmosphere, and exceptional service at Brew & Bliss Cafe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={scrollToMenu}
              className="bg-cream-400 hover:bg-cream-500 text-coffee-800 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Explore Our Menu
            </Button>
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-coffee-800 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Visit Us Today
            </Button>
          </div>
        </div>

        {/* Floating Coffee Steam Animation */}
        <div className="absolute top-1/4 right-1/4 animate-bounce-gentle opacity-30">
          <div className="w-2 h-12 coffee-steam rounded-full"></div>
        </div>
        <div className="absolute top-1/3 left-1/4 animate-bounce-gentle opacity-20" style={{ animationDelay: '1s' }}>
          <div className="w-2 h-8 coffee-steam rounded-full"></div>
        </div>
        <div className="absolute bottom-1/3 right-1/3 animate-bounce-gentle opacity-25" style={{ animationDelay: '2s' }}>
          <div className="w-2 h-10 coffee-steam rounded-full"></div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button
          onClick={scrollToMenu}
          className="text-white/80 hover:text-white transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Hero;
