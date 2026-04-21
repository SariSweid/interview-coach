"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

// Same verdict colors as session page
const verdictColors: Record<string, string> = {
  strong: "bg-green-100 text-green-800",
  good: "bg-blue-100 text-blue-800",
  needs_work: "bg-yellow-100 text-yellow-800",
  poor: "bg-red-100 text-red-800",
}

type QuestionResult = {
  question: string
  type: string
  transcript: string
  fillerCount: number
  analysis: {
    overall_score: number
    verdict: string
    dimensions: {
      relevance: { score: number; feedback: string }
      star_method: { score: number; feedback: string }
      specificity: { score: number; feedback: string }
      conciseness: { score: number; feedback: string }
    }
    top_strength: string
    top_improvement: string
  }
}

type SessionConfig = {
  role: string
  level: string
  company: string
}

export default function SummaryPage() {
  const [results, setResults] = useState<QuestionResult[]>([])
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null)

  // Load results and session config from storage on mount
  useEffect(() => {
    try {
      // Try sessionStorage first (fresh session), fall back to localStorage (last session)
      const stored = sessionStorage.getItem("interviewResults") || localStorage.getItem("lastSession")
      if (stored) setResults(JSON.parse(stored))

      // Load session config to show role/company context
      const config = sessionStorage.getItem("sessionConfig")
      if (config) setSessionConfig(JSON.parse(config))
    } catch {
      // If storage data is corrupted, just show empty state
      console.error("Failed to load session data")
    }
  }, [])

  // Empty state — no results found
  if (results.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center gap-4 flex flex-col">
          <p className="text-muted-foreground">No session data found.</p>
          {/* Go to setup, not session directly */}
          <Link href="/setup">
            <Button>Start an Interview</Button>
          </Link>
        </div>
      </main>
    )
  }

  // Calculate overall average score across all questions
  const avgScore = Math.round(
    results.reduce((sum, r) => sum + r.analysis.overall_score, 0) / results.length
  )

  // Calculate average per dimension across all questions
  const avgDimensions = {
    relevance: Math.round(results.reduce((sum, r) => sum + r.analysis.dimensions.relevance.score, 0) / results.length),
    star_method: Math.round(results.reduce((sum, r) => sum + r.analysis.dimensions.star_method.score, 0) / results.length),
    specificity: Math.round(results.reduce((sum, r) => sum + r.analysis.dimensions.specificity.score, 0) / results.length),
    conciseness: Math.round(results.reduce((sum, r) => sum + r.analysis.dimensions.conciseness.score, 0) / results.length),
  }

  const totalFillers = results.reduce((sum, r) => sum + r.fillerCount, 0)

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-16 gap-8 max-w-3xl mx-auto">

      <div className="w-full text-center">
        <h1 className="text-3xl font-bold mb-2">Session Complete</h1>
        {/* Show role/company context if available */}
        {sessionConfig ? (
          <p className="text-muted-foreground">
            {sessionConfig.role} · {sessionConfig.level}
            {sessionConfig.company && ` · ${sessionConfig.company}`}
          </p>
        ) : (
          <p className="text-muted-foreground">
            {results.length} questions answered
          </p>
        )}
      </div>

      {/* Overall score card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base">Overall Performance</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">

          {/* Big score + stats */}
          <div className="flex items-center justify-between">
            <span className="text-5xl font-bold">
              {avgScore}
              <span className="text-2xl text-muted-foreground">/10</span>
            </span>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{results.length} questions answered</p>
              <p className="text-sm text-muted-foreground">{totalFillers} total filler words</p>
            </div>
          </div>

          {/* Average dimension scores */}
          {Object.entries(avgDimensions).map(([key, score]) => (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize text-muted-foreground">{key.replace("_", " ")}</span>
                <span className="font-medium">{score}/10</span>
              </div>
              <Progress value={score * 10} className="h-1.5" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Per-question breakdown */}
      <div className="w-full flex flex-col gap-4">
        <h2 className="text-lg font-medium">Question Breakdown</h2>
        {results.map((result, i) => (
          <Card key={i} className="w-full">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{result.type}</Badge>
                  <span className="text-xs text-muted-foreground">Q{i + 1}</span>
                </div>
                <CardTitle className="text-sm font-medium leading-relaxed">
                  {result.question}
                </CardTitle>
              </div>
              {/* Verdict badge */}
              <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${verdictColors[result.analysis.verdict]}`}>
                {result.analysis.verdict.replace("_", " ")} · {result.analysis.overall_score}/10
              </span>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {/* Only show transcript if it's not empty */}
              {result.transcript && (
                <p className="text-xs text-muted-foreground italic">
                  "{result.transcript}"
                </p>
              )}
              <div className="flex gap-4 text-xs pt-1">
                <span className="text-yellow-700">{result.fillerCount} filler words</span>
              </div>
              {/* Key feedback */}
              <div className="border-t pt-2 flex flex-col gap-1 mt-1">
                <p className="text-xs">
                  <span className="font-medium text-green-700">Strength: </span>
                  <span className="text-muted-foreground">{result.analysis.top_strength}</span>
                </p>
                <p className="text-xs">
                  <span className="font-medium text-yellow-700">Improve: </span>
                  <span className="text-muted-foreground">{result.analysis.top_improvement}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {/* Go to setup for a fresh session with new questions */}
        <Link href="/setup">
          <Button>Practice Again</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Home</Button>
        </Link>
      </div>

    </main>
  )
}