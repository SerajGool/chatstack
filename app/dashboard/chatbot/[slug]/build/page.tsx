'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { 
  Bot, 
  FileText,
  Globe,
  MessageSquare,
  Upload,
  Link,
  Settings,
  Eye,
  Save,
  X,
  CheckCircle,
  Upload as UploadIcon,
  Send,
  BarChart3,
  Activity,
  Share2,
  Code,
  Palette,
  Monitor,
  Brain,
  Users,
  MessageCircle,
  TrendingUp,
  ExternalLink,
  Smartphone,
  Facebook,
  Instagram,
  Webhook,
  Copy,
  Play,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  LogOut,
  Settings as SettingsIcon,
  LayoutDashboard,
  ChevronDown as ProfileChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function ChatbotBuilder({ params }: { params: Promise<{ slug: string }> }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [chatbotName, setChatbotName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  
  // Dropdown states
  const [trainingDataOpen, setTrainingDataOpen] = useState(false)
  const [activityOpen, setActivityOpen] = useState(false)
  const [integrationsOpen, setIntegrationsOpen] = useState(false)
  const [configurationOpen, setConfigurationOpen] = useState(false)
  
  // File upload states
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  
  // Chat preview states
  const [messages, setMessages] = useState([
    { type: 'bot', content: 'Hi! I\'m your AI assistant. I can help answer questions about the documents you\'ve uploaded.' }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const getUser = async () => {
      const resolvedParams = await params
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session?.user) {
        router.push('/login')
        return
      }
      
      setUser(session.user)
      setLoading(false)
      
      // Convert slug back to readable name
      const name = resolvedParams.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      setChatbotName(name)
      
      // Show success message if redirected from creation
      if (searchParams.get('success') === 'created') {
        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 5000)
      }
    }

    getUser()
  }, [router, params, searchParams])

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

  const handleSaveChatbot = async () => {
    setIsSaving(true)
    
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSaving(false)
    
    // Show success message
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true)
    
    for (const file of Array.from(files)) {
      const newFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        status: 'processing',
        file: file
      }
      
      if (file.type === 'application/pdf' || file.type === 'text/plain') {
        try {
          setUploadedFiles(prev => [...prev, newFile])
          
          let question = ''
          
          if (file.type === 'application/pdf') {
            question = 'What is this document about? Please provide a brief summary.'
          } else if (file.type === 'text/plain') {
            question = 'What is the main content and purpose of this text file? Please provide a brief summary.'
          }
          
          const formData = new FormData()
          formData.append('file', file)
          formData.append('question', question)
          
          const response = await fetch('/api/ask', {
            method: 'POST',
            body: formData,
          })
          
          const result = await response.json()
          
          setUploadedFiles(prev => prev.map(f => 
            f.id === newFile.id 
              ? { ...f, status: 'ready', summary: result.answer }
              : f
          ))
          
        } catch (error) {
          setUploadedFiles(prev => prev.map(f => 
            f.id === newFile.id 
              ? { ...f, status: 'error', error: 'Failed to process file' }
              : f
          ))
        }
      } else {
        const errorFile = { ...newFile, status: 'error', error: 'File type not yet supported. Currently supports PDF and TXT files.' }
        setUploadedFiles(prev => [...prev, errorFile])
      }
    }
    
    setIsUploading(false)
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || uploadedFiles.length === 0) {
      if (uploadedFiles.length === 0) {
        setMessages(prev => [...prev, { type: 'bot', content: 'Please upload a PDF file first so I can help answer your questions!' }])
      }
      return
    }

    const userMessage = { type: 'user', content: inputMessage }
    setMessages(prev => [...prev, userMessage])
    
    const currentQuestion = inputMessage
    setInputMessage('')
    setIsSending(true)
    
    setMessages(prev => [...prev, { type: 'bot', content: '🤔 Let me check your documents...' }])
    
    try {
      const readyFiles = uploadedFiles.filter(f => f.status === 'ready')
      if (readyFiles.length === 0) {
        throw new Error('No processed files available')
      }
      
      const latestFile = readyFiles[readyFiles.length - 1]
      
      const formData = new FormData()
      formData.append('file', latestFile.file)
      formData.append('question', currentQuestion)
      
      const response = await fetch('/api/ask', {
        method: 'POST',
        body: formData,
      })
      
      const result = await response.json()
      
      setMessages(prev => {
        const withoutLoading = prev.slice(0, -1)
        const newMessages = [...withoutLoading, { 
          type: 'bot', 
          content: result.answer || 'Sorry, I had trouble processing that question.',
          fileName: latestFile.name 
        }]
        
        setTimeout(() => {
          const chatContainer = document.querySelector('#chat-messages')
          if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight
          }
        }, 100)
        
        return newMessages
      })
      
    } catch (error) {
      setMessages(prev => {
        const withoutLoading = prev.slice(0, -1)
        const newMessages = [...withoutLoading, { type: 'bot', content: 'Sorry, there was an error processing your question.' }]
        
        setTimeout(() => {
          const chatContainer = document.querySelector('#chat-messages')
          if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight
          }
        }, 100)
        
        return newMessages
      })
    }
    
    setIsSending(false)
  }

  const removeFile = (fileId: number) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 relative z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <p className="text-sm text-green-700 font-medium">
                Chatbot "{chatbotName}" saved successfully!
              </p>
            </div>
            <button
              onClick={() => setShowSuccessMessage(false)}
              className="text-green-400 hover:text-green-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{chatbotName}</h1>
            <p className="text-sm text-gray-500">AI Chatbot</p>
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
                  <ProfileChevronDown className="h-4 w-4 text-gray-500" />
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

      <div className="flex">
        {/* Vertical Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-1">
            {/* Overview */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'overview' 
                  ? 'text-gray-900 bg-gray-100' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Eye className="mr-3 h-4 w-4" />
              Overview
            </button>

            {/* Playground */}
            <button
              onClick={() => setActiveTab('playground')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'playground' 
                  ? 'text-gray-900 bg-gray-100' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Play className="mr-3 h-4 w-4" />
              Playground
            </button>

            {/* Training Data Dropdown */}
            <div>
              <button
                onClick={() => setTrainingDataOpen(!trainingDataOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                <div className="flex items-center">
                  <FileText className="mr-3 h-4 w-4" />
                  Training Data
                </div>
                {trainingDataOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              
              {trainingDataOpen && (
                <div className="ml-6 mt-1 space-y-1">
                  <button
                    onClick={() => setActiveTab('files')}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'files' 
                        ? 'text-gray-900 bg-gray-100' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <FileText className="mr-3 h-3 w-3" />
                    Files
                  </button>
                  <button
                    onClick={() => setActiveTab('text')}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'text' 
                        ? 'text-gray-900 bg-gray-100' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <MessageSquare className="mr-3 h-3 w-3" />
                    Text
                  </button>
                  <button
                    onClick={() => setActiveTab('website')}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'website' 
                        ? 'text-gray-900 bg-gray-100' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Globe className="mr-3 h-3 w-3" />
                    Website
                  </button>
                </div>
              )}
            </div>

            {/* Activity Dropdown */}
            <div>
              <button
                onClick={() => setActivityOpen(!activityOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                <div className="flex items-center">
                  <Activity className="mr-3 h-4 w-4" />
                  Activity
                </div>
                {activityOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              
              {activityOpen && (
                <div className="ml-6 mt-1 space-y-1">
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'analytics' 
                        ? 'text-gray-900 bg-gray-100' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <BarChart3 className="mr-3 h-3 w-3" />
                    Analytics
                  </button>
                  <button
                    onClick={() => setActiveTab('chat-logs')}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'chat-logs' 
                        ? 'text-gray-900 bg-gray-100' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <MessageCircle className="mr-3 h-3 w-3" />
                    Chat Logs
                  </button>
                  <button
                    onClick={() => setActiveTab('leads')}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'leads' 
                        ? 'text-gray-900 bg-gray-100' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Users className="mr-3 h-3 w-3" />
                    Leads
                  </button>
                </div>
              )}
            </div>

            {/* Integrations Dropdown */}
            <div>
              <button
                onClick={() => setIntegrationsOpen(!integrationsOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                <div className="flex items-center">
                  <Share2 className="mr-3 h-4 w-4" />
                  Integrations
                </div>
                {integrationsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              
              {integrationsOpen && (
                <div className="ml-6 mt-1 space-y-1">
                  <button
                    onClick={() => setActiveTab('website-embed')}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'website-embed' 
                        ? 'text-gray-900 bg-gray-100' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Code className="mr-3 h-3 w-3" />
                    Website Embed
                  </button>
                  <button
                    onClick={() => setActiveTab('social-media')}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'social-media' 
                        ? 'text-gray-900 bg-gray-100' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Smartphone className="mr-3 h-3 w-3" />
                    Social Media
                  </button>
                  <button
                    onClick={() => setActiveTab('webhooks')}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'webhooks' 
                        ? 'text-gray-900 bg-gray-100' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Webhook className="mr-3 h-3 w-3" />
                    Webhooks
                  </button>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* Configuration Dropdown */}
            <div>
              <button
                onClick={() => setConfigurationOpen(!configurationOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                <div className="flex items-center">
                  <Settings className="mr-3 h-4 w-4" />
                  Configuration
                </div>
                {configurationOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              
              {configurationOpen && (
                <div className="ml-6 mt-1 space-y-1">
                  <button
                    onClick={() => setActiveTab('general')}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'general' 
                        ? 'text-gray-900 bg-gray-100' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Settings className="mr-3 h-3 w-3" />
                    General
                  </button>
                  <button
                    onClick={() => setActiveTab('ai-model')}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'ai-model' 
                        ? 'text-gray-900 bg-gray-100' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Brain className="mr-3 h-3 w-3" />
                    AI Model
                  </button>
                  <button
                    onClick={() => setActiveTab('theme')}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'theme' 
                        ? 'text-gray-900 bg-gray-100' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Palette className="mr-3 h-3 w-3" />
                    Theme
                  </button>
                  <button
                    onClick={() => setActiveTab('interface')}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'interface' 
                        ? 'text-gray-900 bg-gray-100' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Monitor className="mr-3 h-3 w-3" />
                    Interface
                  </button>
                  <button
                    onClick={() => setActiveTab('custom-domain')}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'custom-domain' 
                        ? 'text-gray-900 bg-gray-100' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Globe className="mr-3 h-3 w-3" />
                    Custom Domain
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative">
          {/* Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="max-w-6xl space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Overview</h2>
                  <p className="text-sm text-gray-500">Get a quick overview of your chatbot's performance and status.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <MessageCircle className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Total Conversations</p>
                          <p className="text-2xl font-bold text-gray-900">1,234</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <Users className="h-8 w-8 text-green-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Unique Users</p>
                          <p className="text-2xl font-bold text-gray-900">567</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <TrendingUp className="h-8 w-8 text-purple-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                          <p className="text-2xl font-bold text-gray-900">4.8</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <BarChart3 className="h-8 w-8 text-yellow-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                          <p className="text-2xl font-bold text-gray-900">89%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks to manage your chatbot</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center space-y-2"
                        onClick={() => {
                          setTrainingDataOpen(true)
                          setActiveTab('files')
                        }}
                      >
                        <Upload className="h-6 w-6" />
                        <span className="text-sm">Upload Files</span>
                      </Button>

                      <Button
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center space-y-2"
                        onClick={() => setActiveTab('playground')}
                      >
                        <Play className="h-6 w-6" />
                        <span className="text-sm">Test Bot</span>
                      </Button>

                      <Button
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center space-y-2"
                        onClick={() => {
                          setIntegrationsOpen(true)
                          setActiveTab('website-embed')
                        }}
                      >
                        <Code className="h-6 w-6" />
                        <span className="text-sm">Get Embed Code</span>
                      </Button>

                      <Button
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center space-y-2"
                        onClick={() => {
                          setActivityOpen(true)
                          setActiveTab('analytics')
                        }}
                      >
                        <BarChart3 className="h-6 w-6" />
                        <span className="text-sm">View Analytics</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Playground Tab */}
            {activeTab === 'playground' && (
              <div className="max-w-4xl space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Playground</h2>
                  <p className="text-sm text-gray-500">Test your chatbot in a full-screen environment.</p>
                </div>

                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Play className="mr-2 h-5 w-5" />
                      Chatbot Playground
                    </CardTitle>
                    <CardDescription>
                      Test your chatbot with real conversations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {/* Chat Messages */}
                    <div className="flex-1 border rounded-lg p-4 bg-gray-50 overflow-y-auto space-y-4 mb-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              message.type === 'user'
                                ? 'bg-black text-white'
                                : 'bg-white text-gray-900 border'
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input */}
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Ask your chatbot anything..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={isSending || !inputMessage.trim()}
                        className="relative overflow-hidden bg-black text-white hover:bg-gray-800"
                      >
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Files Tab */}
            {activeTab === 'files' && (
              <div className="max-w-7xl space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Files</h2>
                  <p className="text-sm text-gray-500">Upload documents to train your AI. Extract text from PDFs, DOCX, and TXT files.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Left Side - Upload Documents */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Upload className="mr-2 h-5 w-5" />
                          Upload Documents
                        </CardTitle>
                        <CardDescription>
                          Upload PDF documents to train your AI. Your chatbot will be able to answer questions based on these files.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div 
                          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                            dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onDrop={(e: any) => {
                            e.preventDefault()
                            setDragActive(false)
                            handleFileUpload(e.dataTransfer.files)
                          }}
                          onDragOver={(e: any) => {
                            e.preventDefault()
                            setDragActive(true)
                          }}
                          onDragLeave={(e: any) => {
                            e.preventDefault()
                            setDragActive(false)
                          }}
                        >
                          <UploadIcon className="mx-auto h-10 w-10 text-gray-400" />
                          <h3 className="mt-3 text-lg font-medium text-gray-900">
                            Drag & drop files here, or click to select
                          </h3>
                          <p className="mt-2 text-xs text-gray-500">
                            Supported file types: PDF, DOC, DOCX, TXT, XLS, XLSX
                          </p>
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
                            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                            className="hidden"
                            id="file-upload"
                          />
                          <Button 
                            variant="outline" 
                            className="mt-3" 
                            disabled={isUploading}
                            onClick={() => document.getElementById('file-upload')?.click()}
                          >
                            {isUploading ? 'Processing...' : 'Choose Files'}
                          </Button>
                        </div>

                        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                          <p className="text-sm text-orange-800">
                            💡 Make sure your PDF has selectable text (not just images). The AI will extract and learn from the text content.
                          </p>
                        </div>

                        {/* Uploaded Files List */}
                        {uploadedFiles.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-medium text-gray-900 mb-3">Uploaded Files ({uploadedFiles.length})</h4>
                            <div className="space-y-2">
                              {uploadedFiles.map((file) => (
                                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <div className={`w-2 h-2 rounded-full ${
                                      file.status === 'ready' ? 'bg-green-400' :
                                      file.status === 'processing' ? 'bg-yellow-400 animate-pulse' :
                                      'bg-red-400'
                                    }`} />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                      <p className="text-xs text-gray-500">
                                        {formatFileSize(file.size)} • {
                                          file.status === 'ready' ? 'Ready' :
                                          file.status === 'processing' ? 'Processing...' :
                                          'Error'
                                        }
                                      </p>
                                      {file.error && (
                                        <p className="text-xs text-red-600">{file.error}</p>
                                      )}
                                      {file.summary && (
                                        <p className="text-xs text-gray-600 mt-1 max-w-md truncate">
                                          📄 {file.summary.substring(0, 100)}...
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => removeFile(file.id)}
                                    className="text-gray-400 hover:text-red-600 p-1"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Side - Quick Test Chat */}
                  <div className="lg:col-span-1">
                    <Card className="h-fit sticky top-4">
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                          <MessageSquare className="mr-2 h-5 w-5" />
                          Quick Test
                        </CardTitle>
                        <CardDescription>
                          Test your chatbot with questions about your uploaded documents.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {uploadedFiles.length === 0 ? (
                          <div className="text-center py-8">
                            <Bot className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                            <p className="text-sm text-gray-500">
                              Upload a PDF file to start testing your chatbot
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {/* Chat Messages */}
                            <div 
                              id="chat-messages"
                              className="border rounded-lg p-3 h-64 overflow-y-auto bg-gray-50 space-y-3"
                            >
                              {messages.map((message, index) => (
                                <div
                                  key={index}
                                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                  <div>
                                    <div
                                      className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                                        message.type === 'user'
                                          ? 'bg-black text-white'
                                          : 'bg-white text-gray-900 border'
                                      }`}
                                    >
                                      {message.content}
                                    </div>
                                    {(message as any).fileName && (
                                      <p className="text-xs text-gray-400 mt-1 text-right">
                                        📄 {(message as any).fileName}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Input Area */}
                            <div className="flex gap-2">
                              <Input
                                placeholder="Ask about your documents..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
                                disabled={!uploadedFiles.some(f => f.status === 'ready')}
                              />
                              <Button 
                                onClick={handleSendMessage}
                                disabled={isSending || !inputMessage.trim() || !uploadedFiles.some(f => f.status === 'ready')}
                                className="relative overflow-hidden bg-black text-white hover:bg-gray-800 px-3"
                              >
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                                {isSending ? '...' : <Send className="h-4 w-4" />}
                              </Button>
                            </div>

                            {!uploadedFiles.some(f => f.status === 'ready') && uploadedFiles.length > 0 && (
                              <p className="text-xs text-gray-500 text-center">
                                Wait for files to finish processing...
                              </p>
                            )}

                            {/* Status Indicator */}
                            <div className="text-center">
                              <p className="text-xs text-gray-400">
                                {uploadedFiles.filter(f => f.status === 'ready').length} file(s) ready • Powered by ChatStack
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs would go here with similar structure */}
            {activeTab === 'text' && (
              <div className="max-w-4xl space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Add Text Content</h2>
                  <p className="text-sm text-gray-500">Directly input text content to train your chatbot.</p>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Text Training Data</CardTitle>
                    <CardDescription>Add custom text content for your chatbot to learn from</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      placeholder="Enter your training text here..."
                      className="min-h-[300px]"
                    />
                    <Button className="mt-4 relative overflow-hidden bg-black text-white hover:bg-gray-800">
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                      Add Text Content
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'website-embed' && (
              <div className="max-w-4xl space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Website Embed</h2>
                  <p className="text-sm text-gray-500">Get the embed code to add your chatbot to any website.</p>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="mr-2 h-5 w-5" />
                      Embed Code
                    </CardTitle>
                    <CardDescription>Copy this code and paste it into your website's HTML</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
                      <code>{`<script src="https://chatstack.co.za/embed.js"></script>
<div id="chatstack-widget" data-chatbot-id="${chatbotName.toLowerCase().replace(/\s+/g, '-')}"></div>`}</code>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex items-center">
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Code
                      </Button>
                      <Button variant="outline" className="flex items-center">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Placeholder for other tabs */}
            {!['overview', 'playground', 'files', 'text', 'website-embed'].includes(activeTab) && (
              <div className="max-w-4xl space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {activeTab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </h2>
                  <p className="text-sm text-gray-500">This section is coming soon!</p>
                </div>
                <Card>
                  <CardContent className="p-12 text-center">
                    <Settings className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
                    <p className="text-gray-500">This feature is currently under development.</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Floating Save Button */}
          <div className="fixed bottom-6 right-6 z-40">
            <Button
              onClick={handleSaveChatbot}
              disabled={isSaving}
              className="relative overflow-hidden bg-black text-white hover:bg-gray-800 shadow-lg"
              size="lg"
            >
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <Save className="mr-2 h-5 w-5" />
              {isSaving ? 'Saving...' : 'Save Chatbot'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}