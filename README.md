# Real-Time Exam Practice System

A mini real-time practice system for an educational platform that simulates a timed exam where students receive questions at fixed intervals and submit answers in real time.

## Features

- Join Session: Students can enter their name to join a live practice session
- Question Broadcast: The server automatically sends a new multiple-choice question every 30 seconds
- Live Timer: Displays a countdown timer (30 seconds) for each question
- Answer Submission: Students can select and submit their answer before the timer runs out
- Result Display: After the test ends (after 5 questions), displays the student's total score and feedback

## Technology Stack

- Frontend: Next.js (React)
- Backend: Node.js (in the same project using API routes)
- Realtime: Socket.IO for WebSocket communication
- Styling: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/manelsd/real-time-practice-system.git
   cd real-time-practice-system
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev:all
   # or
   yarn dev:all
   \`\`\`

4. Open [http://localhost:3000] with your browser to see the result.

## Deployment

This application is deployed on Vercel in this url: 

## Project Structure

- `/pages/api/socket.js` - WebSocket server implementation
- `/pages/index.js` - Main application page
- `/styles/globals.css` - Global styles

## How It Works

1. The server initializes a WebSocket connection when a user visits the page
2. When a user enters their name, they join a session
3. The server sends a new question every 30 seconds
4. The client displays a countdown timer for each question
5. Users select and submit their answers
6. After 5 questions, the final score is displayed

