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
  ArrowLeft
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

export default function AccountSettings() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [uploading, setUploading] = useState(false)
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
      
      console.log('Display name updated successfully')
      
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
      // Create a unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}.${fileExt}`
      const filePath = `profile-pictures/${fileName}`

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update user metadata with new avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: data.publicUrl }
      })

      if (updateError) throw updateError

      // Update local user state
      setUser(prev => prev ? {
        ...prev,
        user_metadata: {
          ...prev.user_metadata,
          avatar_url: data.publicUrl
        }
      } : null)

      console.log('Profile picture updated successfully')

    } catch (error) {
      console.error('Error uploading profile picture:', error)
    } finally {
      setUploading(false)
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
                Enter your full name or a comfortable display name.
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