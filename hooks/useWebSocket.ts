"use client"

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
  id: string;
  question: string;
  choices: string[];
  answer: string;
  questionNumber: number;
  totalQuestions: number;
}

interface AnswerResult {
  isCorrect: boolean;
  correctAnswer: string;
  currentScore: number;
  selectedAnswer: string;
}

export function useWebSocket(username: string) {
  const router = useRouter();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [finalScore, setFinalScore] = useState<{ score: number; totalQuestions: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const examCompleted = useRef(false);

  const connectWebSocket = () => {
    if (examCompleted.current) return;

    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('Connected to WebSocket server');
        setError(null);
        reconnectAttempts.current = 0;
        ws.send(JSON.stringify({ type: 'join', username }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received message:', data);
          
          switch (data.type) {
            case 'question':
              setCurrentQuestion(data.question);
              setAnswerResult(null);
              setTimeLeft(30);
              if (timerRef.current) clearInterval(timerRef.current);
              timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                  if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    return 0;
                  }
                  return prev - 1;
                });
              }, 1000);
              break;
            case 'answerResult':
              setAnswerResult(data.result);
              if (timerRef.current) clearInterval(timerRef.current);
              break;
            case 'finalScore':
              setFinalScore(data.score);
              examCompleted.current = true;
              if (timerRef.current) clearInterval(timerRef.current);
              // Store final score in sessionStorage
              sessionStorage.setItem('finalScore', JSON.stringify(data.score));
              // Navigate to results page
              router.push('/results');
              break;
            case 'error':
              setError(data.message || 'An error occurred on the server');
              break;
          }
        } catch (err) {
          console.error('Error parsing message:', err);
          setError('Error processing server response');
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Connection error. Please try again.');
      };

      ws.onclose = () => {
        console.log('Disconnected from WebSocket server');
        if (timerRef.current) clearInterval(timerRef.current);
        
        // Only attempt to reconnect if the exam is not completed
        if (!examCompleted.current && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})...`);
          setTimeout(connectWebSocket, 2000);
        } else if (!examCompleted.current) {
          setError('Unable to connect to server. Please refresh the page.');
        }
      };

      setSocket(ws);
    } catch (err) {
      console.error('Error creating WebSocket:', err);
      setError('Failed to connect to server. Please try again.');
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (socket) socket.close();
    };
  }, [username]);

  const submitAnswer = (answer: string) => {
    if (socket && currentQuestion) {
      try {
        socket.send(JSON.stringify({
          type: 'answer',
          questionNumber: currentQuestion.questionNumber,
          answer
        }));
      } catch (err) {
        console.error('Error submitting answer:', err);
        setError('Failed to submit answer. Please try again.');
      }
    }
  };

  return {
    socket,
    currentQuestion,
    answerResult,
    finalScore,
    timeLeft,
    error,
    submitAnswer
  };
} 