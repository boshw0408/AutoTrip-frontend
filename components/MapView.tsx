import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface MapViewProps {
  location: string
  height?: string
}

export default function MapView({ location, height = '400px' }: MapViewProps) {
  const [mapLoaded, setMapLoaded] = useState(false)

  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => setMapLoaded(true), 500)
    return () => clearTimeout(timer)
  }, [])

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
        className="w-full"
        style={{ height }}
      >
        {!mapLoaded ? (
          <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Map View</h3>
              <p className="text-gray-600">Location: {location}</p>
              <p className="text-sm text-gray-500 mt-2">Google Maps integration coming soon</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
