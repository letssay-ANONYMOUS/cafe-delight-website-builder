import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Import all menu items (same structure as Menu.tsx)
const menuItems = {
  'hot-coffee': [
    { id: 1, name: 'Hot Coffee 1', description: 'Traditional hot coffee', price: 15, image: '/menu-images/coffee-1.jpg' },
    { id: 2, name: 'Hot Coffee 2', description: 'Traditional hot coffee', price: 15, image: '/menu-images/coffee-2.jpg' },
    { id: 3, name: 'Hot Coffee 3', description: 'Traditional hot coffee', price: 15, image: '/menu-images/coffee-3.jpg' },
    { id: 4, name: 'Hot Coffee 4', description: 'Traditional hot coffee', price: 15, image: '/menu-images/coffee-4.jpg' },
    { id: 5, name: 'Hot Coffee 5', description: 'Traditional hot coffee', price: 15, image: '/menu-images/coffee-5.jpg' },
    { id: 6, name: 'Hot Coffee 6', description: 'Traditional hot coffee', price: 15, image: '/menu-images/coffee-6.jpg' },
    { id: 7, name: 'Hot Coffee 7', description: 'Traditional hot coffee', price: 15, image: '/menu-images/coffee-7.jpg' },
    { id: 8, name: 'Hot Coffee 8', description: 'Traditional hot coffee', price: 15, image: '/menu-images/coffee-8.jpg' },
    { id: 9, name: 'Hot Coffee 9', description: 'Traditional hot coffee', price: 15, image: '/menu-images/coffee-9.jpg' },
    { id: 10, name: 'Hot Coffee 10', description: 'Traditional hot coffee', price: 15, image: '/menu-images/coffee-10.jpg' },
    { id: 11, name: 'Hot Coffee 11', description: 'Traditional hot coffee', price: 15, image: '/menu-images/coffee-11.jpg' },
    { id: 12, name: 'Hot Coffee 12', description: 'Traditional hot coffee', price: 15, image: '/menu-images/coffee-12.jpg' },
    { id: 13, name: 'Hot Coffee 13', description: 'Traditional hot coffee', price: 15, image: '/menu-images/coffee-13.jpg' },
    { id: 14, name: 'Hot Coffee 14', description: 'Traditional hot coffee', price: 15, image: '/menu-images/coffee-14.jpg' },
    { id: 15, name: 'Hot Coffee 15', description: 'Traditional hot coffee', price: 15, image: '/menu-images/coffee-15.jpg' },
    { id: 16, name: 'Hot Coffee 16', description: 'Traditional hot coffee', price: 15, image: '/menu-images/coffee-16.jpg' },
    { id: 17, name: 'Hot Coffee 17', description: 'Traditional hot coffee', price: 15, image: '/menu-images/coffee-17.jpg' },
    { id: 18, name: 'Hot Coffee 18', description: 'Traditional hot coffee', price: 15, image: '/menu-images/coffee-18.jpg' },
  ],
  'cold-beverages': [
    { id: 101, name: 'Cold Beverage 1', description: 'Refreshing cold drink', price: 18, image: '/menu-images/cold-coffee-1.jpg' },
    { id: 102, name: 'Cold Beverage 2', description: 'Refreshing cold drink', price: 18, image: '/menu-images/cold-coffee-2.jpg' },
    { id: 103, name: 'Cold Beverage 3', description: 'Refreshing cold drink', price: 18, image: '/menu-images/cold-coffee-3.jpg' },
    { id: 104, name: 'Cold Beverage 4', description: 'Refreshing cold drink', price: 18, image: '/menu-images/cold-coffee-4.jpg' },
    { id: 105, name: 'Cold Beverage 5', description: 'Refreshing cold drink', price: 18, image: '/menu-images/cold-coffee-5.jpg' },
    { id: 106, name: 'Cold Beverage 6', description: 'Refreshing cold drink', price: 18, image: '/menu-images/cold-coffee-6.jpg' },
    { id: 107, name: 'Cold Beverage 7', description: 'Refreshing cold drink', price: 18, image: '/menu-images/cold-coffee-7.jpg' },
  ],
  'mojito': [
    { id: 201, name: 'Mojito 1', description: 'Fresh mojito', price: 20, image: '/menu-images/mojito-1.jpg' },
    { id: 202, name: 'Mojito 2', description: 'Fresh mojito', price: 20, image: '/menu-images/mojito-2.jpg' },
    { id: 203, name: 'Mojito 3', description: 'Fresh mojito', price: 20, image: '/menu-images/mojito-3.jpg' },
    { id: 204, name: 'Mojito 4', description: 'Fresh mojito', price: 20, image: '/menu-images/mojito-4.jpg' },
    { id: 205, name: 'Mojito 5', description: 'Fresh mojito', price: 20, image: '/menu-images/mojito-5.jpg' },
  ],
  'water': [
    { id: 251, name: 'Water 1', description: 'Premium water', price: 5, image: '/menu-images/water-1.jpg' },
    { id: 252, name: 'Water 2', description: 'Premium water', price: 5, image: '/menu-images/water-2.jpg' },
    { id: 253, name: 'Water 3', description: 'Premium water', price: 5, image: '/menu-images/water-3.jpg' },
  ],
  'infusion': [
    { id: 261, name: 'Infusion 1', description: 'Herbal infusion', price: 12, image: '/menu-images/infusion-1.jpg' },
    { id: 262, name: 'Infusion 2', description: 'Herbal infusion', price: 12, image: '/menu-images/infusion-2.jpg' },
  ],
  'fresh-juice': [
    { id: 271, name: 'Fresh Juice 1', description: 'Freshly squeezed juice', price: 15, image: '/menu-images/fresh-juice-1.jpg' },
    { id: 272, name: 'Fresh Juice 2', description: 'Freshly squeezed juice', price: 15, image: '/menu-images/fresh-juice-2.jpg' },
    { id: 273, name: 'Fresh Juice 3', description: 'Freshly squeezed juice', price: 15, image: '/menu-images/fresh-juice-3.jpg' },
    { id: 274, name: 'Fresh Juice 4', description: 'Freshly squeezed juice', price: 15, image: '/menu-images/fresh-juice-4.jpg' },
  ],
  'arabic-coffee': [
    { id: 301, name: 'Arabic Coffee', description: 'Traditional Arabic coffee', price: 15, image: '/menu-images/arabic-coffee-1.jpg' },
  ],
  'matcha': [
    { id: 401, name: 'Matcha Offer 1', description: 'Special matcha blend', price: 22, image: '/menu-images/offer-3.jpg' },
    { id: 402, name: 'Matcha Offer 2', description: 'Special matcha blend', price: 22, image: '/menu-images/offer-4.jpg' },
    { id: 403, name: 'Matcha Offer 3', description: 'Special matcha blend', price: 22, image: '/menu-images/offer-7.jpg' },
    { id: 404, name: 'Matcha Offer 4', description: 'Special matcha blend', price: 22, image: '/menu-images/offer-8.jpg' },
    { id: 405, name: 'Matcha Offer 5', description: 'Special matcha blend', price: 22, image: '/menu-images/offer-9.jpg' },
    { id: 406, name: 'Matcha Offer 6', description: 'Special matcha blend', price: 22, image: '/menu-images/offer-10.jpg' },
    { id: 407, name: 'Matcha Offer 7', description: 'Special matcha blend', price: 22, image: '/menu-images/offer-11.jpg' },
  ],
  'special-tea': [
    { id: 501, name: 'Special Tea 1', description: 'Premium tea selection', price: 18, image: '/menu-images/special-tea-1.jpg' },
    { id: 502, name: 'Special Tea 2', description: 'Premium tea selection', price: 18, image: '/menu-images/special-tea-2.jpg' },
    { id: 503, name: 'Special Tea 3', description: 'Premium tea selection', price: 18, image: '/menu-images/special-tea-3.jpg' },
    { id: 504, name: 'Special Tea 4', description: 'Premium tea selection', price: 18, image: '/menu-images/special-tea-4.jpg' },
  ],
  'nawa-summer': [
    { id: 601, name: 'Nawa Summer 1', description: 'Summer special drink', price: 20, image: '/menu-images/nawa-summer-1.jpg' },
    { id: 602, name: 'Nawa Summer 2', description: 'Summer special drink', price: 20, image: '/menu-images/nawa-summer-2.jpg' },
    { id: 603, name: 'Nawa Summer 3', description: 'Summer special drink', price: 20, image: '/menu-images/nawa-summer-3.jpg' },
  ],
};

const MenuItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the item across all categories
  const allItems = Object.values(menuItems).flat();
  const item = allItems.find(item => item.id === Number(id));

  if (!item) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Item not found</h1>
            <Button onClick={() => navigate('/menu')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Menu
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/menu')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Button>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="relative overflow-hidden rounded-lg aspect-square">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-4">{item.name}</h1>
                <p className="text-lg text-muted-foreground mb-6">
                  {item.description}
                </p>
                <div className="text-3xl font-bold text-[#c9a962]">
                  {item.price} SAR
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={() => {
                    // Add to cart functionality can be added here
                    console.log('Add to cart:', item);
                  }}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MenuItemDetail;
