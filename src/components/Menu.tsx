import { ShoppingCart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const Menu = () => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'nawa-breakfast', name: 'NAWA Breakfast', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=300&q=80' },
    { id: 'coffee', name: 'COFFEE', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=300&q=80' },
    { id: 'lunch-dinner', name: 'Lunch & Dinner', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80' },
    { id: 'pastries', name: 'Pastries & Desserts', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80' },
    { id: 'cold-beverages', name: 'Cold Beverages', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=300&q=80' },
    { id: 'matcha', name: 'MATCHA LOVERS OFFERS', image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=300&q=80' },
    { id: 'arabic-coffee', name: 'ARABIC COFFEE', image: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?auto=format&fit=crop&w=300&q=80' },
  ];

  const menuSections = [
    {
      title: 'NAWA BREAKFAST',
      subtitle: 'A Selection of our freshest breakfast\nAvailable from 8am to 12pm',
      category: 'SAVOURY',
      items: [
        {
          id: 1,
          name: 'Truffle Omelette Toast',
          description: 'Sour dough toast topped with mixed cheese, omelette cooked with cheese and truffle mushroom. Garnished with...',
          price: 46.00,
          image: 'https://images.unsplash.com/photo-1612240498584-0c1b3b3f4d8e?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 2,
          name: 'GOURMET BREAKFAST SANDWICH',
          description: 'GOURMET SANDWICH WITH PANCAKE TACO PIE...',
          price: 42.00,
          image: 'https://images.unsplash.com/photo-1619876696906-f3f2f3d22f3d?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 3,
          name: 'NEW NAWA SHAKSHUKA',
          description: '',
          price: 48.00,
          image: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 4,
          name: 'Zattar Babka',
          description: 'Toast babka bread stuffed with labneh, zattar glazed on the side, labneh zattar kalamata olives, gherkin...',
          price: 40.00,
          image: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 5,
          name: 'Croque Madame',
          description: 'Sour dough toastwith turkey slice, beschamel sauce, mixed cheese, baked and then topped with a sunny side egg...',
          price: 45.00,
          image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 6,
          name: 'Halloumi Pesto Toast',
          description: 'Sour dough toast with sun dried tomato pesto, grilled halloumi and tomatoes on top. Garnished with parmesan...',
          price: 43.00,
          image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 7,
          name: 'NAWA EGG FLORENTINE',
          description: "ITS A ENGLISH MUFFIN BASED WITH LABNER AND TOP WIT...",
          price: 47.00,
          image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 8,
          name: 'Creamy Mushroom Toasty',
          description: '',
          price: 42.00,
          image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=600&q=80',
        },
      ]
    },
    {
      title: 'SWEET',
      subtitle: '',
      category: '',
      items: [
        {
          id: 21,
          name: 'NAWA Pancake',
          description: 'Fluffy pancake drizzled with sticky sauce with berries on the top.',
          price: 42.00,
          image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 22,
          name: 'NAWA Classic French Toast',
          description: 'Brioche toast with salted caramel sauce and whipped cream on the side, topped with caramelized pecan nuts.',
          price: 46.00,
          image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 23,
          name: 'NAWA Signature French Toast',
          description: 'Brioche toast filled with nutella fondue, topped with mixed berries, raspberry jelly, peanut butter andpeanuts.',
          price: 50.00,
          image: 'https://images.unsplash.com/photo-1605027990121-cbae9d3ce6bc?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 24,
          name: 'French Toast Bites',
          description: 'Our French Toast Bites are perfect for sharing or enjoying as a delicious morning treat. Made from thick slices of golden...',
          price: 35.00,
          image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80',
        },
      ]
    },
    {
      title: 'CROISSANT',
      subtitle: '',
      category: '',
      items: [
        {
          id: 31,
          name: 'Plain Croissant',
          description: 'Daily fresh oven-baked butter croissant.',
          price: 20.00,
          image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 32,
          name: 'Mix Cheese Croissant',
          description: 'Daily fresh oven-baked butter croissant filled with 4 variety of cheeses.',
          price: 25.00,
          image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 33,
          name: 'Feta Cheese Croissant',
          description: '',
          price: 25.00,
          image: 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 34,
          name: 'Egg Croissant',
          description: 'Our Egg Croissant features a fluffy croissant filled with...',
          price: 32.00,
          image: 'https://images.unsplash.com/photo-1590691774908-c3dea38c3b3f?auto=format&fit=crop&w=600&q=80',
        },
      ]
    },
    {
      title: 'HOT COFFEE',
      subtitle: '',
      category: '',
      items: [
        {
          id: 41,
          name: 'Espresso',
          description: '',
          price: 19.00,
          image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 42,
          name: 'Americano',
          description: 'Whole shot espresso with hot steamy water.',
          price: 21.00,
          image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 43,
          name: 'Macchiato',
          description: 'Whole shot espresso with micro foamed milk.',
          price: 21.00,
          image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 44,
          name: 'Piccolo',
          description: 'Restreto with textured creamy milk.',
          price: 21.00,
          image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 45,
          name: 'Cortado',
          description: 'Volume of double restreto with textured creamy milk.',
          price: 21.00,
          image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 46,
          name: 'Café Latte',
          description: 'Whole shot espresso with fresh hot milk.',
          price: 25.00,
          image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 47,
          name: 'Flat White',
          description: 'Whole shot espresso with fresh creamy milk.',
          price: 24.00,
          image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 48,
          name: 'Cappuccino',
          description: 'Whole shot espresso with perfectly foamed milk.',
          price: 25.00,
          image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80',
        },
      ]
    }
  ];

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: 'Menu Item',
    });
    
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
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
                className="pl-10 bg-[#c9a962] border-none text-coffee-900 placeholder:text-coffee-700 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="overflow-x-auto py-6 px-4 sm:px-6 lg:px-8 scrollbar-hide">
        <div className="container mx-auto">
          <div className="flex gap-4 min-w-max">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="flex-shrink-0 w-40 group"
              >
                <div className="relative overflow-hidden rounded-lg aspect-[4/3] mb-2">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <p className="text-[#c9a962] text-sm font-medium text-center uppercase">{category.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-16">
            {/* Section Header */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {section.title}
              </h2>
              {section.subtitle && (
                <p className="text-white/80 whitespace-pre-line text-sm">
                  {section.subtitle}
                </p>
              )}
              {section.category && (
                <h3 className="text-2xl font-semibold text-white mt-6 mb-4">
                  {section.category}
                </h3>
              )}
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {section.items.map((item) => (
                <Card
                  key={item.id}
                  className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-transparent"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Golden Footer */}
                  <div className="bg-[#c9a962]/90 backdrop-blur-sm p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-white text-base leading-tight flex-1">
                        {item.name}
                      </h3>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold text-lg">
                        ฿ {item.price.toFixed(2)}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(item)}
                        className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-md px-3 py-1"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>

                    {item.description && (
                      <p className="text-white/90 text-xs line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Menu;
