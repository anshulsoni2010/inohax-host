'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'react-toastify'

export default function RegistrationStats() {
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
      renderCharts()
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Function to render charts using canvas
  const renderCharts = () => {
    // Sample data for demonstration
    const dailyRegistrations = {
      labels: ['May 1', 'May 2', 'May 3', 'May 4', 'May 5', 'May 6', 'May 7'],
      data: [3, 5, 8, 12, 7, 10, 15]
    }
    
    const teamSizeDistribution = {
      labels: ['1 Member', '2 Members', '3 Members', '4 Members', '5 Members'],
      data: [5, 12, 25, 18, 10]
    }
    
    // Render daily registrations chart
    renderBarChart('daily-registrations-chart', dailyRegistrations.labels, dailyRegistrations.data, 'Daily Registrations')
    
    // Render team size distribution chart
    renderPieChart('team-size-chart', teamSizeDistribution.labels, teamSizeDistribution.data)
    
    // Update stats in overview tab
    document.getElementById('total-registrations')!.textContent = '70'
    document.getElementById('recent-registrations')!.textContent = '15'
    document.getElementById('inovact-links')!.textContent = '42'
    
    // Update recent registrations table
    updateRecentRegistrationsTable()
  }
  
  // Function to render a bar chart
  const renderBarChart = (canvasId: string, labels: string[], data: number[], title: string) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    
    // Chart configuration
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2
    const maxValue = Math.max(...data) * 1.2
    const barWidth = chartWidth / data.length * 0.6
    const barSpacing = chartWidth / data.length * 0.4
    
    // Draw title
    ctx.fillStyle = '#e5e5e5'
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(title, canvas.width / 2, 20)
    
    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = '#4b5563'
    ctx.lineWidth = 1
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.stroke()
    
    // Draw bars
    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight
      const x = padding + index * (barWidth + barSpacing) + barSpacing / 2
      const y = canvas.height - padding - barHeight
      
      // Draw bar
      const gradient = ctx.createLinearGradient(x, y, x, canvas.height - padding)
      gradient.addColorStop(0, '#8b5cf6')
      gradient.addColorStop(1, '#4c1d95')
      
      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth, barHeight)
      
      // Draw label
      ctx.fillStyle = '#9ca3af'
      ctx.font = '10px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(labels[index], x + barWidth / 2, canvas.height - padding + 15)
      
      // Draw value
      ctx.fillStyle = '#e5e5e5'
      ctx.font = '12px Arial'
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5)
    })
  }
  
  // Function to render a pie chart
  const renderPieChart = (canvasId: string, labels: string[], data: number[]) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    
    // Chart configuration
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 40
    const total = data.reduce((sum, value) => sum + value, 0)
    
    // Colors for pie slices
    const colors = [
      '#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b',
      '#6366f1', '#ef4444', '#14b8a6', '#f97316', '#8b5cf6'
    ]
    
    // Draw pie chart
    let startAngle = 0
    data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI
      const endAngle = startAngle + sliceAngle
      
      // Draw slice
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()
      
      ctx.fillStyle = colors[index % colors.length]
      ctx.fill()
      
      // Draw label line and text
      const midAngle = startAngle + sliceAngle / 2
      const labelRadius = radius * 1.2
      const labelX = centerX + Math.cos(midAngle) * labelRadius
      const labelY = centerY + Math.sin(midAngle) * labelRadius
      
      // Draw line
      ctx.beginPath()
      ctx.moveTo(centerX + Math.cos(midAngle) * radius, centerY + Math.sin(midAngle) * radius)
      ctx.lineTo(labelX, labelY)
      ctx.strokeStyle = colors[index % colors.length]
      ctx.lineWidth = 1
      ctx.stroke()
      
      // Draw label
      ctx.fillStyle = '#e5e5e5'
      ctx.font = '12px Arial'
      ctx.textAlign = midAngle < Math.PI ? 'left' : 'right'
      ctx.textBaseline = 'middle'
      ctx.fillText(`${labels[index]} (${value})`, labelX, labelY)
      
      startAngle = endAngle
    })
    
    // Draw center circle (donut style)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI)
    ctx.fillStyle = '#111827'
    ctx.fill()
    
    // Draw total in center
    ctx.fillStyle = '#e5e5e5'
    ctx.font = 'bold 16px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(total.toString(), centerX, centerY - 10)
    ctx.font = '12px Arial'
    ctx.fillText('Total', centerX, centerY + 10)
  }
  
  // Update recent registrations table in overview tab
  const updateRecentRegistrationsTable = () => {
    const tableElement = document.getElementById('recent-registrations-table')
    if (!tableElement) return
    
    // Sample data
    const recentRegistrations = [
      { teamName: 'Innovators', leader: 'John Doe', email: 'john@example.com', date: '2023-05-07' },
      { teamName: 'Tech Wizards', leader: 'Jane Smith', email: 'jane@example.com', date: '2023-05-06' },
      { teamName: 'Code Masters', leader: 'Bob Johnson', email: 'bob@example.com', date: '2023-05-06' },
      { teamName: 'Data Miners', leader: 'Alice Brown', email: 'alice@example.com', date: '2023-05-05' },
      { teamName: 'AI Explorers', leader: 'Charlie Green', email: 'charlie@example.com', date: '2023-05-05' }
    ]
    
    // Generate table HTML
    let tableHTML = ''
    recentRegistrations.forEach(reg => {
      tableHTML += `
        <tr class="border-b border-gray-700 hover:bg-gray-900/30">
          <td class="px-6 py-4">${reg.teamName}</td>
          <td class="px-6 py-4">${reg.leader}</td>
          <td class="px-6 py-4">${reg.email}</td>
          <td class="px-6 py-4">${new Date(reg.date).toLocaleDateString()}</td>
        </tr>
      `
    })
    
    tableElement.innerHTML = tableHTML
  }

  if (isLoading) {
    return (
      <Card className="bg-black/30 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-medium text-gray-300">Registration Statistics</CardTitle>
          <CardDescription>Loading statistics...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <div className="loader"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/30 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-medium text-gray-300">Registration Trends</CardTitle>
          <CardDescription>Daily registration activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <canvas id="daily-registrations-chart" className="w-full h-full"></canvas>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-black/30 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-gray-300">Team Size Distribution</CardTitle>
            <CardDescription>Number of members per team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <canvas id="team-size-chart" className="w-full h-full"></canvas>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/30 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-gray-300">Registration Sources</CardTitle>
            <CardDescription>Where registrations are coming from</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-80">
            <p className="text-gray-500 text-center">
              Source data not available yet.<br />
              Check back later for more insights.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
