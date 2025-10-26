import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Calendar, DollarSign, MapPin, Users, Plane } from 'lucide-react'

interface TripFormData {
  startingLocation: string
  location: string
  startDate: string
  endDate: string
  budget: number
  travelers: number
  interests: string[]
}

interface TripFormProps {
  onSubmit: (data: TripFormData) => void
}

const interests = [
  'Culture & History',
  'Food & Dining',
  'Nature & Outdoor',
  'Nightlife',
  'Shopping',
  'Adventure',
  'Relaxation',
  'Art & Museums'
]

export default function TripForm({ onSubmit }: TripFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<TripFormData>()
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const onFormSubmit = (data: TripFormData) => {
    onSubmit({
      ...data,
      interests: selectedInterests
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Plan Your Trip</h2>
        <p className="text-gray-600">Tell us about your travel preferences</p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Starting Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            Starting Location
          </label>
          <input
            {...register('startingLocation', { required: 'Starting location is required' })}
            type="text"
            placeholder="e.g., San Francisco, CA"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {errors.startingLocation && (
            <p className="mt-1 text-sm text-red-600">{errors.startingLocation.message}</p>
          )}
        </div>

        {/* Destination */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            Destination
          </label>
          <input
            {...register('location', { required: 'Destination is required' })}
            type="text"
            placeholder="e.g., Paris, France"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        {/* Dates */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Start Date
            </label>
            <input
              {...register('startDate', { required: 'Start date is required' })}
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              End Date
            </label>
            <input
              {...register('endDate', { required: 'End date is required' })}
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        {/* Budget and Travelers */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline h-4 w-4 mr-1" />
              Budget (USD)
            </label>
            <input
              {...register('budget', { 
                required: 'Budget is required',
                min: { value: 100, message: 'Minimum budget is $100' }
              })}
              type="number"
              placeholder="2000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.budget && (
              <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="inline h-4 w-4 mr-1" />
              Number of Travelers
            </label>
            <input
              {...register('travelers', { 
                required: 'Number of travelers is required',
                min: { value: 1, message: 'At least 1 traveler required' }
              })}
              type="number"
              min="1"
              placeholder="2"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.travelers && (
              <p className="mt-1 text-sm text-red-600">{errors.travelers.message}</p>
            )}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Interests (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {interests.map((interest) => (
              <motion.button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  selectedInterests.includes(interest)
                    ? 'bg-primary-100 border-primary-500 text-primary-700'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {interest}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="w-full py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-lg flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plane className="h-5 w-5" />
          <span>Generate Recommendations</span>
        </motion.button>
      </form>
    </motion.div>
  )
}
