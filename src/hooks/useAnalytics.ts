import { useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getVisitorId } from '@/hooks/useVisitorId';
import { getSessionId } from '@/hooks/useSession';
import { useCookieConsent } from '@/components/CookieConsent';

interface MenuItemTrackingData {
  itemId?: string;
  itemName: string;
  category?: string;
}

type EventData = Record<string, string | number | boolean | null>;

/**
 * Hook for tracking anonymous user analytics
 * Only tracks if user has consented to analytics cookies
 */
export const useAnalytics = () => {
  const consent = useCookieConsent();
  const lastPageView = useRef<string>('');
  const pageViewTime = useRef<number>(Date.now());

  const canTrack = useCallback((): boolean => {
    return consent?.analytics === true;
  }, [consent]);

  /**
   * Track a page view
   */
  const trackPageView = useCallback(async (pagePath: string, pageTitle?: string) => {
    if (!canTrack()) return;
    
    // Avoid duplicate tracking for same page
    if (lastPageView.current === pagePath) return;
    
    const visitorId = getVisitorId();
    const sessionId = getSessionId();

    try {
      // Calculate time on previous page
      const timeOnPrevPage = lastPageView.current 
        ? Math.floor((Date.now() - pageViewTime.current) / 1000)
        : null;

      // Update previous page's time_on_page if we have it
      if (lastPageView.current && timeOnPrevPage) {
        await supabase
          .from('page_views')
          .update({ time_on_page: timeOnPrevPage })
          .eq('visitor_id', visitorId)
          .eq('page_path', lastPageView.current)
          .order('viewed_at', { ascending: false })
          .limit(1);
      }

      // Insert new page view
      await supabase
        .from('page_views')
        .insert({
          visitor_id: visitorId,
          session_id: sessionId,
          page_path: pagePath,
          page_title: pageTitle || document.title,
          referrer: document.referrer || null,
          scroll_depth: 0,
          engagement_time: 0
        });

      lastPageView.current = pagePath;
      pageViewTime.current = Date.now();
    } catch (err) {
      console.error('Failed to track page view:', err);
    }
  }, [canTrack]);

  /**
   * Track menu item interactions
   */
  const trackMenuItemView = useCallback(async (
    data: MenuItemTrackingData,
    action: 'view' | 'add_to_cart' | 'remove_from_cart'
  ) => {
    if (!canTrack()) return;

    const visitorId = getVisitorId();

    try {
      await supabase
        .from('menu_item_views')
        .insert({
          visitor_id: visitorId,
          menu_item_id: data.itemId || null,
          item_name: data.itemName,
          category: data.category || null,
          action: action
        });
    } catch (err) {
      console.error('Failed to track menu item view:', err);
    }
  }, [canTrack]);

  /**
   * Track custom events
   */
  const trackEvent = useCallback(async (
    eventType: string,
    eventName: string,
    eventData?: EventData
  ) => {
    if (!canTrack()) return;

    const visitorId = getVisitorId();

    try {
      await supabase
        .from('site_events')
        .insert({
          visitor_id: visitorId,
          event_type: eventType,
          event_name: eventName,
          event_data: eventData ? JSON.parse(JSON.stringify(eventData)) : null,
          page_path: window.location.pathname
        });
    } catch (err) {
      console.error('Failed to track event:', err);
    }
  }, [canTrack]);

  /**
   * Track add to cart
   */
  const trackAddToCart = useCallback(async (item: {
    id: number;
    name: string;
    price: number;
    category?: string;
  }) => {
    await trackMenuItemView(
      { itemId: String(item.id), itemName: item.name, category: item.category },
      'add_to_cart'
    );
    await trackEvent('cart', 'add_to_cart', {
      item_id: item.id,
      item_name: item.name,
      price: item.price
    });
  }, [trackMenuItemView, trackEvent]);

  /**
   * Track remove from cart
   */
  const trackRemoveFromCart = useCallback(async (item: {
    id: number;
    name: string;
  }) => {
    await trackMenuItemView(
      { itemId: String(item.id), itemName: item.name },
      'remove_from_cart'
    );
    await trackEvent('cart', 'remove_from_cart', {
      item_id: item.id,
      item_name: item.name
    });
  }, [trackMenuItemView, trackEvent]);

  /**
   * Track checkout start
   */
  const trackCheckoutStart = useCallback(async (cartTotal: number, itemCount: number) => {
    await trackEvent('checkout', 'checkout_started', {
      cart_total: cartTotal,
      item_count: itemCount
    });
  }, [trackEvent]);

  /**
   * Track checkout completion
   */
  const trackCheckoutComplete = useCallback(async (orderData: {
    orderId: string;
    total: number;
    itemCount: number;
  }) => {
    await trackEvent('checkout', 'checkout_completed', {
      order_id: orderData.orderId,
      total: orderData.total,
      item_count: orderData.itemCount
    });
  }, [trackEvent]);

  return {
    canTrack: canTrack(),
    trackPageView,
    trackMenuItemView,
    trackEvent,
    trackAddToCart,
    trackRemoveFromCart,
    trackCheckoutStart,
    trackCheckoutComplete
  };
};
