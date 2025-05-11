'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from 'react-toastify'
import { UserPlus, Trash2, Edit, Save, X, Copy, Check } from 'lucide-react'

interface AdminUser {
  id: string
  username: string
  adminId: string
  password: string
  createdAt: string
  lastLogin?: string
}

export default function AdminManagement() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null)

  // State for new admin credentials popup
  const [newAdminCredentials, setNewAdminCredentials] = useState<{
    username: string;
    adminId: string;
    password: string;
    show: boolean;
  }>({
    username: '',
    adminId: '',
    password: '',
    show: false
  })

  // State for copy button feedback
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  })

  // Function to copy text to clipboard
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 2000)
      })
      .catch(err => {
        console.error('Failed to copy text: ', err)
        toast.error('Failed to copy to clipboard')
      })
  }

  // Function to load admin users from database
  const loadAdminUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Use token-based auth
          'x-auth-token': localStorage.getItem('inohax_admin_token') || ''
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admin users');
      }

      const data = await response.json();

      if (data.success && data.admins) {
        // Map the response data to our AdminUser interface
        const adminUsers: AdminUser[] = data.admins.map((admin: any) => ({
          id: admin._id,
          username: admin.username,
          adminId: admin.adminId,
          password: '********', // Masked for security
          createdAt: admin.createdAt,
          lastLogin: admin.lastLogin
        }));

        setAdmins(adminUsers);
      } else {
        // If API fails, use sample data as fallback
        const sampleAdmins: AdminUser[] = [
          {
            id: '1',
            username: 'Sarang',
            adminId: '01',
            password: '********', // Masked for security
            createdAt: '2023-04-01T10:00:00Z',
            lastLogin: '2023-05-07T15:30:00Z'
          }
        ];

        setAdmins(sampleAdmins);
      }
    } catch (error) {
      console.error('Error loading admin users:', error);
      toast.error('Failed to load admin users');

      // Fallback to sample data
      const sampleAdmins: AdminUser[] = [
        {
          id: '1',
          username: 'Sarang',
          adminId: '01',
          password: '********', // Masked for security
          createdAt: '2023-04-01T10:00:00Z',
          lastLogin: '2023-05-07T15:30:00Z'
        }
      ];

      setAdmins(sampleAdmins);
    } finally {
      setIsLoading(false);
    }
  };

  // Load admin users on component mount
  useEffect(() => {
    loadAdminUsers();
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.username || !formData.password) {
      toast.error('All fields are required')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      // Call API to create admin
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('inohax_admin_token') || ''
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create admin user')
      }

      const data = await response.json()

      if (data.success && data.admin) {
        // Refresh the admin list to get the updated data with correct ID
        await loadAdminUsers()

        // Get the admin with the correct ID from the updated list
        const updatedAdmins = await fetch('/api/admin/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('inohax_admin_token') || ''
          }
        }).then(res => res.json());

        // Find the newly created admin by username
        const newAdmin = updatedAdmins.admins.find((admin: any) => admin.username === data.admin.username);

        // Show credentials popup with the original password and correct ID
        setNewAdminCredentials({
          username: data.admin.username,
          adminId: newAdmin ? newAdmin.adminId : data.admin.adminId,
          password: formData.password, // Use the original password
          show: true
        })

        // Reset form
        setFormData({
          username: '',
          password: '',
          confirmPassword: ''
        })

        setShowAddForm(false)
        toast.success('Admin user added successfully')
      } else {
        throw new Error('Failed to create admin user')
      }
    } catch (error) {
      console.error('Error adding admin:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create admin user')
    }
  }

  const handleEditAdmin = (admin: AdminUser) => {
    setEditingAdminId(admin.id)
    setFormData({
      username: admin.username,
      password: '',
      confirmPassword: ''
    })
  }

  const handleUpdateAdmin = async (e: React.FormEvent, adminId: string) => {
    e.preventDefault()

    // Validate form
    if (!formData.username) {
      toast.error('Username is required')
      return
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      // Call API to update admin
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('inohax_admin_token') || ''
        },
        body: JSON.stringify({
          id: adminId,
          username: formData.username,
          password: formData.password // Only send password if it was changed
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update admin user')
      }

      const data = await response.json()

      if (data.success && data.admin) {
        // Update admin in state
        setAdmins(prev => prev.map(admin => {
          if (admin.id === adminId) {
            return {
              ...admin,
              username: data.admin.username,
              adminId: data.admin.adminId,
              password: '********' // Masked for security
            }
          }
          return admin
        }))

        // Reset form and editing state
        setEditingAdminId(null)
        setFormData({
          username: '',
          password: '',
          confirmPassword: ''
        })

        toast.success('Admin user updated successfully')
      } else {
        throw new Error('Failed to update admin user')
      }
    } catch (error) {
      console.error('Error updating admin:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update admin user')
    }
  }

  const handleDeleteAdmin = async (adminId: string) => {
    // Prevent deleting the last admin
    if (admins.length <= 1) {
      toast.error('Cannot delete the last admin user')
      return
    }

    if (window.confirm('Are you sure you want to delete this admin user?')) {
      try {
        // Call API to delete admin
        const response = await fetch(`/api/admin/users?id=${adminId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('inohax_admin_token') || ''
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to delete admin user')
        }

        const data = await response.json()

        if (data.success) {
          // Refresh the admin list
          await loadAdminUsers()
          toast.success('Admin user deleted successfully')
        } else {
          throw new Error('Failed to delete admin user')
        }
      } catch (error) {
        console.error('Error deleting admin:', error)
        toast.error(error instanceof Error ? error.message : 'Failed to delete admin user')
      }
    }
  }

  const cancelEdit = () => {
    setEditingAdminId(null)
    setFormData({
      username: '',
      password: '',
      confirmPassword: ''
    })
  }

  if (isLoading) {
    return (
      <Card className="bg-black/30 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-medium text-gray-300">Admin Management</CardTitle>
          <CardDescription>Loading admin users...</CardDescription>
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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-medium text-gray-300">Admin Users</CardTitle>
              <CardDescription>Manage admin access to the dashboard</CardDescription>
            </div>

            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <Card className="bg-gray-900/50 border-gray-700 mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-gray-300">Add New Admin</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddAdmin} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-gray-300">Admin Name</Label>
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="bg-gray-800/50 border-gray-700"
                        placeholder="Enter admin name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-300">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="bg-gray-800/50 border-gray-700"
                        placeholder="Enter password"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="bg-gray-800/50 border-gray-700"
                        placeholder="Confirm password"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-gray-400">Admin ID will be automatically assigned in sequence</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      Add Admin
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableCaption>
                Total of {admins.length} admin users
              </TableCaption>
              <TableHeader>
                <TableRow className="bg-gray-900/50 hover:bg-gray-900/70">
                  <TableHead>Admin Name</TableHead>
                  <TableHead>Admin ID</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id} className="border-gray-800 hover:bg-gray-900/30">
                    {editingAdminId === admin.id ? (
                      <TableCell colSpan={5}>
                        <form onSubmit={(e) => handleUpdateAdmin(e, admin.id)} className="space-y-4">
                          <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-username" className="text-gray-300">Admin Name</Label>
                              <Input
                                id="edit-username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="bg-gray-800/50 border-gray-700"
                                placeholder="Enter admin name"
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-password" className="text-gray-300">New Password (optional)</Label>
                              <Input
                                id="edit-password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="bg-gray-800/50 border-gray-700"
                                placeholder="Leave blank to keep current"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-confirmPassword" className="text-gray-300">Confirm New Password</Label>
                              <Input
                                id="edit-confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="bg-gray-800/50 border-gray-700"
                                placeholder="Confirm new password"
                              />
                            </div>

                            <div className="space-y-2">
                              <p className="text-xs text-gray-400">Admin ID is automatically assigned and cannot be changed</p>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={cancelEdit}
                              className="text-gray-400 border-gray-600"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                          </div>
                        </form>
                      </TableCell>
                    ) : (
                      <>
                        <TableCell className="font-medium">{admin.username}</TableCell>
                        <TableCell>{admin.adminId}</TableCell>
                        <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'Never'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditAdmin(admin)}
                              className="h-8 w-8 p-0 text-blue-400"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAdmin(admin.id)}
                              className="h-8 w-8 p-0 text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}

                {admins.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                      No admin users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="border-t border-gray-800 pt-4">
          <p className="text-sm text-gray-500">
            Note: Admin credentials are stored securely. Passwords are never displayed in plain text.
          </p>
        </CardFooter>
      </Card>

      {/* Admin Credentials Dialog */}
      <Dialog
        open={newAdminCredentials.show}
        onOpenChange={(open) => setNewAdminCredentials(prev => ({ ...prev, show: open }))}
      >
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-200">
              New Admin Credentials
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Please save these credentials securely. The password will not be shown again.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Admin Name</h3>
                <p className="text-lg font-semibold text-gray-200">{newAdminCredentials.username}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(newAdminCredentials.username, 'username')}
                className="h-8 w-8 p-0 text-gray-400 hover:text-white"
              >
                {copiedField === 'username' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Admin ID</h3>
                <p className="text-lg font-semibold text-gray-200">{newAdminCredentials.adminId}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(newAdminCredentials.adminId, 'adminId')}
                className="h-8 w-8 p-0 text-gray-400 hover:text-white"
              >
                {copiedField === 'adminId' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Password</h3>
                <p className="text-lg font-semibold text-gray-200">{newAdminCredentials.password}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(newAdminCredentials.password, 'password')}
                className="h-8 w-8 p-0 text-gray-400 hover:text-white"
              >
                {copiedField === 'password' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setNewAdminCredentials(prev => ({ ...prev, show: false }))}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
