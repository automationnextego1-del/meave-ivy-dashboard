'use client'

import { useState, useEffect } from 'react'

interface DashboardData {
  ads: {
    campaigns: Array<{
      name: string
      spend: number
      ctr: number
      cpc: number
      roas: number
      days: number
      ads: Array<{
        ad_name: string
        spend: number
        ctr: number
        cpc: number
      }>
    }>
    total_spend: number
    total_roas: number
  }
  shopify: {
    total_orders: number
    total_revenue: number
    avg_order_value: number
    top_products: Array<{ title: string; revenue: number; orders: number }>
  }
  ga4: {
    sessions: number
    users: number
    pageviews: number
    channels: Record<string, { sessions: number; users: number }>
    top_pages: Array<{ page: string; views: number }>
  }
  knowledge: {
    last_updated: string
    topics: number
  }
  bots: Array<{
    name: string
    status: string
    last_run: string
  }>
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchData = async () => {
    try {
      const res = await fetch('/api/dashboard')
      const json = await res.json()
      setData(json)
      setLastRefresh(new Date())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#c9a96e] font-light tracking-widest text-sm uppercase">Loading</p>
      </div>
    </div>
  )

  const totalSpend = data?.ads?.total_spend ?? 0
  const totalRoas = data?.ads?.total_roas ?? 0
  const sessions = data?.ga4?.sessions ?? 0
  const users = data?.ga4?.users ?? 0
  const orders = data?.shopify?.total_orders ?? 0
  const revenue = data?.shopify?.total_revenue ?? 0

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&display=swap" rel="stylesheet" />

      {/* Header */}
      <header className="border-b border-white/10 px-8 py-6 flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl font-light tracking-widest uppercase text-[#c9a96e]">
            Meave & Ivy
          </h1>
          <p className="text-white/30 text-xs tracking-widest uppercase mt-1">Operations Dashboard</p>
        </div>
        <div className="text-right">
          <p className="text-white/30 text-xs tracking-wider">Last updated</p>
          <p className="text-white/60 text-sm">{lastRefresh.toLocaleTimeString('nl-NL')}</p>
          <button onClick={fetchData} className="mt-2 text-xs text-[#c9a96e] hover:text-white transition-colors tracking-wider uppercase">
            Refresh →
          </button>
        </div>
      </header>

      <main className="px-8 py-8 max-w-7xl mx-auto">

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Ad Spend', value: '€' + totalSpend.toFixed(2), sub: 'Total spend' },
            { label: 'ROAS', value: totalRoas + 'x', sub: 'Return on ad spend' },
            { label: 'Sessions', value: sessions.toLocaleString(), sub: 'Last 7 days' },
            { label: 'Revenue', value: '£' + revenue.toFixed(2), sub: orders + ' orders' },
          ].map((kpi, i) => (
            <div key={i} className="border border-white/10 p-6 hover:border-[#c9a96e]/40 transition-colors">
              <p className="text-white/30 text-xs tracking-widest uppercase mb-3">{kpi.label}</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-light text-white mb-1">{kpi.value}</p>
              <p className="text-white/30 text-xs">{kpi.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Meta Ads */}
          <div className="border border-white/10 p-6">
            <h2 className="text-xs tracking-widest uppercase text-[#c9a96e] mb-6">Meta Ads Performance</h2>
            {data?.ads?.campaigns?.length ? data.ads.campaigns.map((campaign, i) => (
              <div key={i} className="mb-6">
                <p className="text-white/60 text-sm mb-3 truncate">{campaign.name}</p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Spend', value: '€' + campaign.spend.toFixed(2) },
                    { label: 'CTR', value: campaign.ctr.toFixed(2) + '%' },
                    { label: 'CPC', value: '€' + campaign.cpc.toFixed(2) },
                  ].map((stat, j) => (
                    <div key={j} className="bg-white/5 p-3">
                      <p className="text-white/30 text-xs mb-1">{stat.label}</p>
                      <p className="text-white text-sm font-medium">{stat.value}</p>
                    </div>
                  ))}
                </div>
                {campaign.ads?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-white/20 text-xs tracking-wider uppercase mb-2">Ad breakdown</p>
                    {campaign.ads.slice(0, 3).map((ad, k) => (
                      <div key={k} className="flex items-center justify-between py-2 border-b border-white/5">
                        <p className="text-white/50 text-xs truncate flex-1 mr-4">{ad.ad_name}</p>
                        <div className="flex gap-4 text-xs">
                          <span className={ad.ctr >= 2 ? 'text-emerald-400' : ad.ctr >= 1 ? 'text-amber-400' : 'text-red-400'}>
                            {ad.ctr.toFixed(2)}%
                          </span>
                          <span className="text-white/30">€{ad.cpc.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )) : (
              <p className="text-white/20 text-sm">No active campaigns</p>
            )}
          </div>

          {/* GA4 Traffic */}
          <div className="border border-white/10 p-6">
            <h2 className="text-xs tracking-widest uppercase text-[#c9a96e] mb-6">Website Traffic — Last 7 Days</h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: 'Sessions', value: sessions.toLocaleString() },
                { label: 'Users', value: users.toLocaleString() },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 p-4">
                  <p className="text-white/30 text-xs mb-1">{stat.label}</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl font-light">{stat.value}</p>
                </div>
              ))}
            </div>
            <p className="text-white/20 text-xs tracking-wider uppercase mb-3">Traffic by channel</p>
            <div className="space-y-2">
              {Object.entries(data?.ga4?.channels ?? {})
                .sort((a, b) => b[1].sessions - a[1].sessions)
                .slice(0, 5)
                .map(([channel, stats], i) => {
                  const pct = sessions > 0 ? Math.round(stats.sessions / sessions * 100) : 0
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <p className="text-white/50 text-xs truncate">{channel}</p>
                          <p className="text-white/30 text-xs">{pct}%</p>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full">
                          <div className="h-1 bg-[#c9a96e] rounded-full transition-all" style={{ width: pct + '%' }}></div>
                        </div>
                      </div>
                      <p className="text-white/40 text-xs w-12 text-right">{stats.sessions}</p>
                    </div>
                  )
                })}
            </div>
            {data?.ga4?.top_pages?.length > 0 && (
              <div className="mt-6">
                <p className="text-white/20 text-xs tracking-wider uppercase mb-3">Top pages</p>
                <div className="space-y-2">
                  {data.ga4.top_pages.slice(0, 4).map((page, i) => (
                    <div key={i} className="flex justify-between py-1 border-b border-white/5">
                      <p className="text-white/40 text-xs truncate flex-1 mr-4">{page.page}</p>
                      <p className="text-white/30 text-xs">{page.views} views</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Shopify */}
          <div className="border border-white/10 p-6">
            <h2 className="text-xs tracking-widest uppercase text-[#c9a96e] mb-6">Shopify</h2>
            <div className="space-y-4 mb-6">
              {[
                { label: 'Orders', value: orders.toString() },
                { label: 'Revenue', value: '£' + revenue.toFixed(2) },
                { label: 'Avg Order', value: '£' + (data?.shopify?.avg_order_value ?? 0).toFixed(2) },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                  <p className="text-white/30 text-xs uppercase tracking-wider">{stat.label}</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl font-light">{stat.value}</p>
                </div>
              ))}
            </div>
            {data?.shopify?.top_products?.length > 0 && (
              <>
                <p className="text-white/20 text-xs tracking-wider uppercase mb-3">Top products</p>
                <div className="space-y-2">
                  {data.shopify.top_products.slice(0, 4).map((product, i) => (
                    <div key={i} className="py-2 border-b border-white/5">
                      <p className="text-white/50 text-xs truncate mb-1">{product.title}</p>
                      <p className="text-white/30 text-xs">£{product.revenue.toFixed(2)} · {product.orders} orders</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Bot Status */}
          <div className="border border-white/10 p-6">
            <h2 className="text-xs tracking-widest uppercase text-[#c9a96e] mb-6">Bot Status</h2>
            <div className="space-y-3">
              {(data?.bots ?? [
                { name: 'Atlas Databus', status: 'active', last_run: 'Today 06:30' },
                { name: 'Meta Ads Monitor', status: 'active', last_run: 'Today 08:00' },
                { name: 'Social Media', status: 'active', last_run: 'Today 06:00' },
                { name: 'Shopify Report', status: 'active', last_run: 'Today 07:00' },
                { name: 'GA4 Bot', status: 'active', last_run: 'Today 07:30' },
                { name: 'Price Monitor', status: 'active', last_run: 'Hourly' },
                { name: 'Knowledge Scraper', status: 'active', last_run: 'Monday 05:00' },
                { name: 'Product Scout', status: 'active', last_run: 'Friday 10:00' },
                { name: 'CRO Expert', status: 'active', last_run: 'On demand' },
              ]).map((bot, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                    <p className="text-white/50 text-xs">{bot.name}</p>
                  </div>
                  <p className="text-white/20 text-xs">{bot.last_run}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Knowledge Base */}
          <div className="border border-white/10 p-6">
            <h2 className="text-xs tracking-widest uppercase text-[#c9a96e] mb-6">Knowledge Base</h2>
            <div className="space-y-4">
              {[
                { label: 'Foundation', value: 'Eugene Schwartz', sub: 'Breakthrough Advertising' },
                { label: 'Market Stage', value: 'Stage 5', sub: 'Identity messaging' },
                { label: 'Power Words', value: '20', sub: 'Fashion specific' },
                { label: 'Copy Patterns', value: '5', sub: 'Proven formulas' },
                { label: 'Scraped Topics', value: '10', sub: 'Weekly updated' },
                { label: 'Last Updated', value: data?.knowledge?.last_updated ?? 'Today', sub: 'Knowledge scraper' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-start py-2 border-b border-white/5">
                  <div>
                    <p className="text-white/30 text-xs uppercase tracking-wider">{item.label}</p>
                    <p className="text-white/20 text-xs mt-0.5">{item.sub}</p>
                  </div>
                  <p className="text-white/60 text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 pt-6 flex justify-between items-center">
          <p className="text-white/20 text-xs tracking-wider">Meave & Ivy Automation System · Built by Ivy</p>
          <p className="text-white/20 text-xs">Auto-refreshes every 60 seconds</p>
        </div>

      </main>
    </div>
  )
}
