import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Static data for features and question types — keeps JSX clean and makes it easy to update content without changing layout
const features = [
  {
    title: "Real-time transcription",
    description: "Groq Whisper large-v3 converts your speech to text instantly — supports English, Hebrew, and Arabic.",
    icon: "🎙️",
  },
  {
    title: "AI answer analysis",
    description: "Claude scores your answer on relevance, STAR method, specificity and conciseness.",
    icon: "🤖",
  },
  {
    title: "Filler word detection",
    description: "Tracks um, uh, like, so and highlights them in your transcript automatically.",
    icon: "⚡",
  },
  {
    title: "Session report",
    description: "Full performance breakdown across all questions after every session.",
    icon: "📊",
  },
]

const questionTypes = ["Behavioral", "Technical", "Situational", "Leadership"]

// This is a Server Component — no "use client" needed
// It has no state or browser interactions, so Next.js renders it on the server (faster)
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">

      {/* Hero section */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 gap-6">

        {/* Gradient title — professional purple/blue accent */}
        <h1 className="text-5xl sm:text-6xl font-bold leading-tight max-w-2xl">
          Ace your next{" "}
          <span className="bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
            interview
          </span>
        </h1>

        <Badge variant="outline" className="px-4 py-1 text-xs tracking-wide relative -top-6">
          Powered by Claude + Groq
        </Badge>

        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
          Practice with AI that watches, listens, and gives you honest feedback — 
          just like a real interviewer would.
        </p>

        <div className="flex gap-3 mt-2">
          <Link href="/setup">
            <Button size="lg" className="px-8 text-base">
              Start Practicing
            </Button>
          </Link>
          <Link href="/summary">
            <Button size="lg" variant="outline" className="px-8 text-base">
              Last Session
            </Button>
          </Link>
        </div>

        {/* Subtle stat row */}
        <div className="flex gap-8 mt-6 text-center">
          {[
            { value: "4", label: "Question types" },
            { value: "3", label: "Languages" },
            { value: "4", label: "Scored dimensions" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-border" />

      {/* Features grid */}
      <section className="flex flex-col items-center px-4 py-16 gap-8">
        <h2 className="text-2xl font-bold text-center">Everything you need to prepare</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
          {features.map((f) => (
            <Card key={f.title} className="hover:border-border/80 transition-colors">
              <CardContent className="pt-6 flex flex-col gap-2">
                <span className="text-2xl">{f.icon}</span>
                <p className="font-medium">{f.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="flex flex-col items-center px-4 py-16 gap-4 text-center">
        <h2 className="text-2xl font-bold">Ready to practice?</h2>
        <p className="text-muted-foreground">It takes 5 minutes. No signup required.</p>
        <Link href="/session">
          <Button size="lg" className="px-8 mt-2">Start Interview</Button>
        </Link>
      </section>

    </main>
  )
}