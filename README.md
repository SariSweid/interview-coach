# Interview Coach — AI-Powered Interview Practice

Practice job interviews with real-time AI feedback on your answers, speech patterns, and communication style.

🔗 **Live Demo:** [your-url-here.vercel.app](https://your-url-here.vercel.app)

## What it does

- 🎙️ **Voice recording** — answer questions out loud, just like a real interview
- ⚡ **Instant transcription** — Groq Whisper large-v3 converts speech to text in seconds
- 🤖 **AI feedback** — Claude analyzes your answer on 4 dimensions: relevance, STAR method, specificity, conciseness
- 🌍 **Multilingual** — supports English, Hebrew, and Arabic
- 📝 **Filler word detection** — tracks um, uh, like, so and highlights them in your transcript
- 🎯 **Role-specific questions** — Claude generates tailored questions based on your job role, level, and target company (optional)
- 📊 **Session summary** — full performance report after each session

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend (Python AI Service)
- FastAPI
- Groq Whisper large-v3 (speech-to-text)
- Anthropic Claude Haiku (answer analysis)

