import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Calendar, DollarSign, MapPin, Users, ArrowRight } from 'lucide-react'
import TripForm from '../components/TripForm'
import MapView from '../components/MapView'
import HotelCardList from '../components/HotelCardList'
import ItineraryList from '../components/ItineraryList'
import { useGenerateItinerary } from '../hooks/useGenerateItinerary'

export default function PlanTrip() {
  const router = useRouter()
  const [tripData, setTripData] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  const { generateItinerary, isLoading, itinerary } = useGenerateItinerary()

  const handleTripSubmit = async (data: any) => {
    setTripData(data)
    setCurrentStep(2)
    await generateItinerary(data)
  }

  const steps = [
    { id: 1, title: 'Trip Details', icon: Calendar },
    { id: 2, title: 'Recommendations', icon: MapPin },
    { id: 3, title: 'Itinerary', icon: ArrowRight },
  ]

  return (
    <>
      <Head>
        <title>Plan Your Trip - Travel AI</title>
        <meta name="description" content="Plan your perfect trip with AI recommendations" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Plan Your Trip</h1>
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                Back to Home
              </button>
            </div>
          </div>
        </header>

        {/* Progress Steps */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep >= step.id
              const isCompleted = currentStep > step.id
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center space-x-2 ${
                    isActive ? 'text-primary-600' : 'text-gray-400'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    isCompleted ? 'bg-green-100 text-green-600' :
                    isActive ? 'bg-primary-100 text-primary-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium">{step.title}</span>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 pb-20">
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <TripForm onSubmit={handleTripSubmit} />
            </motion.div>
          )}

          {currentStep === 2 && tripData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Recommended Hotels</h2>
                  <HotelCardList location={tripData.location} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-6">Map View</h2>
                  <MapView location={tripData.location} />
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Generate Itinerary
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && itinerary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ItineraryList itinerary={itinerary} />
            </motion.div>
          )}
        </div>
      </main>
    </>
  )
}
