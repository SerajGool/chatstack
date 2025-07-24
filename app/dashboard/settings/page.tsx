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
  CreditCard,
  Bell,
  Shield,
  Globe,
  ArrowLeft,
  Check,
  X
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

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('general')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [currentPlan, setCurrentPlan] = useState('free')
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

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">ChatStack</h1>
        </div>
        
        <nav className="px-4 space-y-1">
          <a
            href="/dashboard"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          >
            <Bot className="mr-3 h-4 w-4" />
            Chatbots
          </a>
          
          <a
            href="/dashboard/analytics"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          >
            <BarChart3 className="mr-3 h-4 w-4" />
            Analytics
          </a>
          
          <a
            href="/dashboard/settings"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-md"
          >
            <Settings className="mr-3 h-4 w-4" />
            Settings
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
              <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
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
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
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

        {/* Main Content Area */}
        <div className="flex">
          {/* Settings Sidebar */}
          <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
            <div className="p-6">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'text-gray-900 bg-gray-100'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {tab.name}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-8">
            {activeTab === 'general' && (
              <div className="max-w-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">General Settings</h3>
                
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Organization</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        placeholder="Your Company Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://yourwebsite.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time Zone
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>UTC+02:00 - Cape Town</option>
                        <option>UTC+00:00 - London</option>
                        <option>UTC-05:00 - New York</option>
                        <option>UTC-08:00 - Los Angeles</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button className="relative overflow-hidden bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md font-medium">
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                      Save Changes
                    </Button>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Preferences</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">Language</h5>
                        <p className="text-sm text-gray-500">Choose your preferred language</p>
                      </div>
                      <select className="px-3 py-2 border border-gray-300 rounded-md">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">Theme</h5>
                        <p className="text-sm text-gray-500">Choose your interface theme</p>
                      </div>
                      <select className="px-3 py-2 border border-gray-300 rounded-md">
                        <option>Light</option>
                        <option>Dark</option>
                        <option>System</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="max-w-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Billing & Subscription</h3>
                
                {/* Current Plan */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Current Plan</h4>
                  
                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div>
                      <h5 className="text-lg font-semibold text-blue-900">Free Plan</h5>
                      <p className="text-sm text-blue-700">1 chatbot • 100 messages/month • Basic support</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-900">$0</p>
                      <p className="text-sm text-blue-700">per month</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button className="relative overflow-hidden bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md font-medium">
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                      Upgrade Plan
                    </Button>
                  </div>
                </div>

                {/* Available Plans */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Available Plans</h4>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Pro Plan */}
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <h5 className="text-lg font-semibold text-gray-900">Pro</h5>
                        <span className="text-2xl font-bold text-gray-900">$29</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">per month</p>
                      
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          5 chatbots
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          10,000 messages/month
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          Priority support
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          Custom branding
                        </li>
                      </ul>
                      
                      <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                        Choose Pro
                      </Button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                          POPULAR
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-start mb-3">
                        <h5 className="text-lg font-semibold text-gray-900">Enterprise</h5>
                        <span className="text-2xl font-bold text-gray-900">$99</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">per month</p>
                      
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          Unlimited chatbots
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          100,000 messages/month
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          24/7 dedicated support
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          White-label solution
                        </li>
                      </ul>
                      
                      <Button className="w-full mt-4 relative overflow-hidden bg-black text-white hover:bg-gray-800">
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                        Choose Enterprise
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h4>
                  <p className="text-sm text-gray-500 mb-4">No payment method on file</p>
                  <Button variant="outline">Add Payment Method</Button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="max-w-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Notification Settings</h3>
                
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">Chat notifications</h5>
                        <p className="text-sm text-gray-500">Get notified when someone chats with your bots</p>
                      </div>
                      <button
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            emailNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">Marketing emails</h5>
                        <p className="text-sm text-gray-500">Receive emails about new features and updates</p>
                      </div>
                      <button
                        onClick={() => setMarketingEmails(!marketingEmails)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          marketingEmails ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            marketingEmails ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="max-w-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h3>
                
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Password</h4>
                  <p className="text-sm text-gray-500 mb-4">Update your password to keep your account secure</p>
                  <Button variant="outline">Change Password</Button>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500 mb-4">Add an extra layer of security to your account</p>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-red-600">Disabled</span>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}