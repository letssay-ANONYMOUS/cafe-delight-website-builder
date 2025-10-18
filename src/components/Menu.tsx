import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState, lazy, Suspense } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Lazy load the card component for better performance
const MenuCard = lazy(() => import('./MenuCard'));

const Menu = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'nawa-breakfast', name: 'NAWA Breakfast', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=300&q=80' },
    { id: 'coffee', name: 'COFFEE', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=300&q=80' },
    { id: 'offer', name: 'YOUR WEEKLY DISCOUNT IS HERE', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=300&q=80' },
    { id: 'lunch-dinner', name: 'Lunch & Dinner', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80' },
    { id: 'pastries', name: 'Pastries & Desserts', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80' },
    { id: 'cold-beverages', name: 'Cold Beverages', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=300&q=80' },
    { id: 'matcha', name: '🍃💚💚 MATCHA LOVERS OFFERS 🍃💚', image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=300&q=80' },
    { id: 'arabic-coffee', name: 'ARABIC COFFEE', image: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?auto=format&fit=crop&w=300&q=80' },
    { id: 'nawa-special-tea', name: 'NAWA SPECIAL TEA', image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=300&q=80' },
    { id: 'nawa-summer', name: 'NAWA SUMMER', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=300&q=80' },
  ];

  // Structured menu with subcategories (151 items total)
  const menuStructure = {
    'nawa-breakfast': {
      'Savoury': Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: `Savoury ${i + 1}`, description: '', price: 0, image: `/menu-images/${i + 1}.jpg` })),
      'Arabic Breakfast & Special Tea': Array.from({ length: 4 }, (_, i) => ({ id: i + 6, name: `Arabic Breakfast ${i + 1}`, description: '', price: 0, image: `/menu-images/${i + 6}.jpg` })),
      'Pancakes & French Toast': Array.from({ length: 3 }, (_, i) => ({ id: i + 10, name: `Pancake ${i + 1}`, description: '', price: 0, image: `/menu-images/${i + 10}.jpg` })),
      'Croissant': Array.from({ length: 3 }, (_, i) => ({ id: i + 13, name: `Croissant ${i + 1}`, description: '', price: 0, image: `/menu-images/${i + 13}.jpg` })),
    },
    'coffee': {
      'Hot Coffee': Array.from({ length: 8 }, (_, i) => ({ id: i + 16, name: `Hot Coffee ${i + 1}`, description: '', price: 0, image: `/menu-images/${i + 16}.jpg` })),
      'Cold Coffee': Array.from({ length: 6 }, (_, i) => ({ id: i + 24, name: `Cold Coffee ${i + 1}`, description: '', price: 0, image: `/menu-images/${i + 24}.jpg` })),
      'Manual Brew': Array.from({ length: 4 }, (_, i) => ({ id: i + 30, name: `Manual Brew ${i + 1}`, description: '', price: 0, image: `/menu-images/${i + 30}.jpg` })),
    },
    'offer': {
      'Special Combos': Array.from({ length: 6 }, (_, i) => ({ id: i + 34, name: `Combo ${i + 1}`, description: '', price: 0, image: `/menu-images/${i + 34}.jpg` })),
    },
    'lunch-dinner': {
      'Salads': Array.from({ length: 6 }, (_, i) => ({ id: i + 40, name: `Salad ${i + 1}`, description: '', price: 0, image: `/menu-images/${i + 40}.jpg` })),
      'Appetizers': Array.from({ length: 8 }, (_, i) => ({ id: i + 46, name: `Appetizer ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min(i + 46, 50)}.jpg` })),
      'Pasta': Array.from({ length: 6 }, (_, i) => ({ id: i + 54, name: `Pasta ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min(i % 50 + 1, 50)}.jpg` })),
      'Risotto': Array.from({ length: 4 }, (_, i) => ({ id: i + 60, name: `Risotto ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 10) % 50 + 1, 50)}.jpg` })),
      'Spanish Dishes': Array.from({ length: 5 }, (_, i) => ({ id: i + 64, name: `Spanish Dish ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 14) % 50 + 1, 50)}.jpg` })),
      'Burgers': Array.from({ length: 5 }, (_, i) => ({ id: i + 69, name: `Burger ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 19) % 50 + 1, 50)}.jpg` })),
      'Serve Share & Eat': Array.from({ length: 4 }, (_, i) => ({ id: i + 74, name: `Share Dish ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 24) % 50 + 1, 50)}.jpg` })),
      'Fries / Sides': Array.from({ length: 6 }, (_, i) => ({ id: i + 78, name: `Side ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 28) % 50 + 1, 50)}.jpg` })),
      'Club Sandwich / Kids Meals': Array.from({ length: 4 }, (_, i) => ({ id: i + 84, name: `Kids Meal ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 34) % 50 + 1, 50)}.jpg` })),
    },
    'pastries': {
      'Cakes & Desserts': Array.from({ length: 15 }, (_, i) => ({ id: i + 88, name: `Dessert ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 38) % 50 + 1, 50)}.jpg` })),
    },
    'cold-beverages': {
      'Milkshakes & Smoothies': Array.from({ length: 8 }, (_, i) => ({ id: i + 103, name: `Shake ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 3) % 50 + 1, 50)}.jpg` })),
      'Mojito': Array.from({ length: 5 }, (_, i) => ({ id: i + 111, name: `Mojito ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 11) % 50 + 1, 50)}.jpg` })),
      'Water': Array.from({ length: 3 }, (_, i) => ({ id: i + 116, name: `Water ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 16) % 50 + 1, 50)}.jpg` })),
      'Infusion': Array.from({ length: 4 }, (_, i) => ({ id: i + 119, name: `Infusion ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 19) % 50 + 1, 50)}.jpg` })),
      'Soft Drinks': Array.from({ length: 3 }, (_, i) => ({ id: i + 123, name: `Soft Drink ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 23) % 50 + 1, 50)}.jpg` })),
    },
    'matcha': {
      'Matcha Drinks': Array.from({ length: 6 }, (_, i) => ({ id: i + 126, name: `Matcha ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 26) % 50 + 1, 50)}.jpg` })),
    },
    'arabic-coffee': {
      'Arabic Coffee': Array.from({ length: 4 }, (_, i) => ({ id: i + 132, name: `Arabic Coffee ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 32) % 50 + 1, 50)}.jpg` })),
    },
    'nawa-special-tea': {
      'Earl Grey Special': Array.from({ length: 3 }, (_, i) => ({ id: i + 136, name: `Earl Grey ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 36) % 50 + 1, 50)}.jpg` })),
      'Green Tea Mango': Array.from({ length: 2 }, (_, i) => ({ id: i + 139, name: `Green Tea ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 39) % 50 + 1, 50)}.jpg` })),
      'Night Green Tea': Array.from({ length: 2 }, (_, i) => ({ id: i + 141, name: `Night Tea ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 41) % 50 + 1, 50)}.jpg` })),
      'Nawa Special Black Tea': Array.from({ length: 2 }, (_, i) => ({ id: i + 143, name: `Black Tea ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 43) % 50 + 1, 50)}.jpg` })),
    },
    'nawa-summer': {
      'Seasonal Desserts': Array.from({ length: 2 }, (_, i) => ({ id: i + 145, name: `Summer Dessert ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 45) % 50 + 1, 50)}.jpg` })),
      'Ice Creams': Array.from({ length: 3 }, (_, i) => ({ id: i + 147, name: `Ice Cream ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 47) % 50 + 1, 50)}.jpg` })),
      'Acai Bowl': Array.from({ length: 1 }, (_, i) => ({ id: i + 150, name: `Acai Bowl ${i + 1}`, description: '', price: 0, image: `/menu-images/${50}.jpg` })),
    },
  };

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
                          onClick={() => setSelectedCard(item.id)}
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
