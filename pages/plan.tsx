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

interface TripData {
  startingLocation: string
  location: string
  startDate: string
  endDate: string
  budget: number
  travelers: number
  interests: string[]
  specifications?: string
}

export default function PlanTrip() {
  const router = useRouter()
  const [tripData, setTripData] = useState<TripData | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedHotel, setSelectedHotel] = useState<any>(null)
  const { mutate: generateItinerary, isPending, data: itinerary } = useGenerateItinerary()

  const handleTripSubmit = async (data: any) => {
    setTripData(data)
    setCurrentStep(2)
  }

  const handleGenerateItinerary = () => {
    console.log("Generate button clicked!");
    console.log("tripData:", tripData);
    console.log("selectedHotel:", selectedHotel);
    if (tripData) {
      setCurrentStep(3)
      // Add selected hotel to trip data
      const tripDataWithHotel = { ...tripData, selectedHotel }
      console.log("Calling generateItinerary with:", tripDataWithHotel);
      generateItinerary(tripDataWithHotel)
    } else {
      console.error("No tripData available!");
    }
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
                  <HotelCardList 
                    tripData={{
                      destination: tripData.location,
                      check_in: tripData.startDate,
                      check_out: tripData.endDate,
                      travelers: tripData.travelers,
                      budget: tripData.budget,
                      interests: tripData.interests,
                      starting_location: tripData.startingLocation
                    }}
                    onHotelSelect={setSelectedHotel}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-6">Map View</h2>
                  <MapView location={tripData.location} />
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={handleGenerateItinerary}
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Generate Itinerary
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {isPending ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
                  <p className="mt-4 text-gray-600">Generating your AI-powered itinerary...</p>
                  <p className="mt-2 text-sm text-gray-500">This may take 30-60 seconds</p>
                </div>
              ) : itinerary ? (
                <ItineraryList itinerary={itinerary} />
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-600">No itinerary generated yet</p>
                  <button
                    onClick={() => {
                      if (tripData) {
                        const tripDataWithHotel = { ...tripData, selectedHotel }
                        generateItinerary(tripDataWithHotel)
                      }
                    }}
                    className="mt-4 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Generate Itinerary
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </>
  )
}
