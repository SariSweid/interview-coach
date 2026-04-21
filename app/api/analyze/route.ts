// Forwards the transcript + question to Python for Claude analysis
// Keeps the Python service URL hidden from the browser
export async function POST(request: Request) {
  const body = await request.json()

  const response = await fetch("http://localhost:8000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  const data = await response.json()
  return Response.json(data)
}