import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Calendar, DollarSign, TrendingUp, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <>
      <Head>
        <title>AutoTrip - AI-Powered Travel Planner</title>
        <meta name="description" content="Plan your perfect 2 day trip with AI-powered recommendations" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Sparkles className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">AutoTrip</h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-x-4"
            >
            </motion.div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Plan Your Perfect Trip with{' '}
              <span className="text-primary-600">AI</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Spend less time planning, more time exploring. <br />
              AI-powered trip planning builds the perfect itinerary for you.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <Link 
                href="/plan"
                className="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-lg font-semibold"
              >
                Start Planning
                <MapPin className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center p-6 bg-white rounded-lg shadow-lg"
            >
              <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Itinerary</h3>
              <p className="text-gray-600">
                AI generates day-by-day itineraries with optimized routes and realistic timing.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center p-6 bg-white rounded-lg shadow-lg"
            >
              <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Budget Planning</h3>
              <p className="text-gray-600">
                Get recommendations that match your budget and preferences.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center p-6 bg-white rounded-lg shadow-lg"
            >
              <MapPin className="h-12 w-12 text-violet-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Route Optimization</h3>
              <p className="text-gray-600">
                Minimize travel time with intelligent route planning and nearby attraction clustering.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center p-6 bg-white rounded-lg shadow-lg"
            >
              <TrendingUp className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Trending Spots</h3>
              <p className="text-gray-600">
                Discover must-visit restaurants and attractions sourced from real-time Instagram trends.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  )
}

