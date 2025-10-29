import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Coffee, Utensils, Clock, MapPin, Plus, Edit, X } from 'lucide-react';
import cateringHeroImage from '@/assets/catering-hero.png';
import { useAdmin } from '@/contexts/AdminContext';
import { AdminCardModal } from '@/components/AdminCardModal';
import { AdminDeleteConfirm } from '@/components/AdminDeleteConfirm';
import { useToast } from '@/hooks/use-toast';

const CateringPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { isAdmin, addPendingChange } = useAdmin();
  const { toast } = useToast();
  const [showCardModal, setShowCardModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);
  const [deletingCard, setDeletingCard] = useState<any>(null);

  const initialServices = [
    {
      icon: Coffee,
      title: "Coffee Bar Service",
      description: "Professional baristas serving premium espresso drinks, pour-overs, and specialty beverages at your event.",
      features: ["Premium arabica beans", "Latte art", "Multiple brewing methods"]
    },
    {
      icon: Utensils,
      title: "Full Meal Catering",
      description: "Complete meal service featuring fresh, locally-sourced ingredients and customizable menu options.",
      features: ["Breakfast & brunch", "Lunch spreads", "Dinner packages"]
    },
    {
      icon: Users,
      title: "Corporate Events",
      description: "Perfect for business meetings, conferences, and corporate gatherings of all sizes.",
      features: ["Meeting refreshments", "Conference catering", "Team building events"]
    }
  ];

  const [services, setServices] = useState(initialServices);

  const handleAddNew = () => {
    setEditingCard(null);
    setShowCardModal(true);
  };

  const handleEdit = (service: any) => {
    setEditingCard(service);
    setShowCardModal(true);
  };

  const handleDelete = (service: any) => {
    setDeletingCard(service);
    setShowDeleteConfirm(true);
  };

  const handleSave = (data: any) => {
    addPendingChange({
      type: editingCard ? 'edit' : 'add',
      page: 'catering',
      data,
      id: editingCard?.title
    });
    
    if (editingCard) {
      setServices(services.map(s => s.title === editingCard.title ? { ...s, title: data.name, description: data.description } : s));
    } else {
      setServices([...services, {
        icon: Coffee,
        title: data.name,
        description: data.description,
        features: ["Premium service", "Professional staff", "Custom options"]
      }]);
    }
  };

  const confirmDelete = () => {
    addPendingChange({
      type: 'delete',
      page: 'catering',
      id: deletingCard.title
    });
    
    setServices(services.filter(s => s.title !== deletingCard.title));
    setShowDeleteConfirm(false);
    toast({
      title: 'Changes staged',
      description: 'Card deletion staged. Click Save in footer to apply.',
    });
  };

  const packages = [
    {
      name: "Essentials",
      price: "Starting at AED 55/person",
      description: "Perfect for small gatherings and meetings",
      includes: ["Coffee & tea station", "Pastries & light snacks", "Setup & cleanup", "2-hour service"]
    },
    {
      name: "Premium",
      price: "Starting at AED 130/person",
      description: "Ideal for special occasions",
      includes: ["Full coffee bar", "Gourmet sandwiches & salads", "Dessert selection", "4-hour service", "Professional staff"]
    },
    {
      name: "Deluxe",
      price: "Starting at AED 240/person",
      description: "Complete luxury catering experience",
      includes: ["Signature coffee drinks", "Multi-course meal service", "Premium desserts", "Full-day service", "Dedicated event coordinator"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-0 overflow-hidden">
        <div className="relative h-[500px] md:h-[600px]">
          <img 
            src={cateringHeroImage} 
            alt="NAWA Café Catering Services" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
              <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 animate-fade-in drop-shadow-lg">
                Catering Services
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 animate-fade-in drop-shadow-md">
                Elevate your events with our premium catering services. From intimate gatherings to large corporate events, 
                we bring the café experience to you.
              </p>
              <div className="flex flex-wrap justify-center gap-4 animate-scale-in">
                <Button size="lg" className="bg-[#c9a962] hover:bg-[#b89952] text-white rounded-full px-8 shadow-lg">
                  Get a Quote
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 border-white text-white hover:bg-white/20 backdrop-blur-sm shadow-lg">
                  View Sample Menu
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-playfair text-4xl font-bold text-coffee-900">
              Our Catering Services
            </h2>
            {isAdmin && (
              <Button
                onClick={handleAddNew}
                className="bg-coffee-600 hover:bg-coffee-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Card
              </Button>
            )}
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-coffee-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative">
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/90 hover:bg-white"
                      onClick={() => handleEdit(service)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={() => handleDelete(service)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <CardHeader>
                  <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mb-4">
                    <service.icon className="w-8 h-8 text-coffee-600" />
                  </div>
                  <CardTitle className="text-2xl text-coffee-900">{service.title}</CardTitle>
                  <CardDescription className="text-coffee-600">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-coffee-700">
                        <span className="w-2 h-2 bg-coffee-500 rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cream-50 to-coffee-50">
        <div className="container mx-auto">
          <h2 className="font-playfair text-4xl font-bold text-coffee-900 text-center mb-12">
            Catering Packages
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card key={index} className="border-coffee-200 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-3xl font-playfair text-coffee-900 mb-2">{pkg.name}</CardTitle>
                  <div className="text-4xl font-bold text-coffee-600 mb-2">{pkg.price}</div>
                  <CardDescription className="text-coffee-700">{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {pkg.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start text-coffee-700">
                        <Coffee className="w-5 h-5 text-coffee-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6 bg-coffee-600 hover:bg-coffee-700 text-white rounded-full">
                    Select Package
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Event Types Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="font-playfair text-4xl font-bold text-coffee-900 text-center mb-12">
            Perfect For Every Occasion
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "Corporate Events", desc: "Meetings & conferences" },
              { icon: Calendar, title: "Special Occasions", desc: "Weddings & celebrations" },
              { icon: Clock, title: "Morning Events", desc: "Breakfast & brunches" },
              { icon: MapPin, title: "On-Site Service", desc: "Any location" }
            ].map((event, index) => (
              <Card key={index} className="text-center border-coffee-200 hover:border-coffee-400 transition-all duration-300">
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-to-br from-coffee-100 to-cream-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <event.icon className="w-10 h-10 text-coffee-600" />
                  </div>
                  <CardTitle className="text-xl text-coffee-900">{event.title}</CardTitle>
                  <CardDescription className="text-coffee-600">{event.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-coffee-700 via-coffee-600 to-coffee-700 text-white">
        <div className="container mx-auto text-center">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
            Ready to Plan Your Event?
          </h2>
          <p className="text-xl text-cream-100 mb-8 max-w-2xl mx-auto">
            Contact us today for a personalized quote and let us make your event unforgettable.
          </p>
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="bg-white text-coffee-600 hover:bg-cream-50 rounded-full px-8"
              onClick={() => window.location.href = 'mailto:nawacafe22@gmail.com?subject=Catering Inquiry&body=Hello NAWA Café Team, I would like to inquire about your catering services. Please contact me at: 037800030 or 0506584176'}
            >
              Connect With Us
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      <AdminCardModal
        open={showCardModal}
        onOpenChange={setShowCardModal}
        onSave={handleSave}
        initialData={editingCard ? { name: editingCard.title, description: editingCard.description, price: 0, image: '' } : undefined}
        title={editingCard ? 'Edit Card' : 'Add New Card'}
        page="catering"
      />

      <AdminDeleteConfirm
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={confirmDelete}
        itemName={deletingCard?.title || ''}
      />
    </div>
  );
};

export default CateringPage;