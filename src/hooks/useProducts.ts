import { useState, useEffect } from 'react';
import { Product } from '../types';

// Mock API function - replace with actual API call
const fetchProducts = async (categoryId?: string): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data
  const allProducts: Product[] = [
    // Appetizers
    {
      id: 'p1',
      name: 'Crispy Calamari',
      description: 'Lightly battered calamari, fried to perfection and served with marinara sauce',
      price: 12.99,
      imageUrl: 'https://images.pexels.com/photos/4553031/pexels-photo-4553031.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: '1',
      available: true,
      hasCustomization: true,
      tags: ['seafood', 'fried', 'popular']
    },
    {
      id: 'p2',
      name: 'Spinach Artichoke Dip',
      description: 'Creamy blend of spinach, artichokes, and melted cheeses, served with tortilla chips',
      price: 10.99,
      imageUrl: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: '1',
      available: true,
      hasCustomization: true,
      tags: ['vegetarian', 'shareable']
    },
    // Soups
    {
      id: 'p3',
      name: 'French Onion Soup',
      description: 'Caramelized onions in a rich beef broth, topped with croutons and melted Gruyère cheese',
      price: 8.99,
      imageUrl: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: '1-1',
      available: true,
      hasCustomization: false,
      tags: ['classic', 'hot']
    },
    // Main Courses
    {
      id: 'p4',
      name: 'Grilled Salmon',
      description: 'Fresh Atlantic salmon fillet, grilled and served with seasonal vegetables and lemon butter sauce',
      price: 21.99,
      imageUrl: 'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: '2',
      available: true,
      hasCustomization: true,
      tags: ['seafood', 'healthy', 'gluten-free']
    },
    {
      id: 'p5',
      name: 'Fettuccine Alfredo',
      description: 'Fettuccine pasta tossed in a rich, creamy Parmesan cheese sauce',
      price: 16.99,
      imageUrl: 'https://images.pexels.com/photos/5175537/pexels-photo-5175537.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: '2-1',
      available: true,
      hasCustomization: true,
      tags: ['pasta', 'vegetarian']
    },
    {
      id: 'p6',
      name: 'Classic Cheeseburger',
      description: 'Juicy beef patty topped with cheddar cheese, lettuce, tomato, and special sauce on a brioche bun',
      price: 14.99,
      imageUrl: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: '2-2',
      available: true,
      hasCustomization: true,
      tags: ['burger', 'popular']
    },
    // Desserts
    {
      id: 'p7',
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
      price: 8.99,
      imageUrl: 'https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: '3',
      available: true,
      hasCustomization: false,
      tags: ['chocolate', 'hot', 'popular']
    },
    // Beverages
    {
      id: 'p8',
      name: 'Fresh Lemonade',
      description: 'House-made lemonade with fresh-squeezed lemons',
      price: 4.99,
      imageUrl: 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: '4-2',
      available: true,
      hasCustomization: true,
      tags: ['refreshing', 'non-alcoholic']
    },
    {
      id: 'p9',
      name: 'Cold Brew Coffee',
      description: 'Smooth and bold coffee brewed cold for 24 hours',
      price: 4.99,
      imageUrl: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: '4-2',
      available: false,
      hasCustomization: true,
      tags: ['coffee', 'cold']
    }
  ];
  
  if (categoryId) {
    return allProducts.filter(product => 
      product.categoryId === categoryId || 
      product.categoryId.startsWith(`${categoryId}-`)
    );
  }
  
  return allProducts;
};

export const useProducts = (categoryId?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts(categoryId);
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryId]);

  return { products, loading, error };
};