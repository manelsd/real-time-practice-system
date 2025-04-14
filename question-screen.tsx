"use client"

import { Button } from "./components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "./components/ui/card"
import { useWebSocket } from "./hooks/useWebSocket"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

export default function QuestionScreen() {
  const searchParams = useSearchParams()
  const username = searchParams.get('username') || ''
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const { currentQuestion, timeLeft, submitAnswer, error } = useWebSocket(username)

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-red-600 text-center mb-4">{error}</div>
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-xl">Connecting to server...</div>
      </div>
    )
  }

  const handleSubmit = () => {
    if (selectedAnswer) {
      submitAnswer(selectedAnswer)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Real-Time Exam Practice System</h1>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="text-sm font-medium text-gray-500">
              Question {currentQuestion.questionNumber} of {currentQuestion.totalQuestions}
            </div>
            <div className="text-lg font-bold text-indigo-600">Time: {timeLeft}s</div>
          </CardHeader>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-6">{currentQuestion.question}</h2>

            <div className="space-y-3 mb-6">
              {currentQuestion.choices.map((choice, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-md cursor-pointer transition-colors ${
                    selectedAnswer === choice
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-300 hover:border-indigo-300"
                  }`}
                  onClick={() => setSelectedAnswer(choice)}
                >
                  {choice}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700" 
              disabled={!selectedAnswer || timeLeft === 0}
              onClick={handleSubmit}
            >
              Submit Answer
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
