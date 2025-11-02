import { Search, Plus, FolderPlus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, lazy, Suspense, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { menuStructure } from '@/data/menuData';
import { useAdmin } from '@/contexts/AdminContext';
import { AdminCardModal } from './AdminCardModal';
import { AdminSectionModal } from './AdminSectionModal';
import { AdminDeleteConfirm } from './AdminDeleteConfirm';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Lazy load the card component for better performance
const MenuCard = lazy(() => import('./MenuCard'));

const Menu = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAdmin, addPendingChange } = useAdmin();
  const { toast } = useToast();
  const [showCardModal, setShowCardModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);
  const [deletingCard, setDeletingCard] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch menu items from database
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('published', true)
          .order('id', { ascending: true });

        if (error) throw error;
        setMenuItems(data || []);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

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

  const menuCategories = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    sections: Object.keys(menuStructure[cat.id as keyof typeof menuStructure] || {})
  }));

  const handleAddNew = () => {
    setEditingCard(null);
    setShowCardModal(true);
  };

  const handleEdit = (item: any) => {
    setEditingCard(item);
    setShowCardModal(true);
  };

  const handleDelete = (item: any) => {
    setDeletingCard(item);
    setShowDeleteConfirm(true);
  };

  const handleSaveCard = (data: any) => {
    addPendingChange({
      type: editingCard ? 'edit' : 'add',
      page: 'menu',
      category: data.category,
      section: data.section,
      data,
      id: editingCard?.id
    });
  };

  const confirmDelete = () => {
    addPendingChange({
      type: 'delete',
      page: 'menu',
      id: deletingCard.id
    });
    setShowDeleteConfirm(false);
    toast({
      title: 'Changes staged',
      description: 'Card deletion staged. Click Save in footer to apply.',
    });
  };

  const handleSaveSection = (type: 'category' | 'section', data: any) => {
    addPendingChange({
      type: 'add',
      page: 'menu',
      data: { type, ...data }
    });
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
            {isAdmin && (
              <div className="flex gap-2">
                <Button
                  onClick={handleAddNew}
                  className="bg-coffee-600 hover:bg-coffee-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Card
                </Button>
                <Button
                  onClick={() => setShowSectionModal(true)}
                  variant="outline"
                  className="bg-coffee-100 hover:bg-coffee-200 text-coffee-900"
                >
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Add Category/Section
                </Button>
              </div>
            )}
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
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#c9a962] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          (() => {
            let globalCardNumber = 1;
            
            // For NAWA Breakfast category only
            const nawaBreakfastCategory = categories.find(c => c.id === 'nawa-breakfast');
            if (!nawaBreakfastCategory) return null;

            // Get items for NAWA Breakfast from database
            const breakfastItems = menuItems.filter(item => 
              item.category === 'Breakfast' || 
              item.category === 'Croissants' ||
              item.category === 'Pancakes' ||
              item.category === 'French Toast'
            );

            return (
              <div key="nawa-breakfast" id="nawa-breakfast" className="mb-16 scroll-mt-32">
                {/* Section Header */}
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {nawaBreakfastCategory.name}
                  </h2>
                </div>

                {/* Breakfast Items */}
                <div className="mb-12">
                  <h3 className="text-xl md:text-2xl font-semibold text-[#c9a962] mb-6">
                    Savoury
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    <Suspense fallback={
                      <div className="col-span-full flex justify-center py-8">
                        <div className="w-8 h-8 border-4 border-[#c9a962] border-t-transparent rounded-full animate-spin" />
                      </div>
                    }>
                      {breakfastItems
                        .filter(item => item.category === 'Breakfast')
                        .slice(0, 12)
                        .map((item) => {
                          const currentNumber = globalCardNumber++;
                          return (
                            <MenuCard
                              key={item.id}
                              item={item}
                              cardNumber={currentNumber}
                              onEdit={() => handleEdit(item)}
                              onDelete={() => handleDelete(item)}
                            />
                          );
                        })}
                    </Suspense>
                  </div>
                </div>

                {/* Arabic Breakfast */}
                <div className="mb-12">
                  <h3 className="text-xl md:text-2xl font-semibold text-[#c9a962] mb-6">
                    Arabic Breakfast
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    <Suspense fallback={
                      <div className="col-span-full flex justify-center py-8">
                        <div className="w-8 h-8 border-4 border-[#c9a962] border-t-transparent rounded-full animate-spin" />
                      </div>
                    }>
                      {breakfastItems
                        .filter(item => item.category === 'Breakfast')
                        .slice(12, 13)
                        .map((item) => {
                          const currentNumber = globalCardNumber++;
                          return (
                            <MenuCard
                              key={item.id}
                              item={item}
                              cardNumber={currentNumber}
                              onEdit={() => handleEdit(item)}
                              onDelete={() => handleDelete(item)}
                            />
                          );
                        })}
                    </Suspense>
                  </div>
                </div>

                {/* Sweet (Pancakes & French Toast) */}
                <div className="mb-12">
                  <h3 className="text-xl md:text-2xl font-semibold text-[#c9a962] mb-6">
                    Sweet
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    <Suspense fallback={
                      <div className="col-span-full flex justify-center py-8">
                        <div className="w-8 h-8 border-4 border-[#c9a962] border-t-transparent rounded-full animate-spin" />
                      </div>
                    }>
                      {breakfastItems
                        .filter(item => item.category === 'Pancakes' || item.category === 'French Toast')
                        .map((item) => {
                          const currentNumber = globalCardNumber++;
                          return (
                            <MenuCard
                              key={item.id}
                              item={item}
                              cardNumber={currentNumber}
                              onEdit={() => handleEdit(item)}
                              onDelete={() => handleDelete(item)}
                            />
                          );
                        })}
                    </Suspense>
                  </div>
                </div>

                {/* Croissants */}
                <div className="mb-12">
                  <h3 className="text-xl md:text-2xl font-semibold text-[#c9a962] mb-6">
                    Croissant
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    <Suspense fallback={
                      <div className="col-span-full flex justify-center py-8">
                        <div className="w-8 h-8 border-4 border-[#c9a962] border-t-transparent rounded-full animate-spin" />
                      </div>
                    }>
                      {breakfastItems
                        .filter(item => item.category === 'Croissants')
                        .map((item) => {
                          const currentNumber = globalCardNumber++;
                          return (
                            <MenuCard
                              key={item.id}
                              item={item}
                              cardNumber={currentNumber}
                              onEdit={() => handleEdit(item)}
                              onDelete={() => handleDelete(item)}
                            />
                          );
                        })}
                    </Suspense>
                  </div>
                </div>
              </div>
            );
          })()
        )}
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

      <AdminCardModal
        open={showCardModal}
        onOpenChange={setShowCardModal}
        onSave={handleSaveCard}
        initialData={editingCard}
        title={editingCard ? 'Edit Card' : 'Add New Card'}
        page="menu"
        categories={menuCategories}
      />

      <AdminSectionModal
        open={showSectionModal}
        onOpenChange={setShowSectionModal}
        onSave={handleSaveSection}
        existingCategories={categories.map(c => ({ id: c.id, name: c.name }))}
      />

      <AdminDeleteConfirm
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={confirmDelete}
        itemName={deletingCard?.name || ''}
      />
    </section>
  );
};

export default Menu;
