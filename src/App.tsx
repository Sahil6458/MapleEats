import React, { useEffect, useState } from 'react';
import RestaurantService from './services/api/restaurantService';
import ComingSoonAnimation from './components/molecules/ComingSoonAnimation';
import LoadingAnimation from './components/molecules/LoadingAnimation';
import DeliveryMenu from './components/templates/DeliveryMenu';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LocationPrompt from './components/organisms/LocationPrompt';
import RestaurantList from './components/organisms/RestaurantList';
import { Restaurant, ServiceType } from './types/restaurant';

// Define location interface
export interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

function App() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [noRestaurantsAvailable, setNoRestaurantsAvailable] = useState<boolean>(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceType>('delivery');
  const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Theme customization example for a specific vendor
  const vendorTheme = {
    colors: {
      primary: '#2563EB',  // Blue
      secondary: '#0D9488', // Teal
      accent: '#F97316',    // Orange
      success: '#10B981',   // Green
      warning: '#F59E0B',   // Amber
      error: '#EF4444',     // Red
      background: '#F9FAFB', // Gray-50
      surface: '#FFFFFF',   // White
      text: {
        primary: '#111827',  // Gray-900
        secondary: '#4B5563', // Gray-600
        disabled: '#9CA3AF'  // Gray-400
      }
    }
  };

  // Mock restaurants data - used as fallback if API fails
  const mockRestaurants: Restaurant[] = [
    {
      // Required fields from API
      address_id: 1,
      city: 'Ahmedabad',
      pincode: '380011',
      contact_person_phone: '+918876543210',
      opening_time: '10:00:00',
      closing_time: '22:30:00',

      // UI fields
      id: '1',
      name: 'Tasty Bites',
      cuisineType: 'American',
      description: 'Classic American comfort food',
      imageUrl: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
      rating: 4.5,
      totalRatings: 256,
      distance: 1.2,
      deliveryTime: 25,
      minimumOrder: 15,
      priceRange: 2,
      serviceOptions: {
        delivery: true,
        pickup: true
      },
      deliveryRadius: 5,
      address: 'Ahmedabad, 380011',
      isOpen: true,
      openingHours: {
        monday: { open: '10:00', close: '22:30' }
      }
    },
    // Add more restaurants as needed
  ];

  // Fetch nearby restaurants when location changes
  useEffect(() => {
    // Only fetch if we have a location
    if (location) {
      console.log('location>>>>>>', location);
      fetchNearbyRestaurants(location.lat, location.lng);
    }
  }, [location]);

  // Function to fetch nearby restaurants from API using the service with interceptors
  const fetchNearbyRestaurants = async (latitude: number, longitude: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // Using our RestaurantService with Axios interceptors
      const restaurants = await RestaurantService.getNearbyRestaurants(latitude, longitude);
      if (restaurants && restaurants.length > 0) {
        setNearbyRestaurants(restaurants);
        setNoRestaurantsAvailable(false);
      } else {
        // Show coming soon animation instead of fallback mock data
        setNoRestaurantsAvailable(true);
        console.warn('API returned no restaurants, showing coming soon animation');
      }
    } catch (err) {
      console.error('Error fetching nearby restaurants:', err);
      setError('Failed to fetch nearby restaurants');
      // Fallback to mock data on error
      // setNearbyRestaurants(mockRestaurants);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset location and no restaurants state to try again
  const handleRetryLocation = () => {
    setLocation(null);
    setNoRestaurantsAvailable(false);
  };

  // Handle back to location selection
  const handleBackToLocation = () => {
    setSelectedRestaurant(null);
    setLocation(null);
    setNearbyRestaurants([]);
    setNoRestaurantsAvailable(false);
    setError(null);
  };

  // Handle back to restaurant list from menu
  const handleBackToRestaurants = () => {
    setSelectedRestaurant(null);
  };

  return (
    <ThemeProvider initialTheme={vendorTheme}>
      <AuthProvider>
        <OrderProvider>
          <CartProvider>
          {!location && <LocationPrompt onLocationSelect={setLocation} />}

          {location && noRestaurantsAvailable && (
            <ComingSoonAnimation onRetry={handleRetryLocation} />
          )}

          {location && !selectedRestaurant && !noRestaurantsAvailable && (
            <>
              {isLoading && <LoadingAnimation text="Finding restaurants near you..." />}
              {error && <div className="error-message">{error}</div>}
              {nearbyRestaurants.length > 0 && (
                <RestaurantList
                  restaurants={nearbyRestaurants}
                  onSelectRestaurant={setSelectedRestaurant}
                  selectedService={selectedService}
                  onBackToLocation={handleBackToLocation}
                  currentLocation={location.address}
                />
              )}
            </>
          )}

          {location && selectedRestaurant && (
            <div className="min-h-screen bg-gray-100">
              <DeliveryMenu
                vendorId={selectedRestaurant?.id || '1'}
                addressId={Number(selectedRestaurant?.address_id)}
                deliveryLocation={location}
                onBackToRestaurants={handleBackToRestaurants}
                className="min-h-screen"
              />
            </div>
          )}
        </CartProvider>
      </OrderProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;