export interface Restaurant {
  // Required fields from the API response
  address_id: number;
  city: string;
  pincode: string;
  contact_person_phone: string;
  opening_time: string;
  closing_time: string;

  // Fields needed for UI but not directly in the API response
  // These will be derived or mocked in the service layer
  id?: string;
  name?: string;
  cuisineType?: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  totalRatings?: number;
  distance?: number;
  deliveryTime?: number;
  minimumOrder?: number;
  priceRange?: 1 | 2 | 3 | 4;
  serviceOptions?: {
    delivery: boolean;
    pickup: boolean;
  };
  deliveryRadius?: number;
  address?: string;
  isOpen?: boolean;
  openingHours?: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
}

export type ServiceType = 'delivery' | 'pickup' | 'both';
export type SortOption = 'distance' | 'deliveryTime' | 'rating' | 'serviceType';

export interface RestaurantFilters {
  cuisineType?: string[];
  priceRange?: number[];
  serviceType?: ServiceType;
  minimumOrder?: number;
  rating?: number;
}

// In src/types/restaurant.ts
export interface DeliveryAvailabilityResponse {
  delivery_available: boolean;
  matched_addresses: RestaurantAddress[];
}

export interface RestaurantAddress {
  address_id: number;
  city: string;
  pincode: string;
  contact_person_phone: string;
  opening_time: string;
  closing_time: string;
  latitude: number;
  longitude: number;
  // Additional UI fields
  name?: string;
  imageUrl?: string;
  rating?: number;
  isOpen?: boolean;
}

export interface CheckDeliveryParams {
  restaurant_id: number;
  latitude: number;
  longitude: number;
}