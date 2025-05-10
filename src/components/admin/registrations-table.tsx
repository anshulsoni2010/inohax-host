'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { toast } from 'react-toastify'
import { Search, Eye, Trash2, ExternalLink, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import OverviewStats from './overview-stats'

interface Registration {
  _id: string
  teamName: string
  teamLeaderName: string
  teamLeaderEmail: string
  teamLeaderPhone: string
  teamMembers: Array<{ name: string, socialMediaLink?: string }>
  inovactSocialLink?: string
  createdAt: string
}

export default function RegistrationsTable() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  // Fetch registrations from API
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await fetch('/api/admin/registrations', {
          headers: {
            'Content-Type': 'application/json',
            // Use Basic Auth with the current admin credentials from session storage
            'Authorization': `Basic ${btoa(`${sessionStorage.getItem('inohax_admin_username') || 'Sarang'}:Inohax!2.0`)}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch registrations')
        }

        const data = await response.json()
        if (data.success && data.registrations) {
          setRegistrations(data.registrations)
          setFilteredRegistrations(data.registrations)
          setTotalPages(Math.ceil(data.registrations.length / itemsPerPage))
        } else {
          throw new Error('Invalid response format')
        }
      } catch (error) {
        console.error('Error fetching registrations:', error)
        toast.error('Failed to load registrations')
        // For demo purposes, load sample data if API fails
        loadSampleData()
      } finally {
        setIsLoading(false)
      }
    }

    fetchRegistrations()
  }, [])



  // Load sample data for demonstration
  const loadSampleData = () => {
    const sampleData: Registration[] = Array.from({ length: 25 }, (_, i) => ({
      _id: `sample-${i + 1}`,
      teamName: `Team ${i + 1}`,
      teamLeaderName: `Leader ${i + 1}`,
      teamLeaderEmail: `leader${i + 1}@example.com`,
      teamLeaderPhone: `123456789${i}`,
      teamMembers: [
        { name: `Member ${i}-1` },
        { name: `Member ${i}-2` }
      ],
      inovactSocialLink: i % 3 === 0 ? `https://inovact.in/post?id=${1000 + i}` : undefined,
      createdAt: new Date(Date.now() - i * 86400000).toISOString()
    }))

    setRegistrations(sampleData)
    setFilteredRegistrations(sampleData)
    setTotalPages(Math.ceil(sampleData.length / itemsPerPage))
  }

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRegistrations(registrations)
    } else {
      const filtered = registrations.filter(reg =>
        reg.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.teamLeaderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.teamLeaderEmail.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredRegistrations(filtered)
    }
    setCurrentPage(1)
    setTotalPages(Math.ceil(filteredRegistrations.length / itemsPerPage))
  }, [searchTerm, registrations])

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredRegistrations.slice(startIndex, endIndex)
  }

  // Handle view registration details
  const handleViewDetails = (registration: Registration) => {
    setSelectedRegistration(registration)
  }

  // Handle delete registration
  const handleDeleteRegistration = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      try {
        // Call API to delete registration
        const response = await fetch(`/api/admin/registrations?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${btoa(`${sessionStorage.getItem('inohax_admin_username') || 'Sarang'}:Inohax!2.0`)}`
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to delete registration')
        }

        const data = await response.json()

        if (data.success) {
          // Update state
          const updatedRegistrations = registrations.filter(reg => reg._id !== id)
          setRegistrations(updatedRegistrations)
          setFilteredRegistrations(updatedRegistrations)

          toast.success('Registration deleted successfully')
        } else {
          throw new Error('Failed to delete registration')
        }
      } catch (error) {
        console.error('Error deleting registration:', error)
        toast.error(error instanceof Error ? error.message : 'Failed to delete registration')
      }
    }
  }

  // Handle export to CSV
  const handleExportCSV = () => {
    try {
      // Create CSV content
      const headers = ['Team Name', 'Leader Name', 'Leader Email', 'Leader Phone', 'Members', 'Inovact Link', 'Date']
      const csvRows = [headers]

      filteredRegistrations.forEach(reg => {
        const members = reg.teamMembers.map(m => m.name).join(', ')
        const row = [
          reg.teamName,
          reg.teamLeaderName,
          reg.teamLeaderEmail,
          reg.teamLeaderPhone,
          members,
          reg.inovactSocialLink || 'N/A',
          new Date(reg.createdAt).toLocaleDateString()
        ]
        csvRows.push(row)
      })

      const csvContent = csvRows.map(row => row.join(',')).join('\n')

      // Create and download the CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `inohax-registrations-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('CSV exported successfully')
    } catch (error) {
      console.error('Error exporting CSV:', error)
      toast.error('Failed to export CSV')
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-black/30 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-medium text-gray-300">Registrations</CardTitle>
          <CardDescription>Loading registration data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <div className="loader"></div>
        </CardContent>
      </Card>
    )
  }

  // Calculate stats for overview
  const totalRegistrations = registrations.length;
  const recentRegistrations = registrations.filter(reg => {
    const regDate = new Date(reg.createdAt);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return regDate >= sevenDaysAgo;
  }).length;
  const inovactLinks = registrations.filter(reg => reg.inovactSocialLink).length;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <OverviewStats
        totalRegistrations={totalRegistrations}
        recentRegistrations={recentRegistrations}
        inovactLinks={inovactLinks}
      />

      <Card className="bg-black/30 border-gray-800">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-medium text-gray-300">All Registrations</CardTitle>
              <CardDescription>Manage team registrations</CardDescription>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search teams..."
                  className="pl-8 bg-gray-900/50 border-gray-700 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="text-green-400 border-green-400/30 hover:bg-green-400/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>
              Showing {getCurrentPageItems().length} of {filteredRegistrations.length} registrations
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-gray-900/50 hover:bg-gray-900/70">
                <TableHead className="w-[200px]">Team Name</TableHead>
                <TableHead>Team Leader</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Inovact Link</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getCurrentPageItems().map((registration) => (
                <TableRow key={registration._id} className="border-gray-800 hover:bg-gray-900/30">
                  <TableCell className="font-medium">{registration.teamName}</TableCell>
                  <TableCell>{registration.teamLeaderName}</TableCell>
                  <TableCell>{registration.teamLeaderEmail}</TableCell>
                  <TableCell>{new Date(registration.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {registration.inovactSocialLink ? (
                      <a
                        href={registration.inovactSocialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline flex items-center"
                      >
                        View <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(registration)}
                        className="h-8 w-8 p-0 text-blue-400"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRegistration(registration._id)}
                        className="h-8 w-8 p-0 text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {filteredRegistrations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                    No registrations found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Registration Details Dialog */}
      {selectedRegistration && (
        <Dialog open={!!selectedRegistration} onOpenChange={(open) => !open && setSelectedRegistration(null)}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-200">
                {selectedRegistration.teamName} - Registration Details
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Registered on {new Date(selectedRegistration.createdAt).toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Team Leader</h3>
                  <p className="text-lg font-semibold text-gray-200">{selectedRegistration.teamLeaderName}</p>
                </div>



                <div>
                  <h3 className="text-sm font-medium text-gray-400">Phone</h3>
                  <p className="text-gray-200">{selectedRegistration.teamLeaderPhone}</p>
                </div>
              </div>

              <div className="space-y-4">
                 <div>
                  <h3 className="text-sm font-medium text-gray-400">Email</h3>
                  <p className="text-gray-200">{selectedRegistration.teamLeaderEmail}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-400">Inovact Social Link</h3>
                  {selectedRegistration.inovactSocialLink ? (
                    <a
                      href={selectedRegistration.inovactSocialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline flex items-center"
                    >
                      {selectedRegistration.inovactSocialLink}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  ) : (
                    <p className="text-gray-500">Not provided</p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}
