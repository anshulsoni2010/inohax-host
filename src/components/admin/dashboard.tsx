'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import RegistrationsTable from './registrations-table'
import AdminManagement from './admin-management'
import { LogOut, Users, UserPlus } from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('registrations')
  const [adminName, setAdminName] = useState('')

  useEffect(() => {
    // Get admin name from local storage
    const storedAdminName = localStorage.getItem('inohax_admin_username')
    if (storedAdminName) {
      setAdminName(storedAdminName)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('inohax_admin_auth')
    localStorage.removeItem('inohax_admin_username')
    localStorage.removeItem('inohax_admin_token')
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Admin Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-gray-800 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Users className="h-6 w-6 text-purple-400" />
            <h1 className="text-xl font-bold text-white">Inohax 2.0 Admin</h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300">Welcome, {adminName}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-red-400 border-red-400/30 hover:bg-red-400/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
        <Tabs defaultValue="registrations" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="bg-gray-900/50 border border-gray-800">
              <TabsTrigger value="registrations" className="data-[state=active]:bg-purple-600">
                <Users className="h-4 w-4 mr-2" />
                Registrations
              </TabsTrigger>
              <TabsTrigger value="admins" className="data-[state=active]:bg-purple-600">
                <UserPlus className="h-4 w-4 mr-2" />
                Admin Management
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="registrations">
            <RegistrationsTable />
          </TabsContent>

          <TabsContent value="admins">
            <AdminManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
