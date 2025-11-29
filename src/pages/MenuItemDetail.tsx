import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getAllMenuItems } from '@/data/menuData';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

const MenuItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleBack = useCallback(() => {
    navigate('/menu');
  }, [navigate]);

  useEffect(() => {
    // Always scroll to top when entering the detail page
    window.scrollTo(0, 0);
  }, []);

  // Handle ESC key to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBack]);

  // Find the item across all categories
  const allItems = getAllMenuItems();
  const item = allItems.find(item => item.id === Number(id));


  const handleAddToCart = () => {
    if (!item) return;
    addToCart({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: 'menu'
    });
    toast({
      title: 'Added to cart',
      description: `${item.name} has been added to your cart.`,
    });
  };

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
            onClick={handleBack}
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
                  AED {item.price.toFixed(2)}
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={handleAddToCart}
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
