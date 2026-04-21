"use client"

// Setup page — user picks role, level, language and company
// Claude generates 5 personalized questions before session starts
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "Mobile Developer",
  "QA Engineer",
]

const LEVELS = [
  { value: "junior", label: "Junior", description: "0-2 years" },
  { value: "mid", label: "Mid", description: "2-5 years" },
  { value: "senior", label: "Senior", description: "5+ years" },
]

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "he", label: "עברית" },
  { value: "ar", label: "العربية" },
]

export default function SetupPage() {
  const router = useRouter()
  const [role, setRole] = useState("Full Stack Developer")
  const [level, setLevel] = useState("mid")
  const [language, setLanguage] = useState("en")
  const [company, setCompany] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  // Show inline error instead of alert() — much better UX
  const [error, setError] = useState<string | null>(null)

  async function handleStart() {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, level, language, company: company.trim() }),
      })

      const data = await response.json()

      // Check for API-level errors — response can be 200 but still contain an error
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to generate questions")
      }

      // Validate that we actually got questions back
      if (!Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error("No questions were generated. Please try again.")
      }

      // Store config + questions in sessionStorage for the session page
      sessionStorage.setItem("sessionConfig", JSON.stringify({
        role,
        level,
        language,
        company: company.trim(),
        questions: data.questions,
      }))

      router.push("/session")

    } catch (err) {
      // Show error inline — no ugly browser alert()
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12 gap-6 max-w-2xl mx-auto">

      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Set up your interview</h1>
        <p className="text-muted-foreground">Claude will generate personalized questions for your role</p>
      </div>

      {/* Language */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base">Interview language</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          {LANGUAGES.map((l) => (
            <button
              key={l.value}
              onClick={() => setLanguage(l.value)}
              className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-all ${
                language === l.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {l.label}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Role */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base">Job role</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-1.5 rounded-full border text-sm transition-all ${
                role === r
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {r}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Level */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base">Experience level</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          {LEVELS.map((l) => (
            <button
              key={l.value}
              onClick={() => setLevel(l.value)}
              className={`flex-1 py-3 px-4 rounded-lg border text-left transition-all ${
                level === l.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <p className="text-sm font-medium">{l.label}</p>
              <p className={`text-xs mt-0.5 ${
                level === l.value ? "text-primary-foreground/70" : "text-muted-foreground"
              }`}>
                {l.description}
              </p>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Company — optional */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base">
            Target company{" "}
            <Badge variant="outline" className="text-xs ml-1">optional</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="text"
            placeholder="e.g. Google, Meta, startup..."
            value={company}
            maxLength={100}
            onChange={(e) => setCompany(e.target.value)}
            // Allow pressing Enter to start — natural UX
            onKeyDown={(e) => { if (e.key === "Enter" && !isLoading) handleStart() }}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Claude will tailor questions to this company's interview style
          </p>
        </CardContent>
      </Card>

      {/* Summary + start */}
      <Card className="w-full">
        <CardContent className="pt-4 flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            You'll be interviewed in{" "}
            <span className="font-medium text-foreground">
              {LANGUAGES.find(l => l.value === language)?.label}
            </span>{" "}
            for a{" "}
            <span className="font-medium text-foreground">{role}</span>{" "}
            position at{" "}
            <span className="font-medium text-foreground">{level}</span> level
            {company && (
              <>, targeting <span className="font-medium text-foreground">{company}</span></>
            )}.
          </p>

          {/* Inline error message — shown instead of alert() */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <Button
            size="lg"
            onClick={handleStart}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Generating your questions...
              </span>
            ) : (
              "Generate Questions & Start"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Claude will generate 5 personalized questions for your role
          </p>
        </CardContent>
      </Card>

    </main>
  )
}