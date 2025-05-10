'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Users, Link } from 'lucide-react'

interface OverviewStatsProps {
  totalRegistrations: number
  recentRegistrations: number
  inovactLinks: number
}

export default function OverviewStats({ 
  totalRegistrations, 
  recentRegistrations, 
  inovactLinks 
}: OverviewStatsProps) {
  const [liveViews, setLiveViews] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  // Function to fetch live views data
  const fetchLiveViews = async () => {
    try {
      const response = await fetch('/api/analytics/views?admin=true&type=live', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch live views')
      }

      const data = await response.json()
      setLiveViews(data.data.total || 0)
    } catch (err) {
      console.error('Error fetching live views:', err)
      setLiveViews(0)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch live views on component mount and then every 10 seconds
  useEffect(() => {
    fetchLiveViews()
    
    // Set up interval to refresh data
    const intervalId = setInterval(fetchLiveViews, 10000)
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  // Function to get a color based on view count
  const getColorClass = (count: number) => {
    if (count === 0) return 'text-gray-400'
    if (count < 5) return 'text-blue-400'
    if (count < 10) return 'text-green-400'
    if (count < 20) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-black/30 border-gray-800">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Registrations</p>
              <p className="text-2xl font-bold text-white">{totalRegistrations}</p>
            </div>
            <div className="p-2 bg-purple-500/10 rounded-full">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-black/30 border-gray-800">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Recent Registrations</p>
              <p className="text-2xl font-bold text-white">{recentRegistrations}</p>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-full">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-black/30 border-gray-800">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Inovact Links</p>
              <p className="text-2xl font-bold text-white">{inovactLinks}</p>
            </div>
            <div className="p-2 bg-green-500/10 rounded-full">
              <Link className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-black/30 border-gray-800">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Live Visitors</p>
              {isLoading ? (
                <div className="h-8 w-16 bg-gray-800 animate-pulse rounded"></div>
              ) : (
                <p className={`text-2xl font-bold ${getColorClass(liveViews)}`}>{liveViews}</p>
              )}
            </div>
            <div className={`p-2 ${liveViews > 0 ? 'bg-red-500/10' : 'bg-gray-500/10'} rounded-full`}>
              <Eye className={`h-6 w-6 ${getColorClass(liveViews)}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
