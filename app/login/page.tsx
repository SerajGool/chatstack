"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, X, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setErrorMessage('Login failed: ' + error.message);
      } else {
        setSuccessMessage('Login successful!');
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        setErrorMessage('Google login failed: ' + error.message);
      }
    } catch (error) {
      setErrorMessage('An error occurred with Google login. Please try again.');
    }
  };

  const handleInputChange = (setter: any, value: string) => {
    setErrorMessage(''); // Clear error when user starts typing
    setter(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F14a0147d933d4237a37c55c120ab8ac8%2F14fb08defbab4587b0d17424824d586e?format=webp&width=800"
              alt="ChatStack Logo"
              className="w-10 h-10 rounded-lg"
            />
            <span className="text-2xl font-bold text-gray-900">ChatStack</span>
          </div>
        </div>

        <Card className="border-gray-200 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleInputChange(setEmail, e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => handleInputChange(setPassword, e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? 
                      <EyeOff className="w-5 h-5" /> : 
                      <Eye className="w-5 h-5" />
                    }
                  </button>
                </div>
              </div>

              <div className="text-right">
                <Link href="/reset-password" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot Password?
                </Link>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg p-3">
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="relative overflow-hidden w-full bg-black text-white relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-purple-600 after:rounded-b hover:bg-gray-800 transition-colors"
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleGoogleSignIn}
                  className="relative overflow-hidden w-full bg-black text-white relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-purple-600 after:rounded-b hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </Button>
              </div>
            </div>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/get-started" className="text-blue-600 hover:text-blue-800 font-medium">
                Get started for free
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Message Popup */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-top-2 duration-300">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{successMessage}</span>
          <button
            onClick={() => setSuccessMessage('')}
            className="ml-2 text-green-200 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}