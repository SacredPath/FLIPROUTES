'use client'

import { useMemo } from 'react'
import { 
  Package, 
  MapPin, 
  Ship, 
  Truck, 
  Warehouse,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Navigation
} from 'lucide-react'
import type { TrackingEvent } from '@/lib/supabase'

interface MultiStepTrackingProps {
  origin: string
  destination: string
  events: TrackingEvent[]
  currentStatus: string
  progress?: number
}

interface JourneyStep {
  id: string
  type: 'origin' | 'intermediate' | 'destination'
  location: string
  status: 'completed' | 'current' | 'upcoming'
  event?: TrackingEvent
  milestone: string
  icon: React.ReactNode
  description?: string
  timestamp?: string
}

export function MultiStepTracking({ 
  origin, 
  destination, 
  events, 
  currentStatus,
  progress = 0 
}: MultiStepTrackingProps) {
  
  // Build journey steps from events and shipment data
  const journeySteps = useMemo<JourneyStep[]>(() => {
    const steps: JourneyStep[] = []
    
    // Origin step
    steps.push({
      id: 'origin',
      type: 'origin',
      location: origin,
      status: 'completed',
      milestone: 'Origin',
      icon: <MapPin className="w-5 h-5" />,
      description: 'Shipment origin point',
      timestamp: events.find(e => e.event_type === 'pickup')?.timestamp
    })

    // Process events to create intermediate steps
    const sortedEvents = [...events].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )

    sortedEvents.forEach((event, index) => {
      if (event.event_type === 'pickup') {
        // Already handled in origin
        return
      }

      if (event.event_type === 'delivered') {
        // Will be handled in destination
        return
      }

      // Create intermediate step
      const isCurrent = index === sortedEvents.length - 1 && currentStatus !== 'delivered'
      const isCompleted = currentStatus === 'delivered' || index < sortedEvents.length - 1

      let icon: React.ReactNode
      let milestone: string

      switch (event.event_type) {
        case 'in_transit':
          if (event.location.toLowerCase().includes('port') || event.location.toLowerCase().includes('harbor')) {
            icon = <Ship className="w-5 h-5" />
            milestone = 'At Port'
          } else if (event.location.toLowerCase().includes('ocean') || event.location.toLowerCase().includes('sea')) {
            icon = <Ship className="w-5 h-5" />
            milestone = 'Ocean Transit'
          } else {
            icon = <Truck className="w-5 h-5" />
            milestone = 'In Transit'
          }
          break
        case 'at_port':
          icon = <Warehouse className="w-5 h-5" />
          milestone = 'At Port'
          break
        case 'out_for_delivery':
          icon = <Truck className="w-5 h-5" />
          milestone = 'Out for Delivery'
          break
        default:
          icon = <Navigation className="w-5 h-5" />
          milestone = 'In Transit'
      }

      steps.push({
        id: `step-${index}`,
        type: 'intermediate',
        location: event.location,
        status: isCurrent ? 'current' : isCompleted ? 'completed' : 'upcoming',
        event,
        milestone,
        icon,
        description: event.description,
        timestamp: event.timestamp
      })
    })

    // Destination step
    const deliveredEvent = events.find(e => e.event_type === 'delivered')
    steps.push({
      id: 'destination',
      type: 'destination',
      location: destination,
      status: currentStatus === 'delivered' ? 'completed' : 'upcoming',
      milestone: currentStatus === 'delivered' ? 'Delivered' : 'Destination',
      icon: currentStatus === 'delivered' ? 
        <CheckCircle className="w-5 h-5" /> : 
        <MapPin className="w-5 h-5" />,
      description: deliveredEvent?.description || 'Final destination',
      timestamp: deliveredEvent?.timestamp
    })

    return steps
  }, [origin, destination, events, currentStatus])

  const getStepColor = (status: string, type: string) => {
    if (status === 'completed') {
      return type === 'destination' ? 'bg-green-100 border-green-300 text-green-700' : 'bg-blue-100 border-blue-300 text-blue-700'
    }
    if (status === 'current') {
      return 'bg-yellow-100 border-yellow-300 text-yellow-700 ring-2 ring-yellow-400'
    }
    return 'bg-gray-100 border-gray-300 text-gray-500'
  }

  const getConnectorColor = (currentStatus: string, nextStatus: string) => {
    if (currentStatus === 'completed') {
      return 'bg-blue-500'
    }
    if (currentStatus === 'current') {
      return 'bg-gradient-to-b from-blue-500 to-gray-300'
    }
    return 'bg-gray-300'
  }

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return null
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Journey Progress</span>
          <span className="text-sm font-bold text-blue-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Journey Steps */}
      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5">
          {journeySteps.map((step, index) => {
            if (index === journeySteps.length - 1) return null
            const nextStep = journeySteps[index + 1]
            return (
              <div
                key={`connector-${index}`}
                className={`h-24 ${getConnectorColor(step.status, nextStep.status)} transition-all duration-300`}
              />
            )
          })}
        </div>

        <div className="space-y-6">
          {journeySteps.map((step, index) => (
            <div key={step.id} className="relative flex items-start space-x-4">
              {/* Step Icon */}
              <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${getStepColor(step.status, step.type)} transition-all duration-300`}>
                {step.status === 'completed' ? (
                  <CheckCircle className="w-6 h-6" />
                ) : step.status === 'current' ? (
                  <div className="relative">
                    {step.icon}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  </div>
                ) : (
                  step.icon
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0 pb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-base font-semibold text-gray-900">{step.milestone}</h4>
                        {step.status === 'current' && (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full animate-pulse">
                            Current Location
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="font-medium">{step.location}</span>
                      </div>
                      {step.description && (
                        <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                      )}
                      {step.timestamp && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimestamp(step.timestamp)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Route Summary */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="text-center">
              <MapPin className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-gray-700">{origin}</p>
              <p className="text-xs text-gray-500">Origin</p>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="text-center flex-1">
              <div className="flex items-center justify-center space-x-1 mb-1">
                {journeySteps.filter(s => s.status === 'completed').length > 0 && (
                  <>
                    {Array.from({ length: Math.min(journeySteps.filter(s => s.status === 'completed').length, 3) }).map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    ))}
                  </>
                )}
                {journeySteps.find(s => s.status === 'current') && (
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <p className="text-xs font-medium text-gray-700">
                {journeySteps.filter(s => s.status === 'completed').length} of {journeySteps.length} steps completed
              </p>
              <p className="text-xs text-gray-500">Journey Progress</p>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="text-center">
              <MapPin className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-gray-700">{destination}</p>
              <p className="text-xs text-gray-500">Destination</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

