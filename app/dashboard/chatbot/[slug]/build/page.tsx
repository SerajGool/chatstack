'use client'
// eslint-disable-next-line @typescript-eslint/no-explicit-any

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { 
  ArrowLeft,
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
  Send
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ChatbotBuilder({ params }: { params: { slug: string } }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [activeTab, setActiveTab] = useState('files')
  const [chatbotName, setChatbotName] = useState('')
  
  // File upload states
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  
  // Chat preview states
  const [showPreview, setShowPreview] = useState(false)
  const [messages, setMessages] = useState([
    { type: 'bot', content: 'Hi! I\'m your AI assistant. I can help answer questions about the documents you\'ve uploaded.' }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session?.user) {
        router.push('/login')
        return
      }
      
      setUser(session.user)
      setLoading(false)
      
      // Convert slug back to readable name
      const name = params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      setChatbotName(name)
      
      // Show success message if redirected from creation
      if (searchParams.get('success') === 'created') {
        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 5000)
      }
    }

    getUser()
  }, [router, params.slug, searchParams])

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true)
    
    for (const file of Array.from(files)) {
      // Create file entry first (outside try block)
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
            // For PDFs, use the existing question
            question = 'What is this document about? Please provide a brief summary.'
          } else if (file.type === 'text/plain') {
            // For TXT files, ask about the content
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
          
          // Update file status
          setUploadedFiles(prev => prev.map(f => 
            f.id === newFile.id 
              ? { ...f, status: 'ready', summary: result.answer }
              : f
          ))
          
        } catch (error) {
          // Update file status to error
          setUploadedFiles(prev => prev.map(f => 
            f.id === newFile.id 
              ? { ...f, status: 'error', error: 'Failed to process file' }
              : f
          ))
        }
      } else {
        // Add unsupported file with error
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

    // Add user message
    const userMessage = { type: 'user', content: inputMessage }
    setMessages(prev => [...prev, userMessage])
    
    const currentQuestion = inputMessage
    setInputMessage('')
    setIsSending(true)
    
    // Add loading message
    setMessages(prev => [...prev, { type: 'bot', content: '🤔 Let me check your documents...' }])
    
    try {
      // Get all ready files instead of just the first one
      const readyFiles = uploadedFiles.filter(f => f.status === 'ready')
      if (readyFiles.length === 0) {
        throw new Error('No processed files available')
      }
      
      // Use the most recently uploaded file (last in array)
      const latestFile = readyFiles[readyFiles.length - 1]
      
      const formData = new FormData()
      formData.append('file', latestFile.file)
      formData.append('question', currentQuestion)
      
      const response = await fetch('/api/ask', {
        method: 'POST',
        body: formData,
      })
      
      const result = await response.json()
      
      // Remove loading message and add real response
      setMessages(prev => {
        const withoutLoading = prev.slice(0, -1)
        const newMessages = [...withoutLoading, { 
          type: 'bot', 
          content: result.answer || 'Sorry, I had trouble processing that question.',
          fileName: latestFile.name 
        }]
        
        // Auto-scroll to bottom after state update
        setTimeout(() => {
          const chatContainer = document.querySelector('#chat-messages')
          if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight
          }
        }, 100)
        
        return newMessages
      })
      
    } catch (error) {
      // Remove loading message and add error
      setMessages(prev => {
        const withoutLoading = prev.slice(0, -1)
        const newMessages = [...withoutLoading, { type: 'bot', content: 'Sorry, there was an error processing your question.' }]
        
        // Auto-scroll on error too
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
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <p className="text-sm text-green-700 font-medium">
                Chatbot "{chatbotName}" created successfully!
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

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 p-0"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-lg font-semibold text-gray-900 mt-2">{chatbotName}</h1>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Training Data
            </h3>
            
            <button
              onClick={() => setActiveTab('files')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'files' 
                  ? 'text-gray-900 bg-gray-100' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <FileText className="mr-3 h-4 w-4" />
              Files
            </button>

            <button
              onClick={() => setActiveTab('text')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'text' 
                  ? 'text-gray-900 bg-gray-100' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="mr-3 h-4 w-4" />
              Text
            </button>

            <button
              onClick={() => setActiveTab('website')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'website' 
                  ? 'text-gray-900 bg-gray-100' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Globe className="mr-3 h-4 w-4" />
              Website
            </button>

            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-3">
              Configuration
            </h3>

            <button
              onClick={() => setActiveTab('instructions')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'instructions' 
                  ? 'text-gray-900 bg-gray-100' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Bot className="mr-3 h-4 w-4" />
              Instructions
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'settings' 
                  ? 'text-gray-900 bg-gray-100' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Settings className="mr-3 h-4 w-4" />
              Settings
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {activeTab === 'files' && 'Upload Files'}
                  {activeTab === 'text' && 'Add Text Content'}
                  {activeTab === 'website' && 'Train from Website'}
                  {activeTab === 'instructions' && 'Bot Instructions'}
                  {activeTab === 'settings' && 'Bot Settings'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {activeTab === 'files' && 'Upload documents to train your AI. Extract text from PDFs, DOCX, and TXT files.'}
                  {activeTab === 'text' && 'Add custom text content to train your chatbot.'}
                  {activeTab === 'website' && 'Enter website URLs to crawl and train from.'}
                  {activeTab === 'instructions' && 'Configure how your chatbot should behave and respond.'}
                  {activeTab === 'settings' && 'Customize your chatbot appearance and behavior.'}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex items-center">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button 
                  onClick={() => setShowPreview(true)}
                  className="relative overflow-hidden bg-black text-white hover:bg-gray-800">
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  <Eye className="mr-2 h-4 w-4" />
                  Test Chat
                </Button>
                <Button className="relative overflow-hidden bg-black text-white hover:bg-gray-800">
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {/* Files Tab */}
            {activeTab === 'files' && (
              <div className="max-w-7xl">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Left Side - Upload Documents (2/3 width) */}
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

                  {/* Right Side - Quick Test Chat (1/3 width) */}
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

            {/* Text Tab */}
            {activeTab === 'text' && (
              <div className="max-w-4xl">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Text Content</CardTitle>
                    <CardDescription>
                      Directly input text content to train your chatbot.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="text-content">Text Content</Label>
                      <Textarea
                        id="text-content"
                        placeholder="Enter your training text here..."
                        className="min-h-[300px] mt-2"
                      />
                    </div>
                    <Button className="relative overflow-hidden bg-black text-white hover:bg-gray-800">
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                      Add Text
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Website Tab */}
            {activeTab === 'website' && (
              <div className="max-w-4xl">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Link className="mr-2 h-5 w-5" />
                      Train from Website
                    </CardTitle>
                    <CardDescription>
                      Enter the link to a webpage and we will visit all the pages starting from it and list them for you to choose from.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="website-url">Website URL</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="website-url"
                          placeholder="https://example.com"
                          className="flex-1"
                        />
                        <Button className="relative overflow-hidden bg-black text-white hover:bg-gray-800">
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                          Crawl
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2">
                      {['Full Website', 'Webpage', 'PDF', 'Word Doc', 'Excel/CSV', 'Youtube', 'Freshdesk', 'Sitemap'].map((type) => (
                        <Button key={type} variant="outline" size="sm" className="text-xs">
                          {type}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Instructions Tab */}
            {activeTab === 'instructions' && (
              <div className="max-w-4xl space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Bot Instructions</CardTitle>
                    <CardDescription>
                      Configure how your chatbot should behave and respond to users.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="greeting">Greeting Message</Label>
                      <Input
                        id="greeting"
                        placeholder="How can I help you today?"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="instructions">Bot Instructions</Label>
                      <Textarea
                        id="instructions"
                        placeholder="You are a helpful customer support representative. Your objective is to answer questions and provide resources about..."
                        className="min-h-[200px] mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="max-w-4xl">
                <Card>
                  <CardHeader>
                    <CardTitle>Bot Settings</CardTitle>
                    <CardDescription>
                      Customize your chatbot's appearance and behavior.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="bot-name">Bot Name</Label>
                      <Input
                        id="bot-name"
                        value={chatbotName}
                        onChange={(e) => setChatbotName(e.target.value)}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="model">AI Model</Label>
                      <select className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md">
                        <option>GPT-4</option>
                        <option>GPT-3.5 Turbo</option>
                        <option>Claude</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Chat Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 h-[600px] flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{chatbotName}</h3>
                    <p className="text-sm text-gray-500">AI Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
                    placeholder="Ask something about your documents..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={uploadedFiles.length === 0}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isSending || !inputMessage.trim() || uploadedFiles.length === 0}
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                {uploadedFiles.length === 0 && (
                  <p className="text-xs text-gray-500 mt-2">Upload a PDF file first to start chatting</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}