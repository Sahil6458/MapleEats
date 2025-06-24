import axiosInstance from './axios';
import { CheckDeliveryParams, DeliveryAvailabilityResponse, Restaurant, ServiceType } from '../../types/restaurant';
import { Category, Product, Variant, Modifier } from '../../types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Helper function to check if restaurant is currently open
const isRestaurantOpen = (openingTime: string, closingTime: string): boolean => {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes

  // Parse opening and closing times
  const [openHour, openMin] = openingTime.split(':').map(Number);
  const [closeHour, closeMin] = closingTime.split(':').map(Number);
  
  const openTimeMinutes = openHour * 60 + openMin;
  const closeTimeMinutes = closeHour * 60 + closeMin;

  // Handle case where restaurant closes after midnight
  if (closeTimeMinutes < openTimeMinutes) {
    return currentTime >= openTimeMinutes || currentTime <= closeTimeMinutes;
  }
  
  return currentTime >= openTimeMinutes && currentTime <= closeTimeMinutes;
};

// Helper function to calculate distance using MapBox Matrix API
const calculateDistanceFromMapBox = async (
  userLat: number, 
  userLng: number, 
  restaurantLat: number, 
  restaurantLng: number
): Promise<{ distance: number; duration: number }> => {
  const mapboxToken = 'pk.eyJ1Ijoic2FoaWxiZWxpbW4iLCJhIjoiY20wemZlODcxMDVleTJsc2Z6OTByNW5ycSJ9.QNA7fVbFp2DrLealDWm2JQ';
  
  try {
    // MapBox Matrix API for driving distances and durations
    const response = await fetch(
      `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${userLng},${userLat};${restaurantLng},${restaurantLat}?sources=0&destinations=1&access_token=${mapboxToken}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    
    if (data.distances && data.distances[0] && data.durations && data.durations[0]) {
      return {
        distance: Math.round((data.distances[0][0] / 1000) * 10) / 10, // Convert meters to km, round to 1 decimal
        duration: Math.round(data.durations[0][0] / 60) // Convert seconds to minutes
      };
    }
    
    // Fallback to simple calculation if API fails
    return calculateHaversineDistance(userLat, userLng, restaurantLat, restaurantLng);
  } catch (error) {
    console.error('Error calculating distance with MapBox:', error);
    // Fallback to simple calculation
    return calculateHaversineDistance(userLat, userLng, restaurantLat, restaurantLng);
  }
};

// Fallback function to calculate distance using Haversine formula
const calculateHaversineDistance = (
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): { distance: number; duration: number } => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = Math.round((R * c) * 10) / 10; // Round to 1 decimal place
  
  // Estimate duration based on average speed (assume 30 km/h in city)
  const duration = Math.round((distance / 30) * 60); // Convert to minutes
  
  return { distance, duration };
};

const RestaurantService = {
  /**
   * Check delivery availability for restaurants near a location
   * @param latitude - User's latitude
   * @param longitude - User's longitude
   * @returns Array of available restaurants
   */
  getNearbyRestaurants: async (latitude: number, longitude: number): Promise<Restaurant[]> => {
    try {
      const response = await axiosInstance.post<DeliveryAvailabilityResponse>(
        '/restaurant/check-delivery-available/',
        {
          restaurant_id: 2, // Default restaurant ID
          latitude,
          longitude
        }
      );

      // Check if delivery is available
      if (!response.data.delivery_available) {
        return [];
      }

      // Transform matched_addresses to Restaurant objects with distance calculation
      const restaurants: Restaurant[] = await Promise.all(
        response.data.matched_addresses.map(async (address, index) => {
          // Use provided coordinates or fallback to mock coordinates for St Catharines
          const restaurantLat = address.latitude || 43.140965;
          const restaurantLng = address.longitude || -79.238715;
          
          // Calculate real distance and duration using MapBox
          const { distance, duration } = await calculateDistanceFromMapBox(
            latitude, 
            longitude, 
            restaurantLat, 
            restaurantLng
          );

          return {
            // Required fields from API
            address_id: address.address_id,
            city: address.city,
            pincode: address.pincode,
            contact_person_phone: address.contact_person_phone,
            opening_time: address.opening_time,
            closing_time: address.closing_time,

            // UI fields - these would ideally come from another API or be enriched
            id: address.address_id.toString(),
            name: `Restaurant ${address.city}`, // Default name based on city
            cuisineType: 'Multi-Cuisine',
            description: `Delicious food delivery in ${address.city}`,
            imageUrl: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
            rating: 4.0 + (index * 0.1), // Mock rating
            totalRatings: 100 + (index * 50),
            distance: distance, // Real distance from MapBox
            deliveryTime: duration + 10, // Add 10 minutes preparation time to travel duration
            minimumOrder: 15,
            priceRange: 2 as 1 | 2 | 3 | 4,
            serviceOptions: {
              delivery: true,
              pickup: true
            },
            deliveryRadius: 5,
            address: `${address.city}, ${address.pincode}`,
            isOpen: isRestaurantOpen(address.opening_time, address.closing_time),
            openingHours: {
              monday: { open: address.opening_time.slice(0, 5), close: address.closing_time.slice(0, 5) }
            }
          };
        })
      );

      return restaurants;
    } catch (error) {
      console.error('Error fetching nearby restaurants:', error);
      throw error;
    }
  },

  /**
   * Get details for a specific restaurant
   * @param restaurantId - ID of the restaurant
   * @returns Restaurant details
   */
  getRestaurantDetails: async (restaurantId: string): Promise<Restaurant> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Restaurant>>(
        `/restaurant/${restaurantId}/`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
      throw error;
    }
  },

  /**
   * Get menu categories for a restaurant address
   * @param addressId - ID of the restaurant address
   * @returns Array of menu categories
   */
  getMenuCategories: async (addressId: string): Promise<Category[]> => {
    try {
      const response = await axiosInstance.get<Category[]>(
        `/restaurant/get-menu-categories?address_id=${addressId}`
      );
      return response.data || [];
    } catch (error) {
      console.error('Error fetching menu categories:', error);
      throw error;
    }
  },

  /**
   * Get menu items for a specific category
   * @param restaurantId - ID of the restaurant
   * @param categoryId - ID of the category
   * @returns Array of menu items
   */
  getMenuItems: async (restaurantId: string, categoryId: string): Promise<Product[]> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Product[]>>(
        `/restaurant/${restaurantId}/category/${categoryId}/items/`
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  },

  /**
   * Get variants for a specific menu item
   * @param itemId - ID of the menu item
   * @returns Array of variants
   */
  getItemVariants: async (itemId: string): Promise<Variant[]> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Variant[]>>(
        `/menu/item/${itemId}/variants/`
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching item variants:', error);
      throw error;
    }
  },

  /**
   * Get addons for a specific menu item
   * @param itemId - ID of the menu item
   * @returns Array of addons
   */
  getItemAddons: async (itemId: string): Promise<Modifier[]> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Modifier[]>>(
        `/menu/item/${itemId}/addons/`
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching item addons:', error);
      throw error;
    }
  },
  checkDeliveryAvailability: async (
    params: CheckDeliveryParams
  ): Promise<DeliveryAvailabilityResponse> => {
    try {
      const response = await axiosInstance.post<DeliveryAvailabilityResponse>(
        '/restaurant/check-delivery-available/',
        params
      );
      return response.data;
    } catch (error) {
      console.error('Error checking delivery availability:', error);
      throw error;
    }
  }
};

export default RestaurantService;