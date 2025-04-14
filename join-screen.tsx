"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function JoinScreen() {
  const [username, setUsername] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      router.push(`/question?username=${encodeURIComponent(username)}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Real-Time Exam Practice System</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center text-indigo-700">Join Exam Session</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Your Name</Label>
                <Input 
                  id="username" 
                  placeholder="Enter your name" 
                  className="w-full"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                Start Exam
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
