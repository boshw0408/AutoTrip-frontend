import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api";

interface TripData {
  location: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelers: number;
  interests: string[];
}

interface ItineraryResponse {
  id: string;
  location: string;
  duration: number;
  days: any[];
  summary?: string;
}

export function useGenerateItinerary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tripData: TripData): Promise<ItineraryResponse> => {
      const response = await apiClient.post("/itinerary/generate", tripData);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch trips
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tripData: TripData) => {
      const response = await apiClient.post("/trips", tripData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
}
