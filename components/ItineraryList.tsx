import React from 'react'
import { motion } from 'framer-motion'
import { Clock, MapPin, Star, Download, Calendar, DollarSign, Bed, UtensilsCrossed, Camera, Plane, TrendingUp } from 'lucide-react'

interface ItineraryItem {
  id: string
  time: string
  title: string
  description: string
  location: string
  duration: string
  type: 'hotel' | 'restaurant' | 'attraction' | 'transport' | 'meal'
  rating?: number
  cost?: number
}

interface ItineraryDay {
  day: number
  date: string
  items: ItineraryItem[]
}

interface Itinerary {
  id: string
  location: string
  origin?: string
  duration: number
  days: ItineraryDay[]
  summary?: string
  total_estimated_cost?: number
  data_sources?: string
}

interface ItineraryListProps {
  itinerary: Itinerary
}

export default function ItineraryList({ itinerary }: ItineraryListProps) {
  const handleDownloadPDF = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/itinerary/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itinerary),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `itinerary_${itinerary.location.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  const handleAddToCalendar = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/itinerary/export-calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itinerary),
      });

      if (!response.ok) {
        throw new Error('Failed to generate calendar file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `itinerary_${itinerary.location.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.ics`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert('📅 Calendar file downloaded!\n\nTo add to Google Calendar:\n1. Go to Google Calendar\n2. Click Settings > Import & Export\n3. Upload this file');
    } catch (error) {
      console.error('Error downloading calendar:', error);
      alert('Failed to download calendar file. Please try again.');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel':
        return '🏨'
      case 'restaurant':
      case 'meal':
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
      case 'meal':
        return 'bg-green-100 text-green-700'
      case 'attraction':
        return 'bg-purple-100 text-purple-700'
      case 'transport':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case 'hotel':
        return 'Hotel'
      case 'restaurant':
      case 'meal':
        return 'Restaurant'
      case 'attraction':
        return 'Attraction'
      case 'transport':
        return 'Transport'
      default:
        return 'Activity'
    }
  }

  // Calculate budget breakdown from itinerary items
  const calculateBudgetBreakdown = () => {
    let hotel = 0
    let meals = 0
    let attractions = 0
    let transport = 0

    itinerary.days.forEach(day => {
      day.items.forEach(item => {
        const cost = item.cost || 0
        switch (item.type) {
          case 'hotel':
            hotel += cost
            break
          case 'restaurant':
          case 'meal':
            meals += cost
            break
          case 'attraction':
            attractions += cost
            break
          case 'transport':
            transport += cost
            break
        }
      })
    })

    return { hotel, meals, attractions, transport, total: hotel + meals + attractions + transport }
  }

  const budgetBreakdown = calculateBudgetBreakdown()

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
          {itinerary.origin ? `Trip from ${itinerary.origin} to ${itinerary.location}` : `Your ${itinerary.location} Itinerary`}
        </h2>
        <p className="text-gray-600 mb-6">
          {itinerary.duration} days of amazing experiences {itinerary.origin && 'along the way'}
        </p>
        
        {/* Total Cost Badge */}
        {(itinerary.total_estimated_cost || budgetBreakdown.total > 0) && (
          <div className="mb-6 inline-flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-3 rounded-full border border-green-200">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="text-gray-700 font-medium">Total Estimated Cost:</span>
            <span className="text-2xl font-bold text-green-600">
              ${Math.ceil(itinerary.total_estimated_cost || budgetBreakdown.total)}
            </span>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button 
            onClick={handleDownloadPDF}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
          <button 
            onClick={handleAddToCalendar}
            className="px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors flex items-center space-x-2"
          >
            <Calendar className="h-4 w-4" />
            <span>Add to Calendar</span>
          </button>
        </div>
      </div>

      {/* Budget Breakdown */}
      {budgetBreakdown.total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span>Budget Breakdown</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {budgetBreakdown.hotel > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <Bed className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Hotel</span>
                </div>
                <p className="text-xl font-bold text-blue-600">${budgetBreakdown.hotel}</p>
              </div>
            )}
            {budgetBreakdown.meals > 0 && (
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <UtensilsCrossed className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Meals</span>
                </div>
                <p className="text-xl font-bold text-green-600">${budgetBreakdown.meals}</p>
              </div>
            )}
            {budgetBreakdown.attractions > 0 && (
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <Camera className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Attractions</span>
                </div>
                <p className="text-xl font-bold text-purple-600">${budgetBreakdown.attractions}</p>
              </div>
            )}
            {budgetBreakdown.transport > 0 && (
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <Plane className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-700">Transport</span>
                </div>
                <p className="text-xl font-bold text-orange-600">${budgetBreakdown.transport}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

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
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(item.type)}`}>
                            {getTypeName(item.type)}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{item.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate max-w-xs">{item.location}</span>
                          </div>
                          <span className="text-gray-500">{item.duration}</span>
                          {item.cost !== undefined && item.cost > 0 && (
                            <div className="flex items-center space-x-1 text-green-600 font-medium">
                              <DollarSign className="h-4 w-4" />
                              <span>${item.cost}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {item.rating && (
                        <div className="flex items-center space-x-1 ml-4">
                          {renderStars(item.rating)}
                          <span className="text-sm text-gray-600">({item.rating})</span>
                        </div>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-gray-700 mt-2">{item.description}</p>
                    )}
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
