import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  return Response.json({ message: "Hello from TypeScript API" })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  return Response.json({ received: body })
}