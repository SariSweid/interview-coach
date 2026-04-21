import Anthropic from "@anthropic-ai/sdk"

// Initialize Claude client once at module level — not on every request
const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Valid options — used for input validation
const VALID_LEVELS = ["junior", "mid", "senior"]
const VALID_LANGUAGES = ["en", "he", "ar"]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { role, level, language, company } = body

    // Validate required fields — don't send garbage to Claude
    if (!role || typeof role !== "string") {
      return Response.json({ error: "Role is required" }, { status: 400 })
    }

    if (!VALID_LEVELS.includes(level)) {
      return Response.json({ error: "Invalid level" }, { status: 400 })
    }

    if (!VALID_LANGUAGES.includes(language)) {
      return Response.json({ error: "Invalid language" }, { status: 400 })
    }

    // Sanitize inputs — trim whitespace, limit length to prevent prompt injection
    const cleanRole = role.trim().slice(0, 100)
    const cleanCompany = company ? company.trim().slice(0, 100) : ""

    // Build language instruction for Claude
    const langInstruction =
      language === "he" ? "Write all questions in Hebrew (עברית)." :
      language === "ar" ? "Write all questions in Arabic (العربية)." :
      "Write all questions in English."

    // Only add company context if provided
    const companyContext = cleanCompany
      ? `The candidate is targeting ${cleanCompany}. Tailor questions to reflect ${cleanCompany}'s known interview style and tech stack.`
      : ""

    const prompt = `You are a senior technical interviewer at a top tech company.
Generate exactly 5 interview questions for a ${level} ${cleanRole} candidate.
${companyContext}
${langInstruction}

Requirements:
- Mix of question types: 2 behavioral, 2 technical, 1 situational
- Technical questions must be specific to ${cleanRole} — real tools, frameworks, concepts
- Behavioral questions should reveal problem-solving and teamwork
- Difficulty appropriate for ${level} level
- For senior level, include system design or architecture questions
- Questions should feel like a real interview, not generic

Return ONLY a valid JSON array, no explanation, no markdown:
[
  { "type": "Behavioral", "text": "question here" },
  { "type": "Technical", "text": "question here" },
  { "type": "Technical", "text": "question here" },
  { "type": "Situational", "text": "question here" },
  { "type": "Behavioral", "text": "question here" }
]`

    const message = await claude.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    })

    // Extract text — type assertion needed because SDK returns union type
    const raw = (message.content[0] as { type: "text"; text: string }).text.trim()

    // Strip markdown fences if Claude wraps JSON in them
    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim()

    // Parse and validate the response is actually an array
    const questions = JSON.parse(cleaned)

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Claude returned invalid question format")
    }

    return Response.json({ questions })

  } catch (error) {
    // Handle JSON parse errors from Claude separately
    if (error instanceof SyntaxError) {
      console.error("Claude returned invalid JSON for questions")
      return Response.json(
        { error: "Failed to generate questions — invalid AI response" },
        { status: 500 }
      )
    }

    console.error("Generate questions error:", error)
    return Response.json(
      { error: "Failed to generate questions. Please try again." },
      { status: 500 }
    )
  }
}