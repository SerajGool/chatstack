'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { 
  Bot, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Settings as SettingsIcon,
  LayoutDashboard,
  ChevronDown,
  Camera,
  Save,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert } from '@/components/ui/alert'

export default function AccountSettings() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [uploading, setUploading] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error getting session:', error)
        router.push('/login')
        return
      }
      
      if (!session?.user) {
        router.push('/login')
        return
      }
      
      setUser(session.user)
      setEmail(session.user.email || '')
      setDisplayName(session.user.user_metadata?.full_name || session.user.user_metadata?.display_name || '')
      setLoading(false)
    }

    getUser()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase()
  }

  const handleSaveDisplayName = async () => {
    if (!user) return
    
    setSaving(true)
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: displayName,
          display_name: displayName 
        }
      })
      
      if (error) throw error
      
      // Update local user state
      setUser(prev => prev ? {
        ...prev,
        user_metadata: {
          ...prev.user_metadata,
          full_name: displayName,
          display_name: displayName
        }
      } : null)
      
      console.log('Display name updated successfully!')

      setAlert({ message: 'Display name updated successfully!', type: 'success' })
      
    } catch (error) {
      console.error('Error updating display name:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setUploading(true)

    try {
      // Make sure file isn't too big (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setAlert({ message: 'Image is too big! Please use an image smaller than 5MB.', type: 'error' })
        return
      }
      
      // Make sure it's actually an image
      if (!file.type.startsWith('image/')) {
        setAlert({ message: 'Please upload an image file (JPG, PNG, etc.)', type: 'error' })
        return
      }

      // Create a unique filename
      const fileExtension = file.name.split('.').pop()
      const fileName = `${user.id}.${fileExtension}`
      const filePath = `profile-pictures/${fileName}`

      // Upload the image to Supabase
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        console.error('Upload failed:', uploadError)
        setAlert({ message: `Upload failed: ${uploadError.message}`, type: 'error' })
        return
      }

      // Get the web address of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      const imageUrl = publicUrlData?.publicUrl
      if (!imageUrl) {
        setAlert({ message: 'Could not get image URL', type: 'error' })
        return
      }

      // Save the image URL to your user profile
      await supabase.auth.updateUser({
        data: { avatar_url: imageUrl }
      })

      // Update what you see on screen
      setUser(prev => prev ? {
        ...prev,
        user_metadata: {
          ...prev.user_metadata,
          avatar_url: imageUrl
        }
      } : null)

      console.log('Profile picture updated! 🎉')

      setAlert({ message: 'Profile picture updated!', type: 'success' })

    } catch (error: any) {
      console.error('Something went wrong:', error)
      setAlert({ message: 'Something went wrong. Please try again.', type: 'error' })
    } finally {
      setUploading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setAlert({ message: 'Please fill in all password fields', type: 'error' })
      return
    }

    if (newPassword !== confirmPassword) {
      setAlert({ message: 'New passwords do not match', type: 'error' })
      return
    }

    if (newPassword.length < 6) {
      setAlert({ message: 'Password must be at least 6 characters long', type: 'error' })
      return
    }

    setChangingPassword(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        setAlert({ message: `Password change failed: ${error.message}`, type: 'error' })
        return
      }

      // Clear the form
      setNewPassword('')
      setConfirmPassword('')
      
      setAlert({ message: 'Password changed successfully!', type: 'success' })

    } catch (error: any) {
      setAlert({ message: `Error: ${error.message}`, type: 'error' })
    } finally {
      setChangingPassword(false)
    }
  }

  const handleDashboardClick = () => {
    router.push('/dashboard')
  }

  const handleAccountSettingsClick = () => {
    router.push('/dashboard/account-settings')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Alerts */}
      {alert && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <Alert 
            message={alert.message} 
            type={alert.type} 
            onClose={() => setAlert(null)} 
          />
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Account</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Support Button */}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Support</span>
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                      {user?.email ? getUserInitials(user.email) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.user_metadata?.full_name || user?.user_metadata?.display_name || user?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={handleDashboardClick}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={handleAccountSettingsClick}
                >
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Account Settings
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 hover:text-red-700"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-8 space-y-8">
        {/* Profile Picture Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl">
                  {user?.email ? getUserInitials(user.email) : 'U'}
                </AvatarFallback>
              </Avatar>
              <button 
                onClick={() => document.getElementById('profile-upload')?.click()}
                disabled={uploading}
                className="absolute -bottom-2 -right-2 bg-black text-white rounded-full p-2 hover:bg-gray-800 shadow-lg disabled:opacity-50"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
              <p className="text-sm text-gray-500 mt-1">
                {uploading ? 'Uploading...' : 'Click the camera icon to update your profile picture'}
              </p>
              <p className="text-xs text-gray-400 mt-2">JPG, PNG or GIF. Max size 5MB.</p>
            </div>
          </div>
        </div>

        {/* Email Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Your email address cannot be changed.
              </p>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <Button 
              disabled 
              className="bg-gray-400 text-white cursor-not-allowed"
            >
              Save
            </Button>
          </div>
        </div>

        {/* Display Name Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="display-name" className="block text-sm font-medium text-gray-900 mb-2">
                Display name
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Please enter the display name you want to use.
              </p>
              <input
                id="display-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button
              onClick={handleSaveDisplayName}
              disabled={saving || !displayName.trim()}
              className="relative overflow-hidden bg-black text-white hover:bg-gray-800 disabled:opacity-50"
            >
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Change Password</h3>
              <p className="text-sm text-gray-500 mb-4">
                Update your password to keep your account secure.
              </p>
            </div>

            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-900 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-900 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleChangePassword}
              disabled={changingPassword || !newPassword || !confirmPassword}
              className="relative overflow-hidden bg-black text-white hover:bg-gray-800 disabled:opacity-50"
            >
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              {changingPassword ? 'Changing Password...' : 'Change Password'}
            </Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white border border-red-200 rounded-lg p-6">
          <div className="text-center mb-4">
            <h3 className="text-sm font-medium text-red-600 uppercase tracking-wide">DANGER ZONE</h3>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h4 className="text-lg font-medium text-red-800 mb-2">Delete account</h4>
            <p className="text-sm text-red-700 mb-4">
              Once you delete your account, there is no going back. Please be certain. All your uploaded data and trained agents will be deleted. <strong>This action is not reversible</strong>
            </p>
            <Button
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}