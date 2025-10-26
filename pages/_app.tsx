import { NextPage } from 'next'
import { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import '../styles/globals.css'

const MyApp: NextPage<AppProps> = ({ Component, pageProps }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  }))

  // Suppress React Strict Mode DOM error warnings in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const originalError = console.error
      console.error = (...args) => {
        if (
          typeof args[0] === 'string' &&
          args[0].includes('Failed to execute \'removeChild\' on \'Node\'')
        ) {
          return
        }
        originalError(...args)
      }
      return () => {
        console.error = originalError
      }
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}

export default MyApp

