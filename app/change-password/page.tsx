"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, X, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Set the session from stored tokens
  useEffect(() => {
    const accessToken = sessionStorage.getItem('reset_access_token');
    const refreshToken = sessionStorage.getItem('reset_refresh_token');
    
    if (accessToken && refreshToken) {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        setErrorMessage('Password update failed: ' + error.message);
      } else {
        setSuccessMessage('Password updated successfully!');
        // Clear stored tokens and redirect to login after 2 seconds
        sessionStorage.removeItem('reset_access_token');
        sessionStorage.removeItem('reset_refresh_token');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }

    setLoading(false);
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
            <CardTitle className="text-2xl font-bold text-gray-900">Change Password</CardTitle>
            <CardDescription className="text-gray-600">
              Update your password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => handleInputChange(setNewPassword, e.target.value)}
                    placeholder="Enter your new password"
                    required
                    className="w-full pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? 
                      <EyeOff className="w-5 h-5" /> : 
                      <Eye className="w-5 h-5" />
                    }
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => handleInputChange(setConfirmPassword, e.target.value)}
                    placeholder="Confirm your new password"
                    required
                    className="w-full pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? 
                      <EyeOff className="w-5 h-5" /> : 
                      <Eye className="w-5 h-5" />
                    }
                  </button>
                </div>
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
                className="w-full bg-black text-white relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-purple-600 after:rounded-b hover:bg-gray-800 transition-colors"
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600">
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Back to Sign In
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