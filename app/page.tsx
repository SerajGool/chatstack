"use client"
import { useState } from 'react';
import { MessageCircle, Zap, Shield, Users, Check, Star, ArrowRight, Menu, X } from 'lucide-react';

export default function ChatStackLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('pro');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ChatStack
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#pricing" className="text-slate-600 hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#about" className="text-slate-600 hover:text-blue-600 transition-colors">About</a>
              <button 
  onClick={() => window.location.href = '/login'}
  className="text-slate-600 hover:text-blue-600 transition-colors"
>
  Login
</button>
              <button 
  onClick={() => window.location.href = '/login'}
  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
>
  Sign Up Free
</button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200">
            <div className="px-4 py-2 space-y-2">
              <a href="#features" className="block py-2 text-slate-600">Features</a>
              <a href="#pricing" className="block py-2 text-slate-600">Pricing</a>
              <a href="#about" className="block py-2 text-slate-600">About</a>
              <button className="block w-full text-left py-2 text-slate-600">Login</button>
              <button className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg mt-2">
                Sign Up Free
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Build Smart AI Chatbots for
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              South African Businesses
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Create intelligent chatbots that integrate seamlessly with WhatsApp Business, Facebook Messenger, and Instagram. 
            Perfect for South African SMEs - no coding required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all flex items-center justify-center">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button className="border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-slate-50 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Everything You Need to Automate Customer Service
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Built specifically for South African businesses. Easy to set up, powerful to use.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">WhatsApp Business Integration</h3>
            <p className="text-slate-600">
              Connect directly to WhatsApp Business API. Handle customer inquiries, bookings, and support automatically.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">No-Code Setup</h3>
            <p className="text-slate-600">
              Build sophisticated chatbots without any technical knowledge. Drag, drop, and you're done.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Local Support</h3>
            <p className="text-slate-600">
              Built by South Africans, for South Africans. Full local support and understanding of local business needs.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Multi-Platform</h3>
            <p className="text-slate-600">
              Deploy across WhatsApp, Facebook Messenger, Instagram, and your website from one dashboard.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Smart Booking System</h3>
            <p className="text-slate-600">
              Accept appointments, manage calendars, and send reminders automatically through your chatbot.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Payment Integration</h3>
            <p className="text-slate-600">
              Accept payments directly through your chatbot with local payment methods and secure processing.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Start free, scale as you grow. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Free Plan */}
            <div className="bg-slate-50 p-8 rounded-xl border-2 border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Free</h3>
              <div className="text-3xl font-bold text-slate-900 mb-4">R0<span className="text-sm font-normal text-slate-600">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2" />1 Chatbot</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2" />100 messages/month</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2" />Basic templates</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2" />Email support</li>
              </ul>
              <button className="w-full bg-slate-200 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-300 transition-colors">
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl border-2 border-blue-200 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Pro</h3>
              <div className="text-3xl font-bold text-slate-900 mb-4">R299<span className="text-sm font-normal text-slate-600">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2" />5 Chatbots</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2" />5,000 messages/month</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2" />WhatsApp integration</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2" />Priority support</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2" />Analytics dashboard</li>
              </ul>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                Start Free Trial
              </button>
            </div>

            {/* Pro+ Plan */}
            <div className="bg-slate-50 p-8 rounded-xl border-2 border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Pro+</h3>
              <div className="text-3xl font-bold text-slate-900 mb-4">R599<span className="text-sm font-normal text-slate-600">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2" />15 Chatbots</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2" />20,000 messages/month</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2" />All integrations</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2" />Payment processing</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2" />Custom branding</li>
              </ul>
              <button className="w-full bg-slate-200 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-300 transition-colors">
                Choose Pro+
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-slate-50 p-8 rounded-xl border-2 border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Enterprise</h3>
              <div className="text-3xl font-bold text-slate-900 mb-4">Custom</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2" />Unlimited chatbots</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2" />Unlimited messages</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2" />Dedicated support</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2" />Custom integrations</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2" />SLA guarantee</li>
              </ul>
              <button className="w-full bg-slate-200 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-300 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Customer Service?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of South African businesses already using ChatStack to automate their customer interactions.
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all">
            Start Your Free Trial Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ChatStack</span>
              </div>
              <p className="text-slate-400">
                Empowering South African businesses with intelligent chatbot solutions.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 ChatStack. All rights reserved. Made with ❤️ in South Africa.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}