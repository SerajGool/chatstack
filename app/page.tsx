"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, MessageCircle, Globe, Smartphone, Calendar, Mail, FileText, Upload, BarChart3, Zap, Shield, Headphones } from "lucide-react";

export default function Index() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      setMessage("");
      alert("Thank you! We'll be in touch soon.");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              {/* ChatStack Logo */}
              <div className="relative">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F14a0147d933d4237a37c55c120ab8ac8%2F14fb08defbab4587b0d17424824d586e?format=webp&width=800"
                  alt="ChatStack Logo"
                  className="w-10 h-10 rounded-lg image-logo"
                />
              </div>
              <div className="text-3xl font-bold text-gray-900 ml-2">
                ChatStack
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#pricing" className="text-gray-900 hover:text-gray-600 transition-colors">Pricing</a>
              <a href="#resources" className="text-gray-900 hover:text-gray-600 transition-colors">Resources</a>
              <a href="#contact" className="text-gray-900 hover:text-gray-600 transition-colors">Contact</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="hidden md:inline-flex">Sign In</Button>
              </Link>
              <Link href="/get-started">
                <Button 
                  className="relative overflow-hidden bg-black text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-purple-600 hover:bg-gray-800 transition-colors"
                >Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Build intelligent<br/>
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  AI-powered <br/>
                  Chatbots
                </span><br/>
                for your business
              </h1>
              <p className="text-xl text-gray-500 mb-8">
                ChatStack is a fully self-service platform for building and deploying chatbots that understand your business and engage your customers
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                <Link href="/get-started">
                  <Button size="lg" className="relative overflow-hidden bg-black text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-purple-600 hover:bg-gray-800 transition-colors text-lg px-8 py-3">
                    Build Your Chatbot
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-sm text-gray-500">No credit card required</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <span>No coding required</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>AI-powered responses</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇿🇦</span>
                  <span>Proudly South African</span>
                </div>
              </div>
            </div>

            {/* Right Video Placeholder */}
            <div className="lg:order-last">
              <div className="bg-gray-200 rounded-2xl aspect-video flex items-center justify-center shadow-xl h-80 lg:h-96">
                <div className="text-center text-gray-500">
                  <svg className="w-24 h-24 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xl font-medium mb-2">Video Placeholder</p>
                  <p className="text-lg">Demo video will be placed here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20" style={{backgroundColor: 'rgba(155, 155, 155, 0.27)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Build Smart Chatbots
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From data training to deployment, ChatStack provides all the tools for creating intelligent customer support agents.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Easy Data Upload */}
            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Easy Data Upload</CardTitle>
                <CardDescription>
                  Simply upload your business documents, URLs, PDFs, FAQs, and policies to train your chatbot.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Website Integration */}
            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Website Integration</CardTitle>
                <CardDescription>
                  Seamlessly embed your chatbot on any website with a simple code snippet.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Social Media Integration */}
            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Social Media Integration</CardTitle>
                <CardDescription>
                  Connect to WhatsApp Business, Facebook Messenger, and Instagram for complete coverage.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Advanced Customization */}
            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Advanced Customization</CardTitle>
                <CardDescription>
                  Customize your chatbot's appearance, behavior, and responses to match your brand.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Rich Content Support */}
            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
               <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Rich Content Support</CardTitle>
                <CardDescription>
                  Support for images, videos, documents, and interactive elements in conversations.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Advanced Analytics */}
            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>
                  Track performance, user satisfaction, and conversation insights with detailed reports.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the perfect plan for your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="border-gray-200 bg-white hover:scale-105 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Free</CardTitle>
                <div className="text-4xl font-bold mt-4">R0</div>
                <CardDescription className="mt-2">Perfect for testing and small projects</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />1 Chatbot</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />100 Messages/month</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />Website Embedding</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />Basic Analytics</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />Community Support</li>
                </ul>
                <Link href="/get-started">
                  <Button className="w-full mt-6" variant="outline">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-black bg-white relative hover:scale-105 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-pulse hover:animate-none">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-black text-white">Most Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Pro</CardTitle>
                <div className="text-4xl font-bold mt-4">R499</div>
                <div className="text-sm text-gray-500">per month</div>
                <CardDescription className="mt-2">For growing businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />5 Chatbots</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />10,000 Messages/month</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />All Free features</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />META Integrations</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />Advanced Analytics</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />Priority Support</li>
                </ul>
                <Link href="/get-started">
                  <Button 
                    className="relative overflow-hidden w-full mt-6 bg-black text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-purple-600 hover:bg-gray-800 transition-colors"
                  >Subscribe</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-gray-200 bg-white hover:scale-105 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <div className="text-4xl font-bold mt-4">R799</div>
                <div className="text-sm text-gray-500">per month</div>
                <CardDescription className="mt-2">For large organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />Unlimited Chatbots</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />Unlimited Messages</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />All Pro features</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />Custom Integrations</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />White-label Solution</li>
                  <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />Dedicated Support</li>
                </ul>
                <Link href="/get-started">
                  <Button className="w-full mt-6" variant="outline">Contact Sales</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20" style={{backgroundColor: 'rgba(155, 155, 155, 0.27)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of businesses that trust ChatStack for their customer engagement
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {"★★★★★".split("").map((star, i) => (
                      <span key={i} className="text-lg">{star}</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "ChatStack transformed our customer support. We're now handling 3x more inquiries with the same team size, and our customers love the instant responses."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    SM
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">Sarah Mitchell</p>
                    <p className="text-sm text-gray-500">CEO, TechStart Solutions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {"★★★★★".split("").map((star, i) => (
                      <span key={i} className="text-lg">{star}</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "The WhatsApp integration is a game-changer. Our customers can now get support directly through their preferred messaging app. Setup was incredibly easy!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    JD
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">James Davidson</p>
                    <p className="text-sm text-gray-500">Operations Manager, Retail Plus</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {"★★★★★".split("").map((star, i) => (
                      <span key={i} className="text-lg">{star}</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "As a proudly South African business, we love supporting local innovation. ChatStack's AI is incredibly smart and understands our business context perfectly."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    LP
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">Lindiwe Patel</p>
                    <p className="text-sm text-gray-500">Founder, Ubuntu Consulting</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            The smartest way to automate your business — without the big agency price tag
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Use ChatStack to level the playing field and give your business the competitive, affordable and powerful edge that sets you apart from the rest
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-center mb-6">
            <Link href="/get-started">
              <Button size="lg" className="relative overflow-hidden bg-black text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-purple-600 hover:bg-gray-800 transition-colors px-8 py-3">
                Build Your Chatbot
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-sm text-gray-500">No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20" style={{backgroundColor: 'rgba(155, 155, 155, 0.27)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600">
              Have questions? We're here to help you succeed.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form - Left Side */}
            <Card className="border-gray-200">
              <CardContent className="p-8">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      required
                      className="w-full"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative overflow-hidden w-full bg-black text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-purple-600 hover:bg-gray-800 transition-colors"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information - Right Side */}
            <div className="space-y-6">
              {/* Email Section */}
              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Email</h4>
                      <p className="text-gray-600">Send us a message anytime</p>
                    </div>
                  </div>
                  <p className="text-blue-500 font-medium">hello@chatstack.co.za</p>
                </CardContent>
              </Card>

              {/* Call Us Section */}
              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Call Us</h4>
                      <p className="text-gray-600">Speak with our team</p>
                    </div>
                  </div>
                  <p className="text-blue-500 font-medium">+27 82 644 2228</p>
                  <p className="text-sm text-gray-500">Monday - Friday, 9:00 AM - 6:00 PM SAST</p>
                </CardContent>
              </Card>

              {/* Visit Us Section */}
              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Visit Us</h4>
                      <p className="text-gray-600">Come see us in person</p>
                    </div>
                  </div>
                  <p className="text-gray-700 font-medium">32 Edgeware Road Diepriver</p>
                  <p className="text-gray-700">Cape Town, South Africa</p>
                  <p className="text-sm text-gray-500 mt-2">By appointment only</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Enterprise Solutions */}
          <div className="mt-12">
            <Card className="border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
              <CardContent className="p-8 text-center text-white">
                <h3 className="text-2xl font-bold mb-4">Enterprise Solutions</h3>
                <p className="text-lg mb-6">
                  Need custom integrations, dedicated support, or white-label solutions?
                  Our enterprise team is ready to help scale your business.
                </p>
                <Button
                  className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-3"
                  onClick={() => window.location.href = "mailto:enterprise@chatstack.co.za"}
                >
                  Contact Enterprise Team
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F14a0147d933d4237a37c55c120ab8ac8%2F14fb08defbab4587b0d17424824d586e?format=webp&width=800"
                  alt="ChatStack Logo"
                  className="w-8 h-8 rounded-lg image-logo"
                />
                <span className="text-lg font-bold pl-2">ChatStack</span>
              </div>
              <p className="text-gray-400">
                Proudly made in South Africa 🇿🇦
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} ChatStack. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* Chatbot Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="bg-black hover:bg-gray-800 rounded-full w-14 h-14 shadow-2xl"
          onClick={() => alert("ChatStack demo chatbot would open here!")}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}