import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/api";

interface Trip {
  id: string;
  location: string;
  startDate: string;
  endDate: string;
  duration: number;
  budget: number;
  travelers: number;
  interests: string[];
  itinerary: any;
}

export function useTrip(tripId: string) {
  return useQuery({
    queryKey: ["trip", tripId],
    queryFn: async (): Promise<Trip> => {
      const response = await apiClient.get(`/trips/${tripId}`);
      return response.data;
    },
    enabled: !!tripId,
  });
}

export function useTrips() {
  return useQuery({
    queryKey: ["trips"],
    queryFn: async (): Promise<Trip[]> => {
      const response = await apiClient.get("/trips");
      return response.data;
    },
  });
}
