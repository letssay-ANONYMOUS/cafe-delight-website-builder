import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, Phone } from 'lucide-react';

const LocationsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 bg-gradient-to-br from-coffee-800 to-coffee-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair text-4xl md:text-6xl font-bold text-white mb-4">
            Our Location
          </h1>
          <p className="text-lg md:text-xl text-cream-100 max-w-2xl mx-auto">
            Visit us at NAWA Cafe in Al Ain, United Arab Emirates
          </p>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="py-12 md:py-20 bg-cream-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Card className="overflow-hidden shadow-2xl">
              <CardContent className="p-0">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3637.895399120355!2d55.71146833923969!3d24.24543696968284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e8ab391028950b1%3A0xe99373a583558a82!2sNAWA%20Cafe!5e0!3m2!1sen!2suk!4v1759400527438!5m2!1sen!2suk"
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="NAWA Cafe Location"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Location Details */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <MapPin className="w-8 h-8 text-coffee-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-coffee-800 mb-2">Address</h3>
                  <p className="text-sm text-coffee-700">Al Banafsaj St. Hazza Bin Zayed Stadium</p>
                  <p className="text-sm text-coffee-700">Bldg. 15 - Al Tiwayya</p>
                  <p className="text-sm text-coffee-700">Abu Dhabi, UAE</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Phone className="w-8 h-8 text-coffee-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-coffee-800 mb-2">Phone</h3>
                  <p className="text-sm text-coffee-700">037800030</p>
                  <p className="text-sm text-coffee-700">0506584176</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="w-8 h-8 text-coffee-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-coffee-800 mb-2">Hours</h3>
                  <p className="text-sm text-coffee-700">Mon-Fri: 6AM-9PM</p>
                  <p className="text-sm text-coffee-700">Sat-Sun: 7AM-10PM</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LocationsPage;
