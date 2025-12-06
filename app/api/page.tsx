'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { CheckCircle, ArrowRight, Clock, DollarSign, MapPin, Code, Globe, Shield, Zap, Users, BarChart3, FileText, Truck, Package, Star, ChevronRight, Phone, Mail, MessageSquare, Database, Box, Cpu, Key, Terminal } from 'lucide-react'
import { useState } from 'react'
import Navigation from '@/components/Navigation'

function EndpointModal({ open, onClose, endpoint }: { open: boolean, onClose: () => void, endpoint: any }) {
  if (!open || !endpoint) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        <h2 className="text-2xl font-bold mb-4">{endpoint.name} <span className="ml-2 text-sm font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded">{endpoint.method}</span></h2>
        <div className="mb-4">
          <div className="bg-gray-100 rounded-lg p-3 mb-2">
            <code className="text-sm text-gray-800">{endpoint.path}</code>
          </div>
          <p className="text-gray-700 mb-2">{endpoint.description}</p>
        </div>
        <h3 className="font-semibold mb-2">Features</h3>
        <ul className="space-y-2 mb-4">
          {endpoint.features.map((feature: string, i: number) => (
            <li key={i} className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
        <h3 className="font-semibold mb-2">Example Request</h3>
        <div className="bg-gray-900 rounded-lg p-4 mb-4">
          <pre className="text-green-400 text-sm overflow-x-auto">
            <code>{endpoint.exampleRequest || 'curl ...'}</code>
          </pre>
        </div>
        <h3 className="font-semibold mb-2">Example Response</h3>
        <div className="bg-gray-900 rounded-lg p-4">
          <pre className="text-blue-400 text-sm overflow-x-auto">
            <code>{endpoint.exampleResponse || '{ "success": true }'}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

export default function ApiPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('shipments')
  const [apiKey, setApiKey] = useState('flip_sk_test_1234567890abcdef')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalEndpoint, setModalEndpoint] = useState<any>(null)

  const endpoints = [
    {
      id: 'shipments',
      name: 'Shipments API',
      description: 'Create, track, and manage shipments',
      method: 'GET',
      path: '/api/v1/shipments',
      features: ['Create shipments', 'Track status', 'Update details', 'Delete shipments'],
      exampleRequest: `curl -X GET "https://api.fliproutes.com/v1/shipments" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"`,
      exampleResponse: `{
  "data": [
    {
      "id": "FLIP123456789",
      "status": "in_transit",
      "origin": "Shanghai, China",
      "destination": "Los Angeles, USA",
      "carrier": "Maersk",
      "eta": "2024-12-15T10:00:00Z",
      "current_location": "Pacific Ocean",
      "progress": 65
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "per_page": 20
  }
}`
    },
    {
      id: 'tracking',
      name: 'Tracking API',
      description: 'Real-time shipment tracking and updates',
      method: 'GET',
      path: '/api/v1/tracking/{id}',
      features: ['Real-time updates', 'GPS tracking', 'Milestone events', 'ETA predictions'],
      exampleRequest: `curl -X GET "https://api.fliproutes.com/v1/tracking/{id}" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"`,
      exampleResponse: `{
  "data": {
    "id": "FLIP123456789",
    "status": "in_transit",
    "location": "Los Angeles, USA",
    "last_update": "2024-12-10T10:00:00Z",
    "eta": "2024-12-15T10:00:00Z",
    "current_location": "Los Angeles, USA",
    "progress": 75
  },
  "meta": {
    "success": true
  }
}`
    },
    {
      id: 'rates',
      name: 'Rates API',
      description: 'Get shipping rates and quotes',
      method: 'POST',
      path: '/api/v1/rates',
      features: ['Instant quotes', 'Multiple carriers', 'Service options', 'Cost breakdown'],
      exampleRequest: `curl -X POST "https://api.fliproutes.com/v1/rates" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"origin": "New York, USA", "destination": "Los Angeles, USA", "weight": 10, "dimensions": {"length": 10, "width": 5, "height": 5}}'`,
      exampleResponse: `{
  "data": {
    "id": "FLIP123456789",
    "carrier": "UPS",
    "service": "Ground",
    "rate": 150.00,
    "currency": "USD",
    "eta": "2024-12-15T10:00:00Z",
    "guaranteed": true
  },
  "meta": {
    "success": true
  }
}`
    }
  ]

  const codeExample = `curl -X GET "https://api.fliproutes.com/v1/shipments" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"`

  const responseExample = `{
  "data": [
    {
      "id": "FLIP123456789",
      "status": "in_transit",
      "origin": "Shanghai, China",
      "destination": "Los Angeles, USA",
      "carrier": "Maersk",
      "eta": "2024-12-15T10:00:00Z",
      "current_location": "Pacific Ocean",
      "progress": 65
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "per_page": 20
  }
}`

  return (
    <div className="bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Code className="w-4 h-4 mr-2" />
              Developer-Friendly API
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              API & Integrations
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Integrate FlipRoutes into your applications with our comprehensive REST API. 
              Build custom solutions, automate workflows, and connect your systems seamlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#docs">
                <Button size="lg" className="flex items-center text-lg px-8 py-4">
                  View Documentation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="flex items-center text-lg px-8 py-4">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* API Stats */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">&lt;100ms</div>
              <div className="text-gray-600">Response time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Endpoints</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section id="docs" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">API Endpoints</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Explore our comprehensive API endpoints for all logistics operations
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {endpoints.map((endpoint) => (
              <div
                key={endpoint.id}
                className={`bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border-2 ${
                  selectedEndpoint === endpoint.id ? 'border-blue-500' : 'border-gray-200'
                }`}
                onClick={() => setSelectedEndpoint(endpoint.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Code className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                    endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {endpoint.method}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{endpoint.name}</h3>
                <p className="text-gray-600 mb-4">{endpoint.description}</p>
                <div className="bg-gray-100 rounded-lg p-3 mb-4">
                  <code className="text-sm text-gray-800">{endpoint.path}</code>
                </div>
                <ul className="space-y-2 mb-6">
                  {endpoint.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => { setModalEndpoint(endpoint); setModalOpen(true); }}
                  className={`w-full ${
                    selectedEndpoint === endpoint.id
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  View Documentation
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Quick Start</h2>
              <p className="text-xl text-gray-700">
                Get started with our API in minutes
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">API Key</h3>
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <code className="text-sm text-gray-800">{apiKey}</code>
                    <Button size="sm" variant="outline">Copy</Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Include this key in the Authorization header for all API requests
                </p>
                
                <h3 className="text-xl font-semibold mb-4">Example Request</h3>
                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-green-400 text-sm overflow-x-auto">
                    <code>{codeExample}</code>
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Example Response</h3>
                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-blue-400 text-sm overflow-x-auto">
                    <code>{responseExample}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">API Features</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Powerful features to help you build robust integrations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Authentication</h3>
              <p className="text-gray-600">Secure API key authentication</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Webhooks</h3>
              <p className="text-gray-600">Real-time event notifications</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Terminal className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">SDKs</h3>
              <p className="text-gray-600">Client libraries for popular languages</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Rate Limiting</h3>
              <p className="text-gray-600">Flexible rate limits and quotas</p>
            </div>
          </div>
        </div>
      </section>

      {/* SDKs */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Client Libraries</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Get started quickly with our official SDKs and client libraries
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Code className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">JavaScript/Node.js</h3>
              <p className="text-gray-600 mb-6">Official SDK for JavaScript and Node.js applications</p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">TypeScript support</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Promise-based API</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Error handling</span>
                </div>
              </div>
              <Button className="w-full">Install SDK</Button>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm border">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Code className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Python</h3>
              <p className="text-gray-600 mb-6">Python SDK for backend and data science applications</p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Async support</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Pandas integration</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Jupyter notebooks</span>
                </div>
              </div>
              <Button className="w-full">Install SDK</Button>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm border">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Code className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">PHP</h3>
              <p className="text-gray-600 mb-6">PHP SDK for web applications and CMS integration</p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Composer package</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Laravel integration</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">WordPress plugin</span>
                </div>
              </div>
              <Button className="w-full">Install SDK</Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Integrate?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get started with our API and build powerful logistics integrations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                Get API Access
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <EndpointModal open={modalOpen} onClose={() => setModalOpen(false)} endpoint={modalEndpoint} />
    </div>
  )
} 