"use client"

import { Button } from "./components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "./components/ui/card"
import { useWebSocket } from "./hooks/useWebSocket"
import { useSearchParams } from "next/navigation"

export default function AnswerResultScreen() {
  const searchParams = useSearchParams()
  const username = searchParams.get('username') || ''
  const { currentQuestion, answerResult } = useWebSocket(username)

  if (!currentQuestion || !answerResult) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-xl">Loading...</div>
      </div>
    )
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
            <div className="text-lg font-bold text-gray-600">Waiting for next question...</div>
          </CardHeader>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-6">{currentQuestion.question}</h2>

            <div className="space-y-3 mb-6">
              {currentQuestion.choices.map((choice, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-md ${
                    choice === answerResult.correctAnswer
                      ? "border-green-500 bg-green-50"
                      : answerResult.selectedAnswer === choice && !answerResult.isCorrect
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                  }`}
                >
                  {choice}
                </div>
              ))}
            </div>

            <div className={`p-4 mb-6 rounded-md ${
              answerResult.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {answerResult.isCorrect ? "Correct! Well done." : "Incorrect. Better luck next time!"}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-gray-400 cursor-not-allowed" disabled>
              Submitted
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
