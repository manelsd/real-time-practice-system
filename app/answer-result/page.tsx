"use client"

import dynamic from 'next/dynamic'

const AnswerResultScreen = dynamic(() => import('../../answer-result'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="text-xl">Loading...</div>
    </div>
  )
})

export default function AnswerResultPage() {
  return <AnswerResultScreen />
} 