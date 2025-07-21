"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ResetPasswordConfirmPage() {
  const searchParams = useSearchParams();
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
  // Check if we have the necessary tokens from the URL hash
  const hash = window.location.hash.substring(1); // Remove the # symbol
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  
  if (accessToken && refreshToken) {
    setIsValidToken(true);
    // Store tokens for the change password page
    sessionStorage.setItem('reset_access_token', accessToken);
    sessionStorage.setItem('reset_refresh_token', refreshToken);
  }
}, []);

  if (!isValidToken) {
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
              <CardTitle className="text-2xl font-bold text-gray-900">Invalid Reset Link</CardTitle>
              <CardDescription className="text-gray-600">
                This password reset link is invalid or has expired.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Link href="/reset-password">
                  <Button className="w-full bg-black text-white relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-purple-600 after:rounded-b hover:bg-gray-800 transition-colors">
                    Request New Reset Link
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
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
            <CardTitle className="text-2xl font-bold text-gray-900">Confirm Your Password Reset</CardTitle>
            <CardDescription className="text-gray-600">
              Click the button below to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Link href="/change-password">
                <Button className="w-full bg-black text-white relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-purple-600 after:rounded-b hover:bg-gray-800 transition-colors">
                  Reset Password
                </Button>
              </Link>
            </div>

            <div className="text-center text-sm text-gray-600">
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