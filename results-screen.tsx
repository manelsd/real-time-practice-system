"use client"

import { Button } from "./components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./components/ui/card"
import { useWebSocket } from "./hooks/useWebSocket"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"

export default function ResultsScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const username = searchParams.get('username') || ''
  const { finalScore } = useWebSocket(username)

  if (!finalScore) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  const handleRetakeExam = () => {
    router.push('/')
  }

  const getPerformanceMessage = () => {
    const percentage = (finalScore.score / finalScore.totalQuestions) * 100
    if (percentage >= 80) return "Excellent work! You've mastered the material."
    if (percentage >= 60) return "Good job! You have a solid understanding."
    return "Keep practicing! You'll improve with more experience."
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Real-Time Exam Practice System</h1>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-700">Exam Complete!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-6xl font-bold my-8 text-indigo-600">
              {finalScore.score} / {finalScore.totalQuestions}
            </div>

            <p className="text-lg mb-6">{getPerformanceMessage()}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 px-6"
              onClick={handleRetakeExam}
            >
              Take Another Exam
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
