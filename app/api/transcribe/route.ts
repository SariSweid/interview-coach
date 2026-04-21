// Forwards audio from the browser to the Python Whisper service
// The browser can't call Python directly (CORS + security),
// so all requests go through Next.js first
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000"

export async function POST(request: Request) {
  const formData = await request.formData()

  const response = await fetch(`${AI_SERVICE_URL}/transcribe`, {
    method: "POST",
    body: formData,
  })

  const data = await response.json()
  return Response.json(data)
}