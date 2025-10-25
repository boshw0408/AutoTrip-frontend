import { motion } from 'framer-motion'
import { Clock, MapPin, Star, Download, Calendar } from 'lucide-react'

interface ItineraryItem {
  id: string
  time: string
  title: string
  description: string
  location: string
  duration: string
  type: 'hotel' | 'restaurant' | 'attraction' | 'transport'
  rating?: number
}

interface ItineraryDay {
  day: number
  date: string
  items: ItineraryItem[]
}

interface Itinerary {
  id: string
  location: string
  duration: number
  days: ItineraryDay[]
  summary?: string
}

interface ItineraryListProps {
  itinerary: Itinerary
}

export default function ItineraryList({ itinerary }: ItineraryListProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel':
        return '🏨'
      case 'restaurant':
        return '🍽️'
      case 'attraction':
        return '🎯'
      case 'transport':
        return '🚗'
      default:
        return '📍'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hotel':
        return 'bg-blue-100 text-blue-700'
      case 'restaurant':
        return 'bg-green-100 text-green-700'
      case 'attraction':
        return 'bg-purple-100 text-purple-700'
      case 'transport':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Your {itinerary.location} Itinerary
        </h2>
        <p className="text-gray-600 mb-6">
          {itinerary.duration} days of amazing experiences
        </p>
        
        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
          <button className="px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Add to Calendar</span>
          </button>
        </div>
      </div>

      {/* Summary */}
      {itinerary.summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Summary</h3>
          <p className="text-gray-700">{itinerary.summary}</p>
        </motion.div>
      )}

      {/* Days */}
      {itinerary.days.map((day, dayIndex) => (
        <motion.div
          key={day.day}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: dayIndex * 0.1 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {/* Day Header */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6">
            <h3 className="text-xl font-bold">Day {day.day}</h3>
            <p className="text-primary-100">{day.date}</p>
          </div>

          {/* Timeline */}
          <div className="p-6">
            <div className="space-y-6">
              {day.items.map((item, itemIndex) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: itemIndex * 0.1 }}
                  className="flex space-x-4"
                >
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                    </div>
                    {itemIndex < day.items.length - 1 && (
                      <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{item.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{item.location}</span>
                          </div>
                          <span className="text-gray-500">{item.duration}</span>
                        </div>
                      </div>
                      {item.rating && (
                        <div className="flex items-center space-x-1">
                          {renderStars(item.rating)}
                          <span className="text-sm text-gray-600">({item.rating})</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Footer */}
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">
          Generated by Travel AI • Powered by OpenAI
        </p>
        <div className="flex justify-center space-x-6 text-sm text-gray-500">
          <button className="hover:text-primary-600 transition-colors">Edit Itinerary</button>
          <button className="hover:text-primary-600 transition-colors">Share Trip</button>
          <button className="hover:text-primary-600 transition-colors">Save for Later</button>
        </div>
      </div>
    </div>
  )
}
