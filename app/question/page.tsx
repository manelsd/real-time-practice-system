"use client"

import dynamic from 'next/dynamic'

const QuestionScreen = dynamic(() => import('../../question-screen'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="text-xl">Loading...</div>
    </div>
  )
})

export default function QuestionPage() {
  return <QuestionScreen />
} 