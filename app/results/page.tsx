"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const ReactConfetti = dynamic(() => import('react-confetti'), {
  ssr: false
});

export default function ResultsPage() {
  const router = useRouter();
  const [score, setScore] = useState<{ score: number; totalQuestions: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Get the final score from sessionStorage
    const storedScore = sessionStorage.getItem('finalScore');
    if (storedScore) {
      setScore(JSON.parse(storedScore));
    } else {
      setError('No score found. Please complete the exam first.');
    }

    // Update window size on resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial window size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRestart = () => {
    sessionStorage.removeItem('finalScore');
    router.push('/');
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={handleRestart}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Start New Exam
          </button>
        </div>
      </div>
    );
  }

  if (!score) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading Results...</h1>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const percentage = Math.round((score.score / score.totalQuestions) * 100);
  const isPerfectScore = percentage === 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {isPerfectScore && isClient && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Exam Results</h1>
        
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-blue-600 mb-2">{percentage}%</div>
          <div className="text-gray-600">
            {score.score} out of {score.totalQuestions} questions correct
          </div>
        </div>

        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Start New Exam
        </button>
      </div>
    </div>
  );
} 