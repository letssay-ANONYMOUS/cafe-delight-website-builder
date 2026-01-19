import { useState, useEffect } from 'react';

const VISITOR_ID_KEY = 'nawa_visitor_id';

/**
 * Generates a unique visitor ID using crypto API
 */
const generateVisitorId = (): string => {
  // Use crypto.randomUUID if available, otherwise fallback
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Hook to get or create a persistent visitor ID
 * This ID persists across browser sessions and page refreshes
 */
export const useVisitorId = () => {
  const [visitorId, setVisitorId] = useState<string>('');

  useEffect(() => {
    // Check for existing visitor ID
    let storedId = localStorage.getItem(VISITOR_ID_KEY);
    
    if (!storedId) {
      // Generate new ID if none exists
      storedId = generateVisitorId();
      localStorage.setItem(VISITOR_ID_KEY, storedId);
    }
    
    setVisitorId(storedId);
  }, []);

  return visitorId;
};

/**
 * Get visitor ID synchronously (for use outside React components)
 */
export const getVisitorId = (): string => {
  let storedId = localStorage.getItem(VISITOR_ID_KEY);
  
  if (!storedId) {
    storedId = generateVisitorId();
    localStorage.setItem(VISITOR_ID_KEY, storedId);
  }
  
  return storedId;
};

export default useVisitorId;
