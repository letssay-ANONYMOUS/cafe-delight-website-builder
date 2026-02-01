// Kitchen Dashboard v3 - Sidebar navigation with Paid/Pending views
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  LogOut, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Package,
  ExternalLink
} from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useKitchenAlert } from "@/hooks/useKitchenAlert";
import { OrderTable } from "@/components/kitchen/OrderTable";
import { KitchenSidebar, type KitchenView } from "@/components/kitchen/KitchenSidebar";
import type { Tables } from '@/integrations/supabase/types';

type Order = Tables<'orders'>;
type OrderItem = Tables<'order_items'>;

interface OrderWithItems extends Order {
  items: OrderItem[];
}

const KitchenDashboard = () => {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [unacknowledgedOrders, setUnacknowledgedOrders] = useState<Set<string>>(new Set());
  const [activeView, setActiveView] = useState<KitchenView>("paid");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isPlaying, startAlert, stopAlert, initAudioContext } = useKitchenAlert();

  // Initialize audio on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      initAudioContext();
      window.removeEventListener('click', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);
    return () => window.removeEventListener('click', handleFirstInteraction);
  }, [initAudioContext]);

  useEffect(() => {
    checkAuth();
    loadOrders();
    const channel = setupRealtimeSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      stopAlert();
    };
  }, []);

  // Manage alert sound based on unacknowledged orders
  useEffect(() => {
    if (soundEnabled && unacknowledgedOrders.size > 0) {
      startAlert();
    } else {
      stopAlert();
    }
  }, [unacknowledgedOrders.size, soundEnabled, startAlert, stopAlert]);

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_session');
    if (!token) {
      navigate('/staff/login');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('admin-session', {
        headers: { 'x-admin-token': token }
      });

      if (error || (!data?.valid && !data?.authenticated)) {
        localStorage.removeItem('admin_session');
        navigate('/staff/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      navigate('/staff/login');
    }
  };

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      if (ordersData && ordersData.length > 0) {
        const orderIds = ordersData.map(o => o.id);
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .in('order_id', orderIds);

        if (itemsError) throw itemsError;

        const ordersWithItems: OrderWithItems[] = ordersData.map(order => ({
          ...order,
          items: (itemsData || []).filter(item => item.order_id === order.id)
        }));

        setOrders(ordersWithItems);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load orders"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('kitchen-orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        async (payload) => {
          console.log('New order received:', payload);
          
          const { data: itemsData } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', payload.new.id);

          const newOrder: OrderWithItems = {
            ...payload.new as Order,
            items: itemsData || []
          };

          setOrders(prev => [newOrder, ...prev]);
          
          // Only show toast for new pending orders (no sound)
          if (newOrder.payment_status === 'pending') {
            toast({
              title: "📋 New Pending Order",
              description: `Order ${newOrder.order_number} from ${newOrder.customer_name}`,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders'
        },
        async (payload) => {
          console.log('Order updated:', payload);
          const updatedOrder = payload.new as Order;
          const oldOrder = payload.old as Partial<Order>;
          
          // Check if order just changed to 'paid'
          if (updatedOrder.payment_status === 'paid' && oldOrder.payment_status !== 'paid') {
            // Add to unacknowledged set to trigger alert
            setUnacknowledgedOrders(prev => new Set([...prev, updatedOrder.id]));
            
            // Auto-switch to paid view when new paid order comes in
            setActiveView("paid");
            
            toast({
              title: "💰 Order Paid!",
              description: `Order ${updatedOrder.order_number} from ${updatedOrder.customer_name} is ready!`,
              className: "bg-green-50 border-green-300"
            });
          }
          
          // Update order in state
          setOrders(prev => prev.map(order => 
            order.id === updatedOrder.id 
              ? { ...order, ...updatedOrder }
              : order
          ));
        }
      )
      .subscribe();

    return channel;
  };

  const handleAcknowledge = useCallback((orderId: string) => {
    setUnacknowledgedOrders(prev => {
      const newSet = new Set(prev);
      newSet.delete(orderId);
      return newSet;
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    navigate('/staff/login');
  };

  const paidOrders = orders.filter(o => o.payment_status === 'paid');
  const pendingOrders = orders.filter(o => o.payment_status === 'pending');
  const currentOrders = activeView === 'paid' ? paidOrders : pendingOrders;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <KitchenSidebar
          activeView={activeView}
          onViewChange={setActiveView}
          paidCount={paidOrders.length}
          pendingCount={pendingOrders.length}
          unacknowledgedCount={unacknowledgedOrders.size}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-card shadow-sm border-b sticky top-0 z-50">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SidebarTrigger />
                  <div>
                    <h1 className="text-lg font-bold text-foreground">
                      {activeView === 'paid' ? '✅ Paid Orders' : '⏳ Pending Orders'}
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Stats Badge */}
                  {unacknowledgedOrders.size > 0 && (
                    <div className="px-3 py-1.5 bg-destructive/10 rounded-full animate-pulse">
                      <span className="text-sm font-bold text-destructive">{unacknowledgedOrders.size} New!</span>
                    </div>
                  )}

                  {/* Sound Toggle */}
                  <div className="flex items-center gap-2">
                    <Label htmlFor="sound" className="sr-only">Sound</Label>
                    {soundEnabled ? (
                      <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-destructive animate-pulse' : 'text-foreground'}`} />
                    ) : (
                      <VolumeX className="w-4 h-4 text-muted-foreground" />
                    )}
                    <Switch
                      id="sound"
                      checked={soundEnabled}
                      onCheckedChange={setSoundEnabled}
                    />
                  </div>

                  {/* Refresh */}
                  <Button variant="outline" size="icon" onClick={loadOrders} disabled={isLoading}>
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>

                  {/* Fullscreen */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (document.fullscreenElement) {
                        document.exitFullscreen();
                      } else {
                        document.documentElement.requestFullscreen();
                      }
                    }}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>

                  {/* Logout */}
                  <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : currentOrders.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h2 className="text-xl font-semibold text-muted-foreground mb-2">
                    No {activeView === 'paid' ? 'Paid' : 'Pending'} Orders
                  </h2>
                  <p className="text-muted-foreground/70">Orders will appear here in real-time</p>
                </CardContent>
              </Card>
            ) : (
              <OrderTable
                orders={currentOrders}
                type={activeView}
                unacknowledged={unacknowledgedOrders}
                onAcknowledge={handleAcknowledge}
              />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default KitchenDashboard;
