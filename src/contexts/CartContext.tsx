import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getVisitorId } from '@/hooks/useVisitorId';
import { supabase } from '@/integrations/supabase/client';
import { useCookieConsent } from '@/components/CookieConsent';
const CART_STORAGE_KEY = 'nawa_cart';

export interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, change: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  visitorId: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Load cart from localStorage
 */
const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
  }
  return [];
};

/**
 * Save cart to localStorage
 */
const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [visitorId, setVisitorId] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const consent = useCookieConsent();

  // Track cart event if analytics consent given
  const trackCartEvent = useCallback(async (
    eventName: string,
    item: { id: number; name: string; price?: number; category?: string }
  ) => {
    if (!consent?.analytics) return;
    
    try {
      await supabase.from('site_events').insert({
        visitor_id: getVisitorId(),
        event_type: 'cart',
        event_name: eventName,
        event_data: {
          item_id: item.id,
          item_name: item.name,
          price: item.price || null,
          category: item.category || null
        },
        page_path: window.location.pathname
      });
      
      // Also track in menu_item_views for item-specific analytics
      await supabase.from('menu_item_views').insert({
        visitor_id: getVisitorId(),
        item_name: item.name,
        category: item.category || null,
        action: eventName === 'add_to_cart' ? 'add_to_cart' : 'remove_from_cart'
      });
    } catch (err) {
      console.error('Failed to track cart event:', err);
    }
  }, [consent]);

  // Initialize cart from localStorage and get visitor ID
  useEffect(() => {
    const storedCart = loadCartFromStorage();
    setCartItems(storedCart);
    setVisitorId(getVisitorId());
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes (after initialization)
  useEffect(() => {
    if (isInitialized) {
      saveCartToStorage(cartItems);
    }
  }, [cartItems, isInitialized]);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setCartItems(currentItems => {
      const existingItem = currentItems.find(i => i.id === item.id);
      
      if (existingItem) {
        return currentItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      
      return [...currentItems, { ...item, quantity: 1 }];
    });
    
    // Track add to cart event
    trackCartEvent('add_to_cart', {
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category
    });
  }, [trackCartEvent]);

  const removeFromCart = useCallback((id: number) => {
    setCartItems(currentItems => {
      const item = currentItems.find(i => i.id === id);
      if (item) {
        trackCartEvent('remove_from_cart', { id: item.id, name: item.name });
      }
      return currentItems.filter(i => i.id !== id);
    });
  }, [trackCartEvent]);

  const updateQuantity = useCallback((id: number, change: number) => {
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((sum, item) => {
      const itemPrice = parseFloat(item.price.toString().replace('$', ''));
      return sum + itemPrice * item.quantity;
    }, 0);
  }, [cartItems]);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        visitorId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
