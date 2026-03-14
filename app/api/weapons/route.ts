import { NextRequest } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_OPEN5E_BASE! + "/v2/weapons/";

export async function GET(req: NextRequest) {
  // Propaga eventuali query (?search=..., ?ordering=...)
  const url = new URL(BASE_URL);
  req.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    // Facoltativo: headers se l’API richiede formati specifici
    headers: {
      Accept: "application/json",
    },
    // Evita cache sporca (regola secondo esigenza)
    cache: "no-store",
  });

  if (!res.ok) {
    return Response.json(
      { error: "Fetch fallito", status: res.status },
      { status: res.status }
    );
  }

  const data = await res.json();

  return Response.json(data, {
    headers: {
      "Cache-Control": "public, max-age=300", // 5 minuti (regolabile)
    },
  });
}