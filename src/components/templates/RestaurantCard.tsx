// src/components/RestaurantCard.tsx
import React from 'react';
import { RestaurantAddress } from '../types/restaurant';

interface RestaurantCardProps {
    restaurant: RestaurantAddress;
    onSelect: (addressId: number) => void;
    isSelected?: boolean;
}

const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

const RestaurantCard: React.FC<RestaurantCardProps> = ({
    restaurant,
    onSelect,
    isSelected = false
}) => {
    return (
        <div
            className={`p-4 border rounded-lg cursor-pointer transition-all ${isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
            onClick={() => onSelect(restaurant.address_id)}
        >
            <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {restaurant.imageUrl && (
                        <img
                            src={restaurant.imageUrl}
                            alt={restaurant.name || 'Restaurant'}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                        {restaurant.name || 'Restaurant Name'}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-yellow-500">★ {restaurant.rating?.toFixed(1) || '4.5'}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">{restaurant.city}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                        <p>Pincode: {restaurant.pincode}</p>
                        <p>Timing: {formatTime(restaurant.opening_time)} - {formatTime(restaurant.closing_time)}</p>
                        <p>Contact: {restaurant.contact_person_phone}</p>
                    </div>
                    <div className="mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${restaurant.isOpen
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                            {restaurant.isOpen ? 'Open Now' : 'Closed'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantCard;