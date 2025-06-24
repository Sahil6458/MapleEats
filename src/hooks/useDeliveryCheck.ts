// src/hooks/useDeliveryCheck.ts
import { useState, useCallback } from 'react';
import { CheckDeliveryParams, DeliveryAvailabilityResponse } from '../types/restaurant';
import RestaurantService from '../services/api/restaurantService';

export const useDeliveryCheck = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<DeliveryAvailabilityResponse | null>(null);

    const checkDelivery = useCallback(async (params: CheckDeliveryParams) => {
        setLoading(true);
        setError(null);

        try {
            const data = await RestaurantService.checkDeliveryAvailability(params);
            setResult(data);
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to check delivery availability';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { checkDelivery, loading, error, result };
};