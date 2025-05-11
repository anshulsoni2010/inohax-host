'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AdminDashboard from '@/components/admin/dashboard'

interface AuthFormData {
  username: string
  password: string
}

export default function AnalyticsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<AuthFormData>({
    username: '',
    password: ''
  })
  const router = useRouter()

  // Check if user is already authenticated (from local storage)
  useEffect(() => {
    const authStatus = localStorage.getItem('inohax_admin_auth')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Call the API to validate credentials
      const response = await fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${formData.username}:${formData.password}`)}`
        }
      })

      if (response.ok) {
        // Authentication successful
        setIsAuthenticated(true)

        // Generate a simple token: username:timestamp:hash
        const timestamp = Date.now().toString();
        const username = formData.username;
        // In a real app, you'd use a proper hash function with a secret key
        const hash = btoa(`${username}:${timestamp}`);
        const token = `${username}:${timestamp}:${hash}`;

        localStorage.setItem('inohax_admin_auth', 'true')
        localStorage.setItem('inohax_admin_token', token)
        localStorage.setItem('inohax_admin_username', formData.username)
        toast.success('Login successful!')
      } else {
        // Fallback to hardcoded credentials for initial admin
        if (
          (formData.username === 'Sarang' && formData.password === 'Inohax!2.0') ||
          (formData.username === '01' && formData.password === 'Inohax!2.0')
        ) {
          setIsAuthenticated(true)

          // Generate a simple token for hardcoded admin
          const timestamp = Date.now().toString();
          const username = 'Sarang';
          const hash = btoa(`${username}:${timestamp}`);
          const token = `${username}:${timestamp}:${hash}`;

          localStorage.setItem('inohax_admin_auth', 'true')
          localStorage.setItem('inohax_admin_token', token)
          localStorage.setItem('inohax_admin_username', 'Sarang')
          toast.success('Login successful!')
        } else {
          toast.error('Invalid credentials')
        }
      }
    } catch (error) {
      console.error('Login error:', error)

      // Fallback to hardcoded credentials if API fails
      if (
        (formData.username === 'Sarang' && formData.password === 'Inohax!2.0') ||
        (formData.username === '01' && formData.password === 'Inohax!2.0')
      ) {
        setIsAuthenticated(true)

        // Generate a simple token for hardcoded admin
        const timestamp = Date.now().toString();
        const username = 'Sarang';
        const hash = btoa(`${username}:${timestamp}`);
        const token = `${username}:${timestamp}:${hash}`;

        localStorage.setItem('inohax_admin_auth', 'true')
        localStorage.setItem('inohax_admin_token', token)
        localStorage.setItem('inohax_admin_username', 'Sarang')
        toast.success('Login successful!')
      } else {
        toast.error('Invalid credentials')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="loader"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
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

        <Card className="w-full max-w-md backdrop-blur-lg bg-black/30 border border-gray-700 shadow-2xl shadow-purple-500/10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-300">Admin Login</CardTitle>
            <CardDescription className="text-center text-gray-400">Enter your credentials to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">Admin Name or ID</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="bg-gray-900/50 border-gray-700"
                  placeholder="Enter admin name or ID"
                  required
                />
                <p className="text-xs text-gray-500">You can log in with either your admin name or ID</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-gray-900/50 border-gray-700"
                  placeholder="Enter password"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If authenticated, show the admin dashboard
  return <AdminDashboard />
}
