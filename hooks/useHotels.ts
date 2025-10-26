import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/api";

interface Hotel {
  id: string;
  name: string;
  rating: number;
  price: number;
  address: string;
  amenities: string[];
  image: string;
  distance: string;
}

interface TripData {
  destination: string;
  check_in: string;
  check_out: string;
  travelers: number;
  budget: number;
  interests: string[];
  starting_location?: string;
}

export function useHotels(tripData: TripData | null) {
  return useQuery({
    queryKey: ["hotels", tripData],
    queryFn: async (): Promise<Hotel[]> => {
      if (!tripData) return [];
      const response = await apiClient.post("/hotels/search", tripData);
      return response.data;
    },
    enabled: !!tripData,
  });
}

export function usePlaces(location: string, type: string = "attractions") {
  return useQuery({
    queryKey: ["places", location, type],
    queryFn: async () => {
      const response = await apiClient.post("/places/search", {
        location,
        type,
      });
      return response.data;
    },
    enabled: !!location,
  });
}
