import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api";

interface TripData {
  startingLocation: string;
  location: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelers: number;
  interests: string[];
}

interface ItineraryResponse {
  id: string;
  origin?: string;
  location: string;
  duration: number;
  days: any[];
  summary?: string;
}

export function useGenerateItinerary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tripData: TripData): Promise<ItineraryResponse> => {
      // Map frontend field names to backend field names
      const payload = {
        origin: tripData.startingLocation,
        location: tripData.location,
        start_date: tripData.startDate,
        end_date: tripData.endDate,
        budget: tripData.budget,
        travelers: tripData.travelers,
        interests: tripData.interests,
      };
      const response = await apiClient.post("/itinerary/generate", payload);
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
      // Map frontend field names to backend field names
      const payload = {
        origin: tripData.startingLocation,
        location: tripData.location,
        start_date: tripData.startDate,
        end_date: tripData.endDate,
        budget: tripData.budget,
        travelers: tripData.travelers,
        interests: tripData.interests,
      };
      const response = await apiClient.post("/trips", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
}
