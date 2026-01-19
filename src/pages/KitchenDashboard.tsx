import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, RefreshCw, Clock, User, Phone, FileText, Volume2, VolumeX } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Order = Tables<'orders'>;
type OrderItem = Tables<'order_items'>;

interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

const KitchenDashboard = () => {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Check admin auth
    checkAuth();
    // Load initial orders
    loadOrders();
    // Set up realtime subscription
    const channel = setupRealtimeSubscription();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkAuth = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-session');
      if (error || !data?.authenticated) {
        navigate('/admin/login');
      }
    } catch (error) {
      navigate('/admin/login');
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      
      // Get today's start timestamp
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      // Fetch orders with their items
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', todayStart.toISOString())
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch all order items for these orders
      if (ordersData && ordersData.length > 0) {
        const orderIds = ordersData.map(o => o.id);
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .in('order_id', orderIds);

        if (itemsError) throw itemsError;

        // Combine orders with their items
        const ordersWithItems: OrderWithItems[] = ordersData.map(order => ({
          ...order,
          order_items: itemsData?.filter(item => item.order_id === order.id) || [],
        }));

        setOrders(ordersWithItems);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('kitchen-orders')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        async (payload) => {
          console.log('New order received:', payload);
          
          // Play notification sound
          if (soundEnabled) {
            playNotificationSound();
          }

          // Fetch the order items for this new order
          const { data: itemsData } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', payload.new.id);

          const newOrder: OrderWithItems = {
            ...payload.new as Order,
            order_items: itemsData || [],
          };

          setOrders(prev => [newOrder, ...prev]);
          
          toast({
            title: '🔔 New Order!',
            description: `Order ${payload.new.order_number} from ${payload.new.customer_name}`,
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Order updated:', payload);
          setOrders(prev => prev.map(order => 
            order.id === payload.new.id 
              ? { ...order, ...payload.new as Order }
              : order
          ));
        }
      )
      .subscribe();

    return channel;
  };

  const playNotificationSound = () => {
    try {
      // Create a simple beep using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      
      // Play two beeps
      setTimeout(() => {
        oscillator.frequency.value = 1000;
      }, 150);
      
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 300);
    } catch (e) {
      console.warn('Could not play notification sound:', e);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-AE', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Dubai'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      case 'cancelled':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">Kitchen Orders</h1>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {orders.length} orders today
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute notifications' : 'Enable notifications'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
            <Button variant="outline" onClick={loadOrders} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      {/* Orders Grid */}
      <main className="max-w-7xl mx-auto p-4">
        {loading && orders.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No orders today yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              New orders will appear here automatically
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <Card key={order.id} className="relative overflow-hidden">
                {/* Status indicator bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${getStatusColor(order.payment_status)}`} />
                
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-mono">
                        {order.order_number}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {formatTime(order.created_at)}
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.payment_status)}>
                      {order.payment_status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Customer Info */}
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{order.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{order.customer_phone}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-semibold mb-2">Items:</h4>
                    <ul className="space-y-1">
                      {order.order_items.map((item) => (
                        <li key={item.id} className="flex justify-between text-sm">
                          <span>
                            <span className="font-medium">{item.quantity}×</span> {item.item_name}
                          </span>
                          <span className="text-muted-foreground">
                            AED {item.total_price.toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Notes */}
                  {order.extra_notes && (
                    <div className="border-t pt-3">
                      <div className="flex items-start gap-2 text-sm">
                        <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <p className="text-muted-foreground">{order.extra_notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  <div className="border-t pt-3 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>AED {order.total_amount.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default KitchenDashboard;
