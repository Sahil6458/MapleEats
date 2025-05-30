import React, { useState } from 'react';
import DeliveryMenu from './components/templates/DeliveryMenu';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import LocationPrompt from './components/organisms/LocationPrompt';
import RestaurantList from './components/organisms/RestaurantList';
import { Restaurant, ServiceType } from './types/restaurant';

function App() {
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceType>('delivery');

  // Theme customization example for a specific vendor
  const vendorTheme = {
    colors: {
      primary: '#2563EB',  // Blue
      secondary: '#0D9488', // Teal
      accent: '#F97316'     // Orange
    }
  };

  if (!location) {
    return <LocationPrompt onLocationSelect={setLocation} />;
  }

  // Mock restaurants data - in a real app, this would come from an API
  const restaurants: Restaurant[] = [
    {
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
      address: '123 Main St',
      isOpen: true,
      openingHours: {
        monday: { open: '11:00', close: '22:00' }
      }
    },
    // Add more restaurants as needed
  ];

  if (!selectedRestaurant) {
    return (
      <RestaurantList
        restaurants={restaurants}
        onSelectRestaurant={setSelectedRestaurant}
        selectedService={selectedService}
      />
    );
  }

  return (
    <ThemeProvider initialTheme={vendorTheme}>
      <CartProvider>
        <div className="min-h-screen bg-gray-100">
          <DeliveryMenu vendorId={selectedRestaurant.id} className="min-h-screen" />
        </div>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;