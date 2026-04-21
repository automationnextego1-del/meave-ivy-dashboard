import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Haal data op van de Mac Mini via environment variables
    const MAC_MINI_URL = process.env.MAC_MINI_URL || ''

    if (!MAC_MINI_URL) {
      // Return mock data als geen Mac Mini URL
      return NextResponse.json({
        ads: {
          campaigns: [],
          total_spend: 0,
          total_roas: 0
        },
        shopify: {
          total_orders: 0,
          total_revenue: 0,
          avg_order_value: 0,
          top_products: []
        },
        ga4: {
          sessions: 0,
          users: 0,
          pageviews: 0,
          channels: {},
          top_pages: []
        },
        knowledge: {
          last_updated: new Date().toLocaleDateString('nl-NL'),
          topics: 10
        },
        bots: []
      })
    }

    const res = await fetch(MAC_MINI_URL + '/api/data', {
      next: { revalidate: 300 }
    })
    const data = await res.json()
    return NextResponse.json(data)

  } catch {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
