export interface Restaurant {
  id: string;
  name: string;
  cuisineType: string;
  description: string;
  imageUrl: string;
  rating: number;
  totalRatings: number;
  distance: number;
  deliveryTime: number;
  minimumOrder: number;
  priceRange: 1 | 2 | 3 | 4;
  serviceOptions: {
    delivery: boolean;
    pickup: boolean;
  };
  deliveryRadius: number;
  address: string;
  isOpen: boolean;
  openingHours: {
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