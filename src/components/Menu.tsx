import { ShoppingCart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Menu = () => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const categories = [
    { id: 'nawa-breakfast', name: 'NAWA Breakfast', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=300&q=80', section: 'nawa-breakfast' },
    { id: 'coffee', name: 'COFFEE', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=300&q=80', section: 'coffee' },
    { id: 'offer', name: 'YOUR WEEKLY DISCOUNT IS HERE', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=300&q=80', section: 'offer' },
    { id: 'lunch-dinner', name: 'Lunch & Dinner', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80', section: 'lunch-dinner' },
    { id: 'pastries', name: 'Pastries & Desserts', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80', section: 'pastries' },
    { id: 'cold-beverages', name: 'Cold Beverages', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=300&q=80', section: 'cold-beverages' },
    { id: 'matcha', name: '🍃💚💚 MATCHA LOVERS OFFERS 🍃💚', image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=300&q=80', section: 'matcha' },
    { id: 'arabic-coffee', name: 'ARABIC COFFEE', image: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?auto=format&fit=crop&w=300&q=80', section: 'arabic-coffee' },
    { id: 'nawa-special-tea', name: 'NAWA SPECIAL TEA', image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=300&q=80', section: 'nawa-special-tea' },
    { id: 'nawa-summer', name: 'NAWA SUMMER', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=300&q=80', section: 'nawa-summer' },
  ];

  // Generate 151 empty cards
  const allCards = Array.from({ length: 151 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    description: '',
    price: 0,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
    section: i < 15 ? 'nawa-breakfast' : 
            i < 30 ? 'coffee' :
            i < 45 ? 'offer' :
            i < 60 ? 'lunch-dinner' :
            i < 75 ? 'pastries' :
            i < 90 ? 'cold-beverages' :
            i < 105 ? 'matcha' :
            i < 120 ? 'arabic-coffee' :
            i < 135 ? 'nawa-special-tea' : 'nawa-summer'
  }));

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 150; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
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
                onClick={() => scrollToSection(category.section)}
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
        {/* Group cards by section */}
        {categories.map((category) => {
          const sectionCards = allCards.filter(card => card.section === category.section);
          
          return (
            <div key={category.id} id={category.section} className="mb-16 scroll-mt-32">
              {/* Section Header */}
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {category.name}
                </h2>
                <p className="text-white/80 text-sm">
                  {sectionCards.length} items
                </p>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sectionCards.map((item) => (
                  <Card
                    key={item.id}
                    onClick={() => setSelectedCard(item.id)}
                    className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-transparent cursor-pointer"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>

                    {/* Golden Footer */}
                    <div className="bg-[#c9a962]/90 backdrop-blur-sm p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-white text-base leading-tight flex-1">
                          {item.name}
                        </h3>
                      </div>
                      
                      <p className="text-white/70 text-xs">
                        Click to view details
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
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
