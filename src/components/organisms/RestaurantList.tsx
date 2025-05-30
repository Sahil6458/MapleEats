import React, { useState } from 'react';
import { Restaurant, RestaurantFilters, ServiceType, SortOption } from '../../types/restaurant';
import { Star, Clock, MapPin, DollarSign, Filter, ChevronDown } from 'lucide-react';
import Button from '../atoms/Button';

interface RestaurantListProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
  selectedService: ServiceType;
}

const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
  onSelectRestaurant,
  selectedService
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('distance');
  const [filters, setFilters] = useState<RestaurantFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  // Filter restaurants based on selected filters
  const filteredRestaurants = restaurants.filter(restaurant => {
    if (filters.cuisineType?.length && !filters.cuisineType.includes(restaurant.cuisineType)) {
      return false;
    }
    if (filters.priceRange?.length && !filters.priceRange.includes(restaurant.priceRange)) {
      return false;
    }
    if (filters.minimumOrder && restaurant.minimumOrder > filters.minimumOrder) {
      return false;
    }
    if (filters.rating && restaurant.rating < filters.rating) {
      return false;
    }
    if (filters.serviceType) {
      if (filters.serviceType === 'delivery' && !restaurant.serviceOptions.delivery) {
        return false;
      }
      if (filters.serviceType === 'pickup' && !restaurant.serviceOptions.pickup) {
        return false;
      }
    }
    return true;
  });

  // Sort restaurants based on selected option
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        return a.distance - b.distance;
      case 'deliveryTime':
        return a.deliveryTime - b.deliveryTime;
      case 'rating':
        return b.rating - a.rating;
      case 'serviceType':
        return (b.serviceOptions.delivery ? 1 : 0) - (a.serviceOptions.delivery ? 1 : 0);
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Filters and Sort Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center"
        >
          <Filter size={20} className="mr-2" />
          Filters
        </Button>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="border border-gray-300 rounded-md py-1 px-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="distance">Distance</option>
            <option value="deliveryTime">Delivery Time</option>
            <option value="rating">Rating</option>
            <option value="serviceType">Service Type</option>
          </select>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          {/* Filter controls would go here */}
        </div>
      )}

      {/* Restaurant List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedRestaurants.map(restaurant => (
          <div
            key={restaurant.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-[1.02]"
            onClick={() => onSelectRestaurant(restaurant)}
          >
            <div className="relative h-48">
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              {!restaurant.isOpen && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">Currently Closed</span>
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{restaurant.name}</h3>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{restaurant.rating.toFixed(1)}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{restaurant.cuisineType}</p>

              <div className="flex items-center text-sm text-gray-500 mb-2">
                <MapPin size={16} className="mr-1" />
                <span>{restaurant.distance.toFixed(1)} km away</span>
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Clock size={16} className="mr-1" />
                <span>{restaurant.deliveryTime} mins</span>
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-3">
                <DollarSign size={16} className="mr-1" />
                <span>Min. ${restaurant.minimumOrder}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {restaurant.serviceOptions.delivery && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Delivery
                    </span>
                  )}
                  {restaurant.serviceOptions.pickup && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Pickup
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {'$'.repeat(restaurant.priceRange)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedRestaurants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No restaurants found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default RestaurantList;