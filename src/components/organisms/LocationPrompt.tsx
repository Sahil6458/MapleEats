import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search } from 'lucide-react';
import Button from '../atoms/Button';
import TopBar from '../molecules/TopBar';

interface LocationPromptProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

const LocationPrompt: React.FC<LocationPromptProps> = ({ onLocationSelect }): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ place_name: string; center: [number, number] }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // MapBox access token
  const mapboxToken = 'pk.eyJ1Ijoic2FoaWxiZWxpbW4iLCJhIjoiY20wemZlODcxMDVleTJsc2Z6OTByNW5ycSJ9.QNA7fVbFp2DrLealDWm2JQ';

  const handleGetCurrentLocation = () => {
    console.log('🔍 Location button clicked - starting geolocation request');
    setLocationLoading(true);
    
    if ('geolocation' in navigator) {
      console.log('✅ Geolocation is supported by browser');
      
      // Simplest possible options - no restrictions
      const geoOptions = {
        enableHighAccuracy: false, // Don't require high accuracy to avoid delays
        timeout: 30000,            // 30 seconds timeout
        maximumAge: 600000         // Allow 10 minute old cached position
      };

      console.log('📍 Calling getCurrentPosition with options:', geoOptions);

      // Pass the geoOptions to getCurrentPosition
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log("✅ SUCCESS: Got position", position);
          try {
            // Use MapBox Geocoding API to reverse geocode the coordinates
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            console.log(`📍 Coordinates: ${lat}, ${lng}`);
            
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}&language=en`,
              { headers: { 'Accept': 'application/json' } }
            );
            const data = await response.json();
            // MapBox returns an array of features, with the first one being the most relevant
            const address = data.features && data.features.length > 0 ? data.features[0].place_name : 'Address not found';
            console.log("🏠 Resolved address:", address);
            onLocationSelect({
              lat: lat,
              lng: lng,
              address: address
            });
          } catch (error) {
            console.error('❌ Error getting address from coordinates:', error);
          } finally {
            setLocationLoading(false);
          }
        },
        (error) => {
          console.error('❌ GEOLOCATION ERROR:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          
          // Log specific error types
          switch (error.code) {
            case 1:
              console.error('🚫 PERMISSION_DENIED - User denied the request');
              break;
            case 2:
              console.error('📍 POSITION_UNAVAILABLE - Location info unavailable');
              break;
            case 3:
              console.error('⏰ TIMEOUT - Request timed out');
              break;
            default:
              console.error('❓ UNKNOWN_ERROR');
              break;
          }
          
          setLocationLoading(false);
        },
        geoOptions
      );
    } else {
      console.error('❌ Geolocation is NOT supported by this browser');
      setLocationLoading(false);
    }
  };

  // Fetch address suggestions from MapBox Places API with debounce
  useEffect(() => {
    // Clear previous timeout if it exists
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Only fetch suggestions if query is at least 3 characters
    if (searchQuery.length >= 3) {
      setSearchLoading(true);
      // Set a new timeout for debouncing (300ms)
      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          // Call MapBox Places API with country restriction to Canada
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxToken}&country=ca&language=en`,
            { headers: { 'Accept': 'application/json' } }
          );
          const data = await response.json();
          setSuggestions(data.features || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching address suggestions:', error);
        } finally {
          setSearchLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSearchLoading(false);
    }

    // Cleanup function
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery, mapboxToken]);

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: { place_name: string; center: [number, number] }) => {
    setSearchQuery(suggestion.place_name);
    setShowSuggestions(false);
    // Extract coordinates from the selected suggestion
    const [lng, lat] = suggestion.center;
    onLocationSelect({
      lat,
      lng,
      address: suggestion.place_name
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If there are suggestions, use the first one
    if (suggestions.length > 0) {
      const [lng, lat] = suggestions[0].center;
      onLocationSelect({
        lat,
        lng,
        address: suggestions[0].place_name
      });
    } else if (searchQuery.trim()) {
      // Fallback if no suggestions but query exists
      setSearchLoading(true);
      // Make a direct geocoding request
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxToken}&country=ca&language=en`
      )
        .then(response => response.json())
        .then(data => {
          if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].center;
            onLocationSelect({
              lat,
              lng,
              address: data.features[0].place_name
            });
          }
        })
        .catch(error => console.error('Error geocoding address:', error))
        .finally(() => {
          setSearchLoading(false);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <TopBar 
        title="MapleEats"
        subtitle="Choose Your Location"
      />

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-8 min-h-[calc(100vh-80px)]">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-blue-600" size={32} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Choose Your Location</h2>
            <p className="text-gray-600">We need your location to show nearby restaurants</p>
          </div>

          <Button
            onClick={handleGetCurrentLocation}
            variant="outline"
            fullWidth
            className="mb-4"
            loading={locationLoading}
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
                  placeholder="Enter your address in Canada"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  autoComplete="off"
                />

                {/* Address suggestions dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                    <ul className="py-1">
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => handleSuggestionSelect(suggestion)}
                        >
                          {suggestion.place_name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                className="mt-4"
                disabled={!searchQuery.trim() || searchLoading}
                loading={searchLoading}
              >
                {searchLoading ? 'Searching...' : 'Find Restaurants'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPrompt;