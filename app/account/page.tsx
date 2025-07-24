"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function AccountSettingsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentDisplayName, setCurrentDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Error fetching user:', error)
        router.push('/login')
        return
      }
      
      setCurrentUser(user)
      setCurrentEmail(user?.email || '')
      setCurrentDisplayName(user?.user_metadata?.full_name || user?.email?.split('@')[0] || '')
      setEmail(user?.email || '')
      setDisplayName(user?.user_metadata?.full_name || user?.email?.split('@')[0] || '')
    }

    fetchUserData()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        email: email,
        data: { full_name: displayName }
      })

      if (error) throw error

      alert('Account updated successfully!')
    } catch (error) {
      console.error('Account update failed', error);
      alert('Failed to update account settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
              required
              className="mt-2"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full relative overflow-hidden bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-md font-medium"
          >
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            {isSubmitting ? 'Updating...' : 'Save Changes'}
          </Button>

        </form>
      </CardContent>
    </Card>
  );
}