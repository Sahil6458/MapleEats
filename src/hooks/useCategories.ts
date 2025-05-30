import { useState, useEffect } from 'react';
import { Category } from '../types';

// Mock API function - replace with actual API call
const fetchCategories = async (): Promise<Category[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock data
  return [
    {
      id: '1',
      name: 'Appetizers',
      description: 'Start your meal right',
      imageUrl: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      slug: 'appetizers',
      featured: true,
      sortOrder: 1,
      subcategories: [
        {
          id: '1-1',
          name: 'Soups',
          slug: 'soups',
          parentId: '1',
          sortOrder: 1
        },
        {
          id: '1-2',
          name: 'Salads',
          slug: 'salads',
          parentId: '1',
          sortOrder: 2
        }
      ]
    },
    {
      id: '2',
      name: 'Main Courses',
      description: 'Delicious entrées',
      imageUrl: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      slug: 'main-courses',
      featured: true,
      sortOrder: 2,
      subcategories: [
        {
          id: '2-1',
          name: 'Pasta',
          slug: 'pasta',
          parentId: '2',
          sortOrder: 1
        },
        {
          id: '2-2',
          name: 'Burgers',
          slug: 'burgers',
          parentId: '2',
          sortOrder: 2
        }
      ]
    },
    {
      id: '3',
      name: 'Desserts',
      description: 'Sweet treats',
      imageUrl: 'https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      slug: 'desserts',
      featured: true,
      sortOrder: 3
    },
    {
      id: '4',
      name: 'Beverages',
      description: 'Refreshing drinks',
      imageUrl: 'https://images.pexels.com/photos/452737/pexels-photo-452737.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      slug: 'beverages',
      sortOrder: 4,
      subcategories: [
        {
          id: '4-1',
          name: 'Hot Drinks',
          slug: 'hot-drinks',
          parentId: '4',
          sortOrder: 1
        },
        {
          id: '4-2',
          name: 'Cold Drinks',
          slug: 'cold-drinks',
          parentId: '4',
          sortOrder: 2
        }
      ]
    }
  ];
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError('Failed to load categories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return { categories, loading, error };
};