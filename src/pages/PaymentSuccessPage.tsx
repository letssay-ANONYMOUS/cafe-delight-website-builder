import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verifying, setVerifying] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Simulate payment verification
    // In production, you would verify the payment status with Ziina API
    const timer = setTimeout(() => {
      setVerifying(false);
      toast({
        title: "Payment Confirmed!",
        description: "Thank you for your order. We'll start preparing it right away!",
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [toast]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-coffee-600 mx-auto mb-4" />
          <p className="text-lg text-coffee-700">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="py-20 bg-cream-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-12 text-center">
                <div className="mb-6">
                  <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto" />
                </div>
                
                <h1 className="font-playfair text-4xl font-bold text-coffee-800 mb-4">
                  Payment Successful!
                </h1>
                
                <p className="text-lg text-coffee-600 mb-2">
                  Thank you for your order!
                </p>
                
                <p className="text-coffee-500 mb-8">
                  Your payment has been processed successfully. We'll start preparing your order right away.
                </p>

                {sessionId && (
                  <p className="text-sm text-coffee-400 mb-8">
                    Payment Reference: {sessionId}
                  </p>
                )}

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/')}
                    className="bg-coffee-600 hover:bg-coffee-700"
                  >
                    Back to Home
                  </Button>
                  <Button
                    onClick={() => navigate('/menu')}
                    variant="outline"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;
