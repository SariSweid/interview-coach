// This route acts as a bridge — it calls our Python service
// and returns the status of both services together
export async function GET() {
  const response = await fetch("http://localhost:8000/health")
  const data = await response.json()

  return Response.json({
    nextjs: "ok",
    python: data.status,
  })
}