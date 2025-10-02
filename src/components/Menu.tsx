import { Star, Coffee, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Menu = () => {
  const { toast } = useToast();

  const menuItems = [
    {
      id: 1,
      name: "Signature Espresso Blend",
      description: "Our house blend with rich chocolate notes and a velvety finish. Made from premium Arabica beans.",
      price: "$4.50",
      image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80",
      rating: 5,
      category: "Hot Coffee"
    },
    {
      id: 2,
      name: "Caramel Macchiato",
      description: "Vanilla-flavored syrup, steamed milk, and espresso, topped with caramel drizzle and foam art.",
      price: "$5.25",
      image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80",
      rating: 5,
      category: "Specialty Drinks"
    },
    {
      id: 3,
      name: "Cappuccino Classic",
      description: "Traditional Italian cappuccino with perfectly steamed milk foam and rich espresso base.",
      price: "$4.75",
      image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80",
      rating: 4,
      category: "Hot Coffee"
    },
    {
      id: 4,
      name: "Cold Brew Paradise",
      description: "Smooth, refreshing cold brew coffee with hints of vanilla and a touch of cream.",
      price: "$4.95",
      image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
      rating: 5,
      category: "Cold Coffee"
    },
    {
      id: 5,
      name: "Iced Americano",
      description: "Bold espresso shots over ice with cold water, perfect for a refreshing caffeine kick.",
      price: "$3.95",
      image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=600&q=80",
      rating: 4,
      category: "Cold Coffee"
    },
    {
      id: 6,
      name: "Mocha Delight",
      description: "Rich chocolate and premium espresso blend topped with whipped cream and cocoa powder.",
      price: "$5.75",
      image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=600&q=80",
      rating: 5,
      category: "Specialty Drinks"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const handleAddToCart = (itemName: string) => {
    toast({
      title: "Added to Cart",
      description: `${itemName} has been added to your cart.`,
    });
  };

  return (
    <section id="menu" className="py-20 bg-gradient-to-b from-cream-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-coffee-800 mb-4">
            Our Delicious Menu
          </h2>
          <p className="text-xl text-coffee-600 max-w-2xl mx-auto">
            Carefully crafted beverages and artisan treats made with the finest ingredients
          </p>
          <div className="w-24 h-1 bg-coffee-400 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <Card
              key={item.id}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-coffee-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
                  {item.category}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-playfair text-xl font-semibold text-coffee-800 group-hover:text-coffee-600 transition-colors duration-200">
                    {item.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    {renderStars(item.rating)}
                  </div>
                </div>

                <p className="text-coffee-600 mb-4 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-coffee-700">
                    {item.price}
                  </span>
                  <Button 
                    className="bg-coffee-600 hover:bg-coffee-700 text-white px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                    onClick={() => handleAddToCart(item.name)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-coffee-600 hover:bg-coffee-700 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <Coffee className="w-5 h-5 mr-2" />
            View Full Menu
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Menu;
