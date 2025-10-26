import React, { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GoogleMap, useJsApiLoader, Marker, MarkerClusterer, InfoWindow, OverlayView } from '@react-google-maps/api'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/api'

interface LatLng {
  lat: number
  lng: number
}

interface MapViewProps {
  location: string
  height?: string
  /** Optional ordered stops for directions (start -> waypoints -> end) */
  stops?: LatLng[]
  /** Optional hotels data to display on map */
  hotels?: any[]
  /** Starting location for route */
  startLocation?: string
  /** Show route from start to destination */
  showRoute?: boolean
}

// Small wrapper to attach a DirectionsRenderer to a map and style the polyline red
function DirectionsRendererWrapper({ directions, map }: { directions: any; map: any }) {
  useEffect(() => {
    if (!map || !directions) return
    const google = (window as any).google
    const renderer = new google.maps.DirectionsRenderer({
      polylineOptions: { strokeColor: '#ef4444', strokeWeight: 6 },
      suppressMarkers: true,
      preserveViewport: true,
    })
    renderer.setMap(map)
    renderer.setDirections(directions)
    return () => {
      renderer.setMap(null)
    }
  }, [directions, map])
  return null
}

export default function MapView({ location, height = '400px', stops, hotels: propHotels, startLocation, showRoute = false }: MapViewProps) {
  // Load the Google Maps JS API using the public env var (set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  })

  // Default center (will be replaced with route center when stops are available)
  const defaultCenter = useMemo(() => ({ lat: 37.7749, lng: -122.4194 }), [])

  

  const [directions, setDirections] = useState<any | null>(null)
  const [directionsError, setDirectionsError] = useState<string | null>(null)
  const [map, setMap] = useState<any | null>(null)
  const [selectedHotel, setSelectedHotel] = useState<any | null>(null)
  const [routeStops, setRouteStops] = useState<LatLng[]>([])

  // Fetch aggregated location data (includes server-side geocoding + hotels) from backend
  const { data: aggResp, isLoading: aggLoading } = useQuery({
    queryKey: ['locationData', location],
    queryFn: async () => {
      const res = await apiClient.get(`/aggregation/location-data/${encodeURIComponent(location)}`)
      return res.data
    },
    enabled: !!location,
  })

  // The backend GET returns a wrapper { status, location, data, summary }
  const aggData = (aggResp as any)?.data ?? (aggResp as any) ?? null
  const backendHotels: any[] = aggData?.hotels || []
  // Use prop hotels if provided, otherwise use backend hotels
  const hotels: any[] = propHotels || backendHotels
  const serverCenter = aggData?.basic_info?.coordinates || null

  const center = useMemo(() => {
    if (serverCenter && typeof serverCenter.lat === 'number' && typeof serverCenter.lng === 'number') {
      return { lat: serverCenter.lat, lng: serverCenter.lng }
    }
    if (Array.isArray(stops) && stops.length > 0) {
      // center on the first stop initially
      return { lat: stops[0].lat, lng: stops[0].lng }
    }
    return defaultCenter
  }, [stops, defaultCenter, serverCenter])

  // Compute directions client-side using the Google DirectionsService when stops change
  useEffect(() => {
    if (!isLoaded) return
    
    // If showRoute is enabled and we have startLocation, geocode and compute route
    if (showRoute && startLocation && location) {
      const google = (window as any).google
      if (!google || !google.maps) {
        setDirectionsError('Google Maps API not available')
        return
      }

      const geocoder = new google.maps.Geocoder()
      const directionsService = new google.maps.DirectionsService()

      // Geocode both start and destination
      Promise.all([
        new Promise<LatLng>((resolve, reject) => {
          geocoder.geocode({ address: startLocation }, (results: any, status: string) => {
            if (status === 'OK' && results[0]) {
              const loc = results[0].geometry.location
              resolve({ lat: loc.lat(), lng: loc.lng() })
            } else {
              reject(new Error('Failed to geocode start location'))
            }
          })
        }),
        new Promise<LatLng>((resolve, reject) => {
          geocoder.geocode({ address: location }, (results: any, status: string) => {
            if (status === 'OK' && results[0]) {
              const loc = results[0].geometry.location
              resolve({ lat: loc.lat(), lng: loc.lng() })
            } else {
              reject(new Error('Failed to geocode destination'))
            }
          })
        })
      ]).then(([startCoords, destCoords]) => {
        setRouteStops([startCoords, destCoords])
        
        // Get directions
        directionsService.route(
          {
            origin: startCoords,
            destination: destCoords,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result: any, status: string) => {
            if (status === 'OK' && result) {
              setDirections(result)
              setDirectionsError(null)
            } else {
              setDirections(null)
              setDirectionsError(`Directions request failed: ${status}`)
            }
          }
        )
      }).catch((error) => {
        setDirectionsError(error.message)
      })
      return
    }
    
    // Original logic for manual stops
    if (!stops || stops.length < 2) {
      setDirections(null)
      setDirectionsError(null)
      return
    }

    const google = (window as any).google
    if (!google || !google.maps) {
      setDirectionsError('Google Maps API not available')
      return
    }

    const directionsService = new google.maps.DirectionsService()

    const origin = stops[0]
    const destination = stops[stops.length - 1]
    const waypoints = stops.slice(1, stops.length - 1).map((s) => ({ location: { lat: s.lat, lng: s.lng }, stopover: true }))

    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
      },
      (result: any, status: string) => {
        if (status === 'OK' && result) {
          setDirections(result)
          setDirectionsError(null)
        } else {
          setDirections(null)
          setDirectionsError(`Directions request failed: ${status}`)
        }
      }
    )
  }, [isLoaded, stops, showRoute, startLocation, location])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Interactive Map</h3>
        <p className="text-sm text-gray-600">Explore {location} and nearby attractions</p>
      </div>

      <div className="w-full" style={{ height }}>
        {!isLoaded ? (
          <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading map...</p>
              {loadError && (
                <p className="text-xs text-red-500 mt-2">Map failed to load. Make sure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full h-full rounded-lg overflow-hidden">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={center}
              zoom={12}
              onLoad={(m: any) => setMap(m)}
              onUnmount={() => setMap(null)}
            >
              {/* Render computed directions (red) */}
              {directions && map && (
                <>
                  <DirectionsRendererWrapper directions={directions} map={map} />
                  {/* Auto-fit map to route bounds with padding for zoom */}
                  {(() => {
                    const bounds = new (window as any).google.maps.LatLngBounds()
                    directions.routes[0].legs.forEach((leg: any) => {
                      bounds.extend(leg.start_location)
                      bounds.extend(leg.end_location)
                    })
                    // Reduced padding to 20px for a more zoomed-in view
                    map.fitBounds(bounds, { top: 20, right: 20, bottom: 20, left: 20 })
                    return null
                  })()}
                </>
              )}

              {/* Render simple markers for stops while we build custom hotel markers */}
              {stops && stops.map((s, i) => (
                <Marker key={`stop-${i}`} position={{ lat: s.lat, lng: s.lng }} />
              ))}

              {/* Hotel markers with circular images using OverlayView */}
              {hotels && hotels.length > 0 && (
                <>
                  {hotels
                    .map((h: any) => {
                      // Normalize coordinates
                      const lat = h.lat ?? h.latitude ?? h.location?.lat ?? h.coordinates?.lat ?? h.location?.latitude
                      const lng = h.lng ?? h.longitude ?? h.location?.lng ?? h.coordinates?.lng ?? h.location?.longitude
                      return { ...h, _lat: lat, _lng: lng }
                    })
                    .filter((h: any) => typeof h._lat === 'number' && typeof h._lng === 'number')
                    .map((h: any) => {
                      const hotelImage = h.image || (h.photos && h.photos[0])
                      
                      return (
                        <OverlayView
                          key={h.id || `${h.name}-${h._lat}-${h._lng}`}
                          position={{ lat: h._lat, lng: h._lng }}
                          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        >
                          <div 
                            className="cursor-pointer transform hover:scale-110 transition-transform"
                            onClick={() => setSelectedHotel(h)}
                            style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '50%',
                              overflow: 'hidden',
                              border: '3px solid white',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                              background: hotelImage ? 'none' : '#e5e7eb'
                            }}
                          >
                            {hotelImage ? (
                              <img 
                                src={hotelImage} 
                                alt={h.name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <span className="text-lg">🏨</span>
                              </div>
                            )}
                          </div>
                        </OverlayView>
                      )
                    })}
                </>
              )}

              {/* Show a richer OverlayView when a hotel is selected */}
              {selectedHotel && (
                <OverlayView
                  position={{ lat: selectedHotel._lat || selectedHotel.lat, lng: selectedHotel._lng || selectedHotel.lng }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <div className="bg-white rounded-lg shadow-lg p-2 w-52">
                    <div className="flex">
                      <img src={selectedHotel.image || (selectedHotel.photos && selectedHotel.photos[0]) || '/placeholder-hotel.jpg'} alt={selectedHotel.name}
                        className="w-20 h-20 object-cover rounded mr-2" />
                      <div>
                        <div className="text-sm font-semibold">{selectedHotel.name || selectedHotel.title || 'Hotel'}</div>
                        <div className="text-xs text-gray-600">{selectedHotel.address || selectedHotel.location?.address || ''}</div>
                        <div className="text-xs text-gray-800 mt-1">Rating: {selectedHotel.rating ?? '—'}</div>
                        <div className="text-xs text-gray-800">{selectedHotel.price_per_night ? `$${selectedHotel.price_per_night}` : selectedHotel.price ? `$${selectedHotel.price}` : ''}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-right">
                      <button className="text-xs text-primary-600" onClick={() => setSelectedHotel(null)}>Close</button>
                    </div>
                  </div>
                </OverlayView>
              )}

              {directionsError && (
                <div className="absolute top-2 left-2 bg-white rounded px-3 py-1 text-xs text-red-600">{directionsError}</div>
              )}
            </GoogleMap>
          </div>
        )}
      </div>
    </motion.div>
  )
}
