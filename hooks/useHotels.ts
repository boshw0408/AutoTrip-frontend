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

export function useHotels(location: string) {
  return useQuery({
    queryKey: ["hotels", location],
    queryFn: async (): Promise<Hotel[]> => {
      const response = await apiClient.post("/hotels/search", { location });
      return response.data;
    },
    enabled: !!location,
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
