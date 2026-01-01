import { supabase } from '@/integrations/supabase/client';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

interface MenuItemData {
  title: string;
  price: number;
  description?: string;
  image_url?: string;
  category: string;
  published?: boolean;
}

export const adminService = {
  async login(password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
        credentials: 'include',
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Network error' };
    }
  },

  async logout(): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      return { success: response.ok };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false };
    }
  },

  async checkSession(): Promise<boolean> {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-session`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) return false;
      
      const data = await response.json();
      return data.authenticated === true;
    } catch (error) {
      console.error('Session check error:', error);
      return false;
    }
  },

  async createMenuItem(itemData: MenuItemData): Promise<{ success: boolean; item?: any; error?: string }> {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'create',
          title: itemData.title,
          price: itemData.price,
          description: itemData.description || null,
          image_url: itemData.image_url || null,
          category: itemData.category,
          published: itemData.published ?? true,
        }),
        credentials: 'include',
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to create item' };
      }

      return { success: true, item: data.item };
    } catch (error: any) {
      console.error('Create item error:', error);
      return { success: false, error: error.message || 'Network error' };
    }
  },

  async updateMenuItem(id: string, itemData: Partial<MenuItemData>): Promise<{ success: boolean; item?: any; error?: string }> {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id,
          action: 'update',
          ...itemData,
        }),
        credentials: 'include',
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to update item' };
      }

      return { success: true, item: data.item };
    } catch (error: any) {
      console.error('Update item error:', error);
      return { success: false, error: error.message || 'Network error' };
    }
  },

  async deleteMenuItem(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id,
          action: 'delete',
        }),
        credentials: 'include',
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to delete item' };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Delete item error:', error);
      return { success: false, error: error.message || 'Network error' };
    }
  },

  async getAllItems(): Promise<{ success: boolean; items?: any[]; error?: string }> {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-items`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to fetch items' };
      }

      return { success: true, items: data.items };
    } catch (error: any) {
      console.error('Fetch items error:', error);
      return { success: false, error: error.message || 'Network error' };
    }
  },
};
