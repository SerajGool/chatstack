"use client"
import { useState } from 'react';
import { MessageCircle, Upload, Settings, BarChart3, Users, FileText, Send, User, Bot, LogOut } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('playground');
  const [messages, setMessages] = useState([
    { type: 'bot', content: 'Hi! I\'m your PDF assistant. Upload a PDF and I\'ll help you chat with it!' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleSendMessage = async () => {
    if (inputMessage.trim() && uploadedFile) {
      // Add user message immediately
      const userMessage = { type: 'user', content: inputMessage };
      setMessages(prev => [...prev, userMessage]);
      
      const currentQuestion = inputMessage;
      setInputMessage('');
      
      // Add loading message
      setMessages(prev => [...prev, { type: 'bot', content: '🤔 Let me check your PDF...' }]);
      
      try {
        // Create form data to send to API
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('question', currentQuestion);
        
        // Call your API
        const response = await fetch('/api/ask', {
          method: 'POST',
          body: formData,
        });
        
        const result = await response.json();
        
        // Remove loading message and add real response
        setMessages(prev => {
          const withoutLoading = prev.slice(0, -1);
          return [...withoutLoading, { type: 'bot', content: result.answer || 'Sorry, I had trouble processing that.' }];
        });
        
      } catch (error) {
        // Remove loading message and add error
        setMessages(prev => {
          const withoutLoading = prev.slice(0, -1);
          return [...withoutLoading, { type: 'bot', content: 'Sorry, there was an error processing your question.' }];
        });
      }
    } else if (!uploadedFile) {
      setMessages(prev => [...prev, { type: 'bot', content: 'Please upload a PDF first!' }]);
    }
  };

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setMessages([...messages, 
        { type: 'system', content: `📄 PDF uploaded: ${file.name}` },
        { type: 'bot', content: 'Great! I\'ve processed your PDF. What would you like to know about it?' }
      ]);
    }
  };

  const tabs = [
    { id: 'playground', label: 'Playground', icon: MessageCircle },
    { id: 'activity', label: 'Activity', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'sources', label: 'Sources', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ChatStack
                </span>
              </div>
              <div className="text-slate-400">|</div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-slate-700 font-medium">PDF Assistant</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-slate-600 hover:text-slate-900 transition-colors">
                <Users className="w-5 h-5" />
              </button>
              <button className="text-slate-600 hover:text-slate-900 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        {activeTab === 'playground' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel - Configuration */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">PDF Upload</h3>
                
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">Upload your PDF to start chatting</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label
                    htmlFor="pdf-upload"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    Choose PDF File
                  </label>
                </div>

                {uploadedFile && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm">
✅ {uploadedFile ? (uploadedFile as any).name : 'File'} uploaded successfully                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Chat Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Model
                    </label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>GPT-4</option>
                      <option>GPT-3.5 Turbo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Temperature: 0.7
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      defaultValue="0.7"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>Reserved</span>
                      <span>Creative</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      System Prompt
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="You are a helpful PDF assistant..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Chat Interface */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-fit">
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">PDF Assistant</h3>
                    <p className="text-sm text-slate-500">Ready to help with your documents</p>
                  </div>
                </div>
              </div>

              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : message.type === 'system'
                          ? 'bg-slate-100 text-slate-600 text-sm'
                          : 'bg-slate-100 text-slate-900'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-slate-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask something about your PDF..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="px-4 pb-4">
                <p className="text-xs text-slate-500 text-center">
                  Powered by ChatStack
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Other Tab Content */}
        {activeTab !== 'playground' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h3>
            <p className="text-slate-600">
              This section will be built by your programmer. Coming soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}