import { useState, useEffect } from 'react';
import { Category } from '../types';
import RestaurantService from '../services/api/restaurantService';

interface UseCategoriesResult {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useCategories = (addressId: string): UseCategoriesResult => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await RestaurantService.getMenuCategories(addressId);
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load menu categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [addressId]);

  return { 
    categories, 
    loading, 
    error,
    refresh: fetchCategories
  };
};