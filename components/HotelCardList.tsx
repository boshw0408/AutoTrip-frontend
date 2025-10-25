import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, MapPin, DollarSign, Wifi, Car, Coffee } from 'lucide-react'
import { useHotels } from '../hooks/useHotels'

interface HotelCardListProps {
  location: string
}

interface Hotel {
  id: string
  name: string
  rating: number
  price: number
  address: string
  amenities: string[]
  image: string
  distance: string
}

export default function HotelCardList({ location }: HotelCardListProps) {
  const { hotels, isLoading } = useHotels(location)
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
            <div className="flex space-x-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="h-4 w-4" />
      case 'parking':
        return <Car className="h-4 w-4" />
      case 'restaurant':
        return <Coffee className="h-4 w-4" />
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
    }
  }

  return (
    <div className="space-y-4">
      {hotels.map((hotel: Hotel, index: number) => (
        <motion.div
          key={hotel.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transition-all duration-200 ${
            selectedHotel === hotel.id ? 'ring-2 ring-primary-500 shadow-xl' : 'hover:shadow-xl'
          }`}
          onClick={() => setSelectedHotel(hotel.id)}
        >
          <div className="flex space-x-4">
            {/* Hotel Image */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <div className="text-3xl">🏨</div>
            </div>

            {/* Hotel Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{hotel.name}</h3>
                <div className="flex items-center space-x-1">
                  {renderStars(hotel.rating)}
                  <span className="text-sm text-gray-600 ml-1">({hotel.rating})</span>
                </div>
              </div>

              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{hotel.address}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-green-600">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="font-semibold">${hotel.price}</span>
                    <span className="text-sm text-gray-600 ml-1">/night</span>
                  </div>
                  <span className="text-sm text-gray-500">{hotel.distance} from center</span>
                </div>

                <div className="flex items-center space-x-2">
                  {hotel.amenities.slice(0, 3).map((amenity, i) => (
                    <div key={i} className="flex items-center text-gray-500">
                      {getAmenityIcon(amenity)}
                    </div>
                  ))}
                  {hotel.amenities.length > 3 && (
                    <span className="text-xs text-gray-500">+{hotel.amenities.length - 3} more</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Selected State */}
          {selectedHotel === hotel.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Selected hotel for your trip</p>
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.map((amenity, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                  Book Now
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
