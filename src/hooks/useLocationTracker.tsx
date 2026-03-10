import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useLocationTracker = () => {
    const watchIdRef = useRef<number | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Generate a unique session ID for this visitor if they don't have one
        let sessionId = sessionStorage.getItem('nawa_visit_session');
        if (!sessionId) {
            sessionId = crypto.randomUUID();
            sessionStorage.setItem('nawa_visit_session', sessionId);
        }

        // Only run if geolocation is supported
        if (!('geolocation' in navigator)) {
            console.warn('Geolocation is not supported by this browser.');
            return;
        }

        const startTracking = async () => {
            // Create initial session record in database to mark connection
            try {
                await supabase.from('customer_locations').insert({
                    session_id: sessionId,
                    status: 'tracking_started'
                });
            } catch (e) {
                console.error("Failed to init track session", e);
            }

            watchIdRef.current = navigator.geolocation.watchPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    try {
                        await supabase.from('customer_locations').insert({
                            session_id: sessionId,
                            latitude,
                            longitude,
                            status: 'active'
                        });
                    } catch (err) {
                        console.error('Failed to log location:', err);
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 10000,
                    timeout: 5000
                }
            );

            // Stop tracking after exactly 10 minutes (600,000 ms)
            timeoutRef.current = setTimeout(async () => {
                if (watchIdRef.current !== null) {
                    navigator.geolocation.clearWatch(watchIdRef.current);
                    watchIdRef.current = null;

                    try {
                        await supabase.from('customer_locations').insert({
                            session_id: sessionId,
                            status: 'tracking_completed'
                        });
                    } catch (e) {
                        // silent fail
                    }
                }
            }, 10 * 60 * 1000);
        };

        startTracking();

        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
};
