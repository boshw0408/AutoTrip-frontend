import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface MapViewProps {
  location: string
  height?: string
}

export default function MapView({ location, height = '400px' }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    const loadMap = async () => {
      if (!mapRef.current) return

      try {
        // Mock map implementation - replace with actual Google Maps API
        const mapElement = mapRef.current
        mapElement.innerHTML = `
          <div class="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
            <div class="text-center">
              <div class="text-6xl mb-4">🗺️</div>
              <h3 class="text-xl font-semibold text-gray-700 mb-2">Map View</h3>
              <p class="text-gray-600">Location: ${location}</p>
              <p class="text-sm text-gray-500 mt-2">Google Maps integration coming soon</p>
            </div>
          </div>
        `
        setMapLoaded(true)
      } catch (error) {
        console.error('Error loading map:', error)
      }
    }

    loadMap()
  }, [location])

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
      
      <div 
        ref={mapRef}
        className="w-full"
        style={{ height }}
      >
        {!mapLoaded && (
          <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
