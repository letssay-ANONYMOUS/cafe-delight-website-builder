
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, Phone } from 'lucide-react';

const LocationsPage = () => {
  const locations = [
    {
      name: "Downtown Manhattan",
      address: "123 Coffee Street, New York, NY 10001",
      phone: "(555) 123-BREW",
      hours: "Mon-Fri: 6AM-10PM, Sat-Sun: 7AM-11PM",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Brooklyn Heights",
      address: "456 Artisan Ave, Brooklyn, NY 11201",
      phone: "(555) 456-BREW",
      hours: "Mon-Fri: 6:30AM-9PM, Sat-Sun: 7AM-10PM",
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "SoHo Square",
      address: "789 Bean Boulevard, New York, NY 10012",
      phone: "(555) 789-BREW",
      hours: "Daily: 6AM-11PM",
      image: "https://images.unsplash.com/photo-1545669323-72bbf0ad8b70?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 bg-gradient-to-br from-coffee-800 to-coffee-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white mb-6">
            Our Locations
          </h1>
          <p className="text-xl text-cream-100 max-w-2xl mx-auto">
            Find your perfect coffee spot. We're proud to serve exceptional coffee 
            across multiple locations in New York City.
          </p>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-20 bg-cream-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {locations.map((location, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-64">
                  <img
                    src={location.image}
                    alt={location.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-4 font-playfair text-2xl font-bold text-white">
                    {location.name}
                  </h3>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-coffee-600 mt-1 flex-shrink-0" />
                      <p className="text-coffee-700">{location.address}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-coffee-600" />
                      <p className="text-coffee-700">{location.phone}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-coffee-600 mt-1" />
                      <p className="text-coffee-700">{location.hours}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LocationsPage;
