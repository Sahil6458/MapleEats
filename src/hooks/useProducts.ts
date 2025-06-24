import { useState, useEffect } from 'react';
import { Product } from '../types';

// Mock API function - replace with actual API call
const fetchProducts = async (categoryId?: string): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data - Updated for new category structure
  const allProducts: Product[] = [
    // Starters (Category ID: 3)
    {
      id: 'p1',
      name: 'Buffalo Wings',
      description: 'Crispy chicken wings tossed in spicy buffalo sauce, served with celery and blue cheese dip',
      price: 12.99,
      imageUrl: 'https://images.pexels.com/photos/7290308/pexels-photo-7290308.jpeg',
      categoryId: '3',
      available: true,
      hasCustomization: true,
      tags: ['chicken', 'spicy', 'popular']
    },
    {
      id: 'p2',
      name: 'Mozzarella Sticks',
      description: 'Golden fried mozzarella cheese sticks served with marinara sauce',
      price: 9.99,
      imageUrl: 'https://images.pexels.com/photos/4553031/pexels-photo-4553031.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: '3',
      available: true,
      hasCustomization: true,
      tags: ['cheese', 'fried', 'vegetarian']
    },
    {
      id: 'p3',
      name: 'Loaded Nachos',
      description: 'Tortilla chips topped with melted cheese, jalapeños, sour cream, and guacamole',
      price: 11.99,
      imageUrl: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: '3',
      available: true,
      hasCustomization: true,
      tags: ['mexican', 'shareable', 'vegetarian']
    },

    // Burgers (Category ID: 4)
    {
      id: 'p4',
      name: 'Classic Cheeseburger',
      description: 'Juicy beef patty topped with cheddar cheese, lettuce, tomato, and special sauce on a brioche bun',
      price: 14.99,
      imageUrl: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: '4',
      available: true,
      hasCustomization: true,
      tags: ['burger', 'popular', 'beef']
    },
    {
      id: 'p5',
      name: 'BBQ Bacon Burger',
      description: 'Beef patty with crispy bacon, BBQ sauce, onion rings, and cheddar cheese',
      price: 16.99,
      imageUrl: 'https://images.pexels.com/photos/3616956/pexels-photo-3616956.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: '4',
      available: true,
      hasCustomization: true,
      tags: ['burger', 'bacon', 'bbq']
    },
    {
      id: 'p6',
      name: 'Veggie Burger',
      description: 'Plant-based patty with avocado, lettuce, tomato, and herb mayo on a whole wheat bun',
      price: 13.99,
      imageUrl: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: '4',
      available: true,
      hasCustomization: true,
      tags: ['vegetarian', 'healthy', 'vegan']
    },

    // Pizzas (Category ID: 5)
    {
      id: 'p7',
      name: 'Margherita Pizza',
      description: 'Classic pizza with fresh mozzarella, tomato sauce, and basil leaves',
      price: 18.99,
      imageUrl: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: '5',
      available: true,
      hasCustomization: true,
      tags: ['pizza', 'classic', 'vegetarian']
    },
    {
      id: 'p8',
      name: 'Pepperoni Pizza',
      description: 'Traditional pizza topped with pepperoni slices and mozzarella cheese',
      price: 20.99,
      imageUrl: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: '5',
      available: true,
      hasCustomization: true,
      tags: ['pizza', 'pepperoni', 'popular']
    },
    {
      id: 'p9',
      name: 'Supreme Pizza',
      description: 'Loaded with pepperoni, sausage, mushrooms, bell peppers, and onions',
      price: 24.99,
      imageUrl: 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: '5',
      available: true,
      hasCustomization: true,
      tags: ['pizza', 'supreme', 'loaded']
    },

    // Beverages (Category ID: 6)
    {
      id: 'p10',
      name: 'Fresh Lemonade',
      description: 'House-made lemonade with fresh-squeezed lemons',
      price: 4.99,
      imageUrl: 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: '6',
      available: true,
      hasCustomization: true,
      tags: ['refreshing', 'non-alcoholic', 'citrus']
    },
    {
      id: 'p11',
      name: 'Cold Brew Coffee',
      description: 'Smooth and bold coffee brewed cold for 24 hours',
      price: 5.99,
      imageUrl: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: '6',
      available: true,
      hasCustomization: true,
      tags: ['coffee', 'cold', 'caffeine']
    },
    {
      id: 'p12',
      name: 'Strawberry Milkshake',
      description: 'Creamy vanilla ice cream blended with fresh strawberries and milk',
      price: 6.99,
      imageUrl: 'https://images.pexels.com/photos/434295/pexels-photo-434295.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: '6',
      available: true,
      hasCustomization: true,
      tags: ['milkshake', 'strawberry', 'sweet']
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