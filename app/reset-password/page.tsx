"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `https://chatstack.co.za/reset-password-confirm`,
});

      if (error) {
        setErrorMessage('Reset failed: ' + error.message);
      } else {
        setSuccessMessage('Password reset email sent successfully!');
        setIsEmailSent(true);
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }

    setLoading(false);
  };

  const handleInputChange = (value: string) => {
    setErrorMessage(''); // Clear error when user starts typing
    setEmail(value);
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
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
              <CardTitle className="text-2xl font-bold text-gray-900">Check your email</CardTitle>
              <CardDescription className="text-gray-600">
                We've sent password reset instructions to {email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center text-sm text-gray-600">
                <p className="mb-4">
                  Click the link in the email to reset your password. The link will expire in 24 hours.
                </p>
                <p>
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => {
                      setIsEmailSent(false);
                      setEmail("");
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    try again
                  </button>
                </p>
              </div>
              
              <div className="text-center">
                <Link href="/login">
                  <Button className="w-full bg-black text-white relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-purple-600 after:rounded-b hover:bg-gray-800 transition-colors">
                    Back to Sign In
                  </Button>
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
            <CardTitle className="text-2xl font-bold text-gray-900">Reset Password</CardTitle>
            <CardDescription className="text-gray-600">
              Enter your email to receive instructions on how to reset your password.
            </CardDescription>
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
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full"
                />
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
                {loading ? "Sending..." : "Reset Password"}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600">
              Remember your password?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}