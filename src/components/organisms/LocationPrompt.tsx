import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import Button from '../atoms/Button';

interface LocationPromptProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

const LocationPrompt: React.FC<LocationPromptProps> = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGetCurrentLocation = () => {
    setLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Here you would typically make an API call to reverse geocode the coordinates
            // For demo purposes, we'll use mock data
            onLocationSelect({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              address: '123 Main St, City, State'
            });
          } catch (error) {
            console.error('Error getting location:', error);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        }
      );
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to geocode the address
    // For demo purposes, we'll use mock data
    onLocationSelect({
      lat: 40.7128,
      lng: -74.0060,
      address: searchQuery
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Choose Your Location</h2>
        
        <Button
          onClick={handleGetCurrentLocation}
          variant="outline"
          fullWidth
          className="mb-4"
          loading={loading}
        >
          <MapPin className="mr-2 h-5 w-5" />
          Use Current Location
        </Button>

        <div className="relative">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Or enter your address</h3>
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter your address"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              className="mt-4"
              disabled={!searchQuery.trim()}
            >
              Find Restaurants
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LocationPrompt;