import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState, lazy, Suspense } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { menuStructure } from '@/data/menuData';

// Lazy load the card component for better performance
const MenuCard = lazy(() => import('./MenuCard'));

const Menu = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'nawa-breakfast', name: 'NAWA Breakfast', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=300&q=80' },
    { id: 'coffee', name: 'COFFEE', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=300&q=80' },
    { id: 'manual-brew', name: 'MANUAL BREW', image: '/menu-images/manual-brew-1.jpg' },
    { id: 'offer', name: 'YOUR WEEKLY DISCOUNT IS HERE', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=300&q=80' },
    { id: 'lunch-dinner', name: 'Lunch & Dinner', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80' },
    { id: 'appetisers', name: 'Appetisers', image: '/menu-images/appetiser-1.jpg' },
    { id: 'pasta', name: 'Pasta', image: '/menu-images/pasta-1.jpg' },
    { id: 'risotto', name: 'RISOTTO', image: '/menu-images/risotto-1.jpg' },
    { id: 'spanish-dishes', name: 'Spanish Dishes', image: '/menu-images/spanish-1.jpg' },
    { id: 'burgers', name: 'Burgers', image: '/menu-images/burger-1.jpg' },
    { id: 'sharing-meal', name: 'SERVE SHARE & EAT - SHARING MEAL MEAN SHARING LOVE', image: '/menu-images/sharing-meal-1.jpg' },
    { id: 'fries', name: 'Fries', image: '/menu-images/fries-1.jpg' },
    { id: 'club-sandwich', name: 'EATING HEALTHY TO LOSE WEIGHT CLUB SANDWICH', image: '/menu-images/club-sandwich-1.jpg' },
    { id: 'kids-meals', name: 'Kids Meals', image: '/menu-images/kids-meal-1.jpg' },
    { id: 'pastries', name: 'Pastries & Desserts', image: '/menu-images/dessert-1.jpg' },
    { id: 'cold-beverages', name: 'Cold Beverages', image: '/menu-images/cold-coffee-1.jpg' },
    { id: 'mojito', name: 'Mojito', image: '/menu-images/mojito-1.jpg' },
    { id: 'water', name: 'Water', image: '/menu-images/water-1.jpg' },
    { id: 'infusion', name: 'Infusion', image: '/menu-images/infusion-1.jpg' },
    { id: 'fresh-juice', name: 'Fresh Juice', image: '/menu-images/fresh-juice-1.jpg' },
    { id: 'matcha', name: '🍃💚💚 MATCHA LOVERS OFFERS 🍃💚', image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=300&q=80' },
    { id: 'arabic-coffee', name: 'ARABIC COFFEE', image: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?auto=format&fit=crop&w=300&q=80' },
    { id: 'nawa-special-tea', name: 'NAWA SPECIAL TEA', image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=300&q=80' },
    { id: 'nawa-summer', name: 'NAWA SUMMER', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=300&q=80' },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 150;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#4a5f4a]/30 via-[#5a6f5a]/20 to-[#4a5f4a]/30 backdrop-blur-sm">
      {/* Header with Search */}
      <div className="bg-[#4a5f4a]/80 backdrop-blur-md py-4 px-4 sm:px-6 lg:px-8 sticky top-16 z-10">
        <div className="container mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white whitespace-nowrap">Specialty Coffee</h1>
            <div className="flex-1 relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-700 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search Item By Name, Price Or Description."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#c9a962] border-none text-coffee-900 placeholder:text-coffee-700 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="overflow-x-auto py-6 px-4 sm:px-6 lg:px-8 scrollbar-hide">
        <div className="container mx-auto">
          <div className="flex gap-4 min-w-max justify-start">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollToSection(category.id)}
                className="flex-shrink-0 w-40 group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg aspect-[4/3] mb-2">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <p className="text-[#c9a962] text-sm font-medium text-center uppercase leading-tight">
                  {category.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {categories.map((category) => {
          const categoryStructure = menuStructure[category.id as keyof typeof menuStructure];
          if (!categoryStructure) return null;
          
          return (
            <div key={category.id} id={category.id} className="mb-16 scroll-mt-32">
              {/* Section Header */}
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {category.name}
                </h2>
              </div>

              {/* Subsections */}
              {Object.entries(categoryStructure).map(([subsectionName, items]) => (
                <div key={subsectionName} className="mb-12">
                  <h3 className="text-xl md:text-2xl font-semibold text-[#c9a962] mb-6">
                    {subsectionName}
                  </h3>
                  
                  {/* Items Grid with Lazy Loading */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <Suspense fallback={
                      <div className="col-span-full flex justify-center py-8">
                        <div className="w-8 h-8 border-4 border-[#c9a962] border-t-transparent rounded-full animate-spin" />
                      </div>
                    }>
                      {items.map((item) => (
                        <MenuCard
                          key={item.id}
                          item={item}
                        />
                      ))}
                    </Suspense>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Modal for Card Details */}
      <Dialog open={selectedCard !== null} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="bg-[#4a5f4a] border-[#c9a962] text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#c9a962]">
              Item {selectedCard}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-white/80">Content will be added here...</p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Menu;
