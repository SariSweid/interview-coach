// Forwards audio from the browser to the Python Whisper service
// The browser can't call Python directly (CORS + security),
// so all requests go through Next.js first
export async function POST(request: Request) {
  const formData = await request.formData()

  const response = await fetch("http://localhost:8000/transcribe", {
    method: "POST",
    body: formData,
  })

  const data = await response.json()
  return Response.json(data)
}