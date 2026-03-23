import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id || !/^[A-Z0-9]+$/i.test(id)) {
    return new NextResponse('Bad request', { status: 400 })
  }

  try {
    const res = await fetch(
      `https://data.stortinget.no/eksport/personbilde?personid=${id}&storrelse=lite`,
      { next: { revalidate: 86400 } }
    )
    if (!res.ok) return new NextResponse('Not found', { status: 404 })

    const buffer = await res.arrayBuffer()
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch {
    return new NextResponse('Error', { status: 500 })
  }
}
