import { createContext, useContext, useState, ReactNode } from 'react';

interface PendingChange {
  type: 'add' | 'edit' | 'delete';
  page: 'menu' | 'catering' | 'store';
  category?: string;
  section?: string;
  data?: any;
  id?: string | number;
}

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  pendingChanges: PendingChange[];
  addPendingChange: (change: PendingChange) => void;
  clearPendingChanges: () => void;
  hasPendingChanges: () => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);

  const addPendingChange = (change: PendingChange) => {
    setPendingChanges(prev => [...prev, change]);
  };

  const clearPendingChanges = () => {
    setPendingChanges([]);
  };

  const hasPendingChanges = () => {
    return pendingChanges.length > 0;
  };

  return (
    <AdminContext.Provider value={{ 
      isAdmin, 
      setIsAdmin, 
      pendingChanges, 
      addPendingChange, 
      clearPendingChanges,
      hasPendingChanges 
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};
