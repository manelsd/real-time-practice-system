const WebSocket = require('ws');
const http = require('http');

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server is running');
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

const questions = [
  {
    questionNumber: 1,
    totalQuestions: 5,
    question: "What is the capital of France?",
    choices: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris"
  },
  {
    questionNumber: 2,
    totalQuestions: 5,
    question: "Which planet is known as the Red Planet?",
    choices: ["Earth", "Mars", "Jupiter", "Venus"],
    correctAnswer: "Mars"
  },
  {
    questionNumber: 3,
    totalQuestions: 5,
    question: "What is the largest mammal in the world?",
    choices: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: "Blue Whale"
  },
  {
    questionNumber: 4,
    totalQuestions: 5,
    question: "Who painted the Mona Lisa?",
    choices: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: "Leonardo da Vinci"
  },
  {
    questionNumber: 5,
    totalQuestions: 5,
    question: "What is the chemical symbol for gold?",
    choices: ["Ag", "Fe", "Au", "Cu"],
    correctAnswer: "Au"
  }
];

const users = new Map();

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received message:', data);
      
      switch (data.type) {
        case 'join':
          users.set(ws, {
            username: data.username,
            score: 0,
            currentQuestionIndex: 0,
            examCompleted: false
          });
          console.log(`User ${data.username} joined`);
          // Send first question after 1 second
          setTimeout(() => {
            sendQuestion(ws, 0);
          }, 1000);
          break;

        case 'answer':
          const user = users.get(ws);
          if (!user) {
            console.error('User not found for answer submission');
            return;
          }

          // Check if we're past the last question
          if (user.currentQuestionIndex >= questions.length) {
            console.log('Exam completed, ignoring additional answers');
            return;
          }

          const currentQuestion = questions[user.currentQuestionIndex];
          if (!currentQuestion) {
            console.error('No current question found for user');
            return;
          }

          console.log(`Processing answer for question ${currentQuestion.questionNumber}`);
          const isCorrect = data.answer === currentQuestion.correctAnswer;
          
          if (isCorrect) {
            user.score++;
          }

          // Send answer result
          ws.send(JSON.stringify({
            type: 'answerResult',
            result: {
              isCorrect,
              correctAnswer: currentQuestion.correctAnswer,
              currentScore: user.score,
              selectedAnswer: data.answer
            }
          }));

          // Move to next question or send final score
          user.currentQuestionIndex++;
          if (user.currentQuestionIndex < questions.length) {
            setTimeout(() => {
              sendQuestion(ws, user.currentQuestionIndex);
            }, 3000);
          } else {
            // Mark exam as completed
            user.examCompleted = true;
            // Send final score immediately
            ws.send(JSON.stringify({
              type: 'finalScore',
              score: {
                score: user.score,
                totalQuestions: questions.length
              }
            }));
          }
          break;
      }
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'An error occurred while processing your request'
      }));
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    users.delete(ws);
  });
});

function sendQuestion(ws, index) {
  try {
    const question = questions[index];
    if (!question) {
      console.error(`No question found at index ${index}`);
      return;
    }
    console.log(`Sending question ${question.questionNumber}`);
    ws.send(JSON.stringify({
      type: 'question',
      question: question
    }));
  } catch (error) {
    console.error('Error sending question:', error);
  }
}

// Start the server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 