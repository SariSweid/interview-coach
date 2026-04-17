export async function GET() {
  const response = await fetch("http://localhost:8000/health")
  const data = await response.json()

  return Response.json({
    nextjs: "ok",
    python: data.status,
  })
}