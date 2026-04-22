'use client'

import { useState, useEffect } from 'react'

const MOCK_DATA = {
  meta: { spend: 36.18, ctr: 3.35, cpc: 1.13, roas: 0, impressions: 954, clicks: 32, campaigns: 1, ads_active: 6 },
  shopify: { orders: 14, revenue: 1247.30, avg_order: 89.09, sessions_today: 0, conversion_rate: 0, abandoned: 3 },
  ga4: { sessions: 0, users: 0, bounce_rate: 0, top_channel: 'Paid Social', channels: {} },
  bots: [
    { name: 'Atlas', role: 'Orchestrator', status: 'active', last_run: '06:30', next_run: '06:30 tomorrow' },
    { name: 'Meta Ads', role: 'Ad Monitor', status: 'active', last_run: '08:00', next_run: '08:00 tomorrow' },
    { name: 'Social Media', role: 'Content', status: 'active', last_run: '06:00', next_run: '06:00 tomorrow' },
    { name: 'Shopify', role: 'Store Manager', status: 'active', last_run: '07:00', next_run: '07:00 tomorrow' },
    { name: 'GA4', role: 'Analytics', status: 'active', last_run: '07:30', next_run: '07:30 tomorrow' },
    { name: 'Price Monitor', role: 'Pricing', status: 'active', last_run: 'Hourly', next_run: 'Next hour' },
    { name: 'Knowledge', role: 'Intelligence', status: 'active', last_run: 'Monday', next_run: 'Next Monday' },
    { name: 'Product Scout', role: 'Sourcing', status: 'active', last_run: 'Friday', next_run: 'Next Friday' },
    { name: 'CRO Expert', role: 'Conversion', status: 'active', last_run: 'On demand', next_run: 'On demand' },
  ],
  actions: [
    { id: 1, urgency: 'high', impact: 'high', title: 'Remove "Save 30-40%" badges from homepage', description: 'Public discounting destroys premium positioning. Immediate CVR impact.', source: 'CRO Expert', category: 'Website', done: false },
    { id: 2, urgency: 'high', impact: 'high', title: 'Activate customer reviews on product pages', description: 'Zero reviews visible. UGC increases CVR by up to 166% in fashion.', source: 'CRO Expert', category: 'Trust', done: false },
    { id: 3, urgency: 'high', impact: 'medium', title: 'Replace hero headline "Timeless style for the modern woman"', description: 'Too generic. Replace with identity-based copy from Schwartz principles.', source: 'CRO Expert', category: 'Copy', done: false },
    { id: 4, urgency: 'medium', impact: 'high', title: 'Monitor V5 & V6 Schwartz ads performance', description: 'New Schwartz-based ads launched. Check CTR vs V2 Identity (3.9% benchmark).', source: 'Meta Ads Bot', category: 'Ads', done: false },
    { id: 5, urgency: 'medium', impact: 'medium', title: 'Add trust bar below navigation on all pages', description: 'Free delivery · 30-day returns · Secure checkout. Reduces purchase anxiety.', source: 'CRO Expert', category: 'Website', done: false },
    { id: 6, urgency: 'medium', impact: 'medium', title: 'Add contact information to footer', description: 'No visible phone/email/address. First-time visitors need to trust a real business.', source: 'CRO Expert', category: 'Trust', done: false },
    { id: 7, urgency: 'low', impact: 'high', title: 'Set up BOF retargeting campaign', description: 'Wait until 50+ pixel purchase events. Currently building data.', source: 'Meta Ads Bot', category: 'Ads', done: false },
    { id: 8, urgency: 'low', impact: 'high', title: 'Start email marketing (Klaviyo)', description: 'Begin when customer base reaches 100. Currently at 14 customers.', source: 'Atlas', category: 'Email', done: false },
    { id: 9, urgency: 'low', impact: 'medium', title: 'Replace "Shop Now" CTA with "Discover the Collection →"', description: 'More editorial, less marketplace. Aligns with premium positioning.', source: 'CRO Expert', category: 'Copy', done: false },
  ],
  feed: [
    { time: '08:00', bot: 'Meta Ads', message: 'V5 Schwartz Transformation & V6 Social Proof ads activated. Monitoring...', type: 'info' },
    { time: '07:30', bot: 'GA4', message: 'Analytics report sent. Sessions data collecting — data available from tomorrow.', type: 'info' },
    { time: '07:00', bot: 'Shopify', message: 'Daily report: 14 total customers. 3 abandoned carts detected.', type: 'warning' },
    { time: '06:30', bot: 'Atlas', message: 'Databus updated. All bots synchronized with latest instructions.', type: 'success' },
    { time: '06:00', bot: 'Social Media', message: 'Content scheduled for today. Identity-based captions using Schwartz principles.', type: 'info' },
    { time: '05:00', bot: 'Knowledge', message: 'Scraped 10 topics: UK fashion trends, CRO, trust signals, email flows updated.', type: 'success' },
    { time: 'Yesterday', bot: 'CRO Expert', message: 'Homepage audit complete. 9 actionable recommendations identified.', type: 'warning' },
    { time: 'Yesterday', bot: 'Meta Ads', message: 'V2 Identity New confirmed winner: CTR 3.9%, CPC €1.26. V5 Quality & V6 Question paused.', type: 'success' },
  ],
  products: {
    recommendations: [
      { id: 1, title: 'Floral Wrap Midi Dress', reason: 'Trending in UK fashion this week. Similar to your bestselling Isadora Wrap.', source: 'Product Scout', margin: '2.8x', category: 'Dress', priority: 'high', babyboo_price: 89.95, suggested_price: 109.95 },
      { id: 2, title: 'Satin Slip Maxi Dress', reason: 'Satin category performing well. V3 DPA ad shows strong interest in satin products.', source: 'Product Scout', margin: '2.4x', category: 'Dress', priority: 'high', babyboo_price: 74.95, suggested_price: 94.95 },
      { id: 3, title: 'Structured Blazer Dress', reason: 'UK consumer data shows blazer dresses trending for autumn. Low competition in catalog.', source: 'Atlas', margin: '3.1x', category: 'Dress', priority: 'medium', babyboo_price: 119.95, suggested_price: 149.95 },
      { id: 4, title: 'Ruched Bodycon Mini', reason: 'Occasion wear performing well. Complements existing maxi range with shorter option.', source: 'Product Scout', margin: '2.6x', category: 'Dress', priority: 'medium', babyboo_price: 59.95, suggested_price: 79.95 },
      { id: 5, title: 'Lace Detail Corset Top', reason: 'Corset detail sells well in your catalog. Top as separate item increases basket size.', source: 'Atlas', margin: '2.2x', category: 'Top', priority: 'low', babyboo_price: 44.95, suggested_price: 59.95 },
    ],
    bestsellers: [
      { title: 'Calanthe Pleated Satin Maxi — Plum', orders: 4, revenue: 559.80, trend: 'up' },
      { title: 'The Isadora Wrap Mini Dress', orders: 3, revenue: 269.85, trend: 'up' },
      { title: 'Maliyah Maxi Dress — Khaki', orders: 2, revenue: 299.90, trend: 'stable' },
      { title: 'Floral Appliqué Corset Maxi', orders: 2, revenue: 259.90, trend: 'stable' },
      { title: 'Sian Maxi Dress — Burgundy', orders: 1, revenue: 129.95, trend: 'down' },
    ]
  },
  knowledge: {
    last_updated: '21-4-2026',
    foundation: 'Eugene Schwartz — Breakthrough Advertising',
    market_stage: 5,
    copy_patterns: 5,
    power_words: 20,
    scraped_topics: 10,
    weekly_updated: true
  }
}

type Action = typeof MOCK_DATA.actions[0]

export default function Dashboard() {
  const [data, setData] = useState(MOCK_DATA)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const fetchData = async () => {
      try {
        const res = await fetch(
          'https://raw.githubusercontent.com/automationnextego1-del/meave-ivy-dashboard/main/public/data.json'
        )
        const json = await res.json()
        if (json && json.updated_at) setData(json)
      } catch (e) {
        console.error(e)
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 300000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null
  const [activeTab, setActiveTab] = useState('overview')
  const [actions, setActions] = useState(data.actions)
  const [filter, setFilter] = useState('all')
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const toggleAction = (id: number) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, done: !a.done } : a))
  }

  const filteredActions = actions.filter(a => {
    if (filter === 'done') return a.done
    if (filter === 'todo') return !a.done
    return true
  }).sort((a, b) => {
    const urgencyOrder = { high: 0, medium: 1, low: 2 }
    const impactOrder = { high: 0, medium: 1, low: 2 }
    return (urgencyOrder[a.urgency as keyof typeof urgencyOrder] + impactOrder[a.impact as keyof typeof impactOrder]) -
           (urgencyOrder[b.urgency as keyof typeof urgencyOrder] + impactOrder[b.impact as keyof typeof impactOrder])
  })

  const pendingHigh = actions.filter(a => !a.done && a.urgency === 'high').length
  const totalDone = actions.filter(a => a.done).length

  const tabs = ['overview', 'ads', 'actions', 'bots', 'feed', 'knowledge', 'products']

  return (
    <div className="min-h-screen bg-[#080808] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=Cormorant:ital,wght@0,300;0,400;1,300&display=swap" rel="stylesheet" />

      {/* Top bar */}
      <div className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <span style={{ fontFamily: "'Cormorant', serif" }} className="text-lg font-light tracking-[0.2em] text-[#c9a96e] uppercase">Meave & Ivy</span>
            <span className="text-white/20 text-xs ml-3 tracking-widest uppercase">Command Centre</span>
          </div>
          {pendingHigh > 0 && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></div>
              <span className="text-red-400 text-xs font-medium">{pendingHigh} urgent action{pendingHigh > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-white/20 text-xs">Tuesday, April 21 2026</p>
            <p className="text-white/50 text-sm font-mono">{time.toLocaleTimeString('nl-NL')}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-emerald-400 text-xs">9 bots active</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="border-b border-white/[0.06] px-6 flex gap-1">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-xs tracking-widest uppercase transition-all border-b-2 ${
              activeTab === tab
                ? 'text-[#c9a96e] border-[#c9a96e]'
                : 'text-white/30 border-transparent hover:text-white/60'
            }`}>
            {tab}
            {tab === 'actions' && pendingHigh > 0 && (
              <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingHigh}</span>
            )}
          </button>
        ))}
      </div>

      <main className="p-6 max-w-7xl mx-auto">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Grid */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Ad Spend', value: '€' + data.meta.spend.toFixed(2), sub: data.meta.campaigns + ' campaign active', trend: null, color: 'white' },
                { label: 'CTR', value: data.meta.ctr + '%', sub: data.meta.clicks + ' clicks · ' + data.meta.impressions + ' impressions', trend: 'up', color: '#10b981' },
                { label: 'CPC', value: '€' + data.meta.cpc, sub: 'Cost per click', trend: 'up', color: '#10b981' },
                { label: 'ROAS', value: data.meta.roas + 'x', sub: 'Learning phase — day 1', trend: null, color: '#f59e0b' },
                { label: 'Orders', value: data.shopify.orders.toString(), sub: 'Total customers', trend: null, color: 'white' },
                { label: 'Revenue', value: '£' + data.shopify.revenue.toFixed(2), sub: 'Avg £' + data.shopify.avg_order.toFixed(2), trend: null, color: 'white' },
                { label: 'Sessions', value: data.ga4.sessions.toLocaleString(), sub: 'Last 7 days — collecting', trend: null, color: 'white' },
                { label: 'Abandoned', value: data.shopify.abandoned.toString(), sub: 'Carts not completed', trend: 'down', color: '#f59e0b' },
              ].map((kpi, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/[0.06] p-5 hover:border-white/[0.12] transition-colors">
                  <p className="text-white/30 text-xs tracking-widest uppercase mb-3">{kpi.label}</p>
                  <p style={{ fontFamily: "'Cormorant', serif", color: kpi.color === 'white' ? 'white' : kpi.color }} className="text-3xl font-light mb-1">{kpi.value}</p>
                  <p className="text-white/20 text-xs">{kpi.sub}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions + Feed */}
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 bg-white/[0.03] border border-white/[0.06] p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xs tracking-widest uppercase text-white/40">Priority Actions</h2>
                  <button onClick={() => setActiveTab('actions')} className="text-[#c9a96e] text-xs hover:text-white transition-colors">View all →</button>
                </div>
                <div className="space-y-3">
                  {actions.filter(a => !a.done && a.urgency === 'high').slice(0, 3).map(action => (
                    <div key={action.id} className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded">
                      <button onClick={() => toggleAction(action.id)} className="mt-0.5 w-4 h-4 border border-red-400/50 rounded flex-shrink-0 hover:bg-red-400/20 transition-colors"></button>
                      <div className="flex-1 min-w-0">
                        <p className="text-white/80 text-sm">{action.title}</p>
                        <p className="text-white/30 text-xs mt-0.5">{action.source} · {action.category}</p>
                      </div>
                      <span className="text-red-400 text-xs flex-shrink-0">HIGH</span>
                    </div>
                  ))}
                  {actions.filter(a => !a.done && a.urgency === 'medium').slice(0, 2).map(action => (
                    <div key={action.id} className="flex items-start gap-3 p-3 bg-amber-500/5 border border-amber-500/10 rounded">
                      <button onClick={() => toggleAction(action.id)} className="mt-0.5 w-4 h-4 border border-amber-400/50 rounded flex-shrink-0 hover:bg-amber-400/20 transition-colors"></button>
                      <div className="flex-1 min-w-0">
                        <p className="text-white/80 text-sm">{action.title}</p>
                        <p className="text-white/30 text-xs mt-0.5">{action.source} · {action.category}</p>
                      </div>
                      <span className="text-amber-400 text-xs flex-shrink-0">MED</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.06] p-5">
                <h2 className="text-xs tracking-widest uppercase text-white/40 mb-4">System Health</h2>
                <div className="space-y-3 mb-6">
                  {[
                    { label: 'Bots running', value: '9/9', ok: true },
                    { label: 'Knowledge base', value: 'Updated today', ok: true },
                    { label: 'Meta pixel', value: 'Firing', ok: true },
                    { label: 'GA4 tracking', value: 'Active', ok: true },
                    { label: 'Cron jobs', value: '33 active', ok: true },
                    { label: 'Actions done', value: totalDone + '/' + actions.length, ok: totalDone === actions.length },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-1.5 border-b border-white/[0.04]">
                      <p className="text-white/30 text-xs">{item.label}</p>
                      <div className="flex items-center gap-2">
                        <div className={`w-1 h-1 rounded-full ${item.ok ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                        <p className="text-white/60 text-xs">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-[#c9a96e]/5 border border-[#c9a96e]/10 p-3 rounded">
                  <p className="text-[#c9a96e] text-xs font-medium mb-1">Market Stage 5</p>
                  <p className="text-white/30 text-xs">Identity messaging active · Schwartz principles loaded</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ADS */}
        {activeTab === 'ads' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Total Spend', value: '€36.18', sub: 'Since launch' },
                { label: 'Best CTR', value: '3.9%', sub: 'V2 Identity New' },
                { label: 'Best CPC', value: '€1.13', sub: 'Campaign average' },
                { label: 'Active Ads', value: '6', sub: '2 paused' },
              ].map((kpi, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/[0.06] p-5">
                  <p className="text-white/30 text-xs tracking-widest uppercase mb-3">{kpi.label}</p>
                  <p style={{ fontFamily: "'Cormorant', serif" }} className="text-3xl font-light mb-1">{kpi.value}</p>
                  <p className="text-white/20 text-xs">{kpi.sub}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] p-6">
              <h2 className="text-xs tracking-widest uppercase text-white/40 mb-6">Ad Performance — Sales Campaign</h2>
              <div className="space-y-3">
                {[
                  { name: 'V2 - Identity New', spend: 11.36, ctr: 3.9, cpc: 1.26, status: 'WINNER', color: 'emerald' },
                  { name: 'V1 - Identity Original', spend: 7.61, ctr: 2.8, cpc: 2.54, status: 'ACTIVE', color: 'blue' },
                  { name: 'V4 - Occasion', spend: 3.37, ctr: 2.44, cpc: 3.37, status: 'ACTIVE', color: 'blue' },
                  { name: 'V5 - Schwartz Transformation', spend: 0, ctr: 0, cpc: 0, status: 'NEW', color: 'purple' },
                  { name: 'V6 - Schwartz Social Proof', spend: 0, ctr: 0, cpc: 0, status: 'NEW', color: 'purple' },
                  { name: 'V3 - Transformation', spend: 0.23, ctr: 0, cpc: 0, status: 'LEARNING', color: 'amber' },
                  { name: 'V5 - Quality (old)', spend: 14.29, ctr: 1.22, cpc: 4.76, status: 'PAUSED', color: 'red' },
                  { name: 'V6 - Question (old)', spend: 5.53, ctr: 2.0, cpc: 5.53, status: 'PAUSED', color: 'red' },
                ].map((ad, i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 border rounded ${
                    ad.color === 'emerald' ? 'bg-emerald-500/5 border-emerald-500/20' :
                    ad.color === 'red' ? 'bg-white/[0.02] border-white/[0.04] opacity-40' :
                    ad.color === 'purple' ? 'bg-purple-500/5 border-purple-500/15' :
                    'bg-white/[0.02] border-white/[0.06]'
                  }`}>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-sm truncate">{ad.name}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-6 text-right">
                      <div>
                        <p className="text-white/20 text-xs mb-0.5">Spend</p>
                        <p className="text-white/60 text-sm">€{ad.spend.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-white/20 text-xs mb-0.5">CTR</p>
                        <p className={`text-sm ${ad.ctr >= 3 ? 'text-emerald-400' : ad.ctr >= 2 ? 'text-white/60' : ad.ctr > 0 ? 'text-amber-400' : 'text-white/20'}`}>
                          {ad.ctr > 0 ? ad.ctr + '%' : '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/20 text-xs mb-0.5">CPC</p>
                        <p className={`text-sm ${ad.cpc > 0 && ad.cpc <= 1.5 ? 'text-emerald-400' : ad.cpc > 1.5 && ad.cpc <= 3 ? 'text-white/60' : ad.cpc > 3 ? 'text-red-400' : 'text-white/20'}`}>
                          {ad.cpc > 0 ? '€' + ad.cpc.toFixed(2) : '—'}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded font-medium w-20 text-center flex-shrink-0 ${
                      ad.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                      ad.color === 'red' ? 'bg-white/5 text-white/20' :
                      ad.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                      ad.color === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-white/5 text-white/40'
                    }`}>{ad.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ACTIONS */}
        {activeTab === 'actions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white/60 text-sm">Action Centre</h2>
                <p className="text-white/20 text-xs mt-0.5">{totalDone}/{actions.length} completed · {pendingHigh} urgent</p>
              </div>
              <div className="flex gap-2">
                {['all', 'todo', 'done'].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 text-xs tracking-wider uppercase rounded transition-colors ${
                      filter === f ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'
                    }`}>{f}</button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredActions.map(action => (
                <div key={action.id} className={`flex items-start gap-4 p-5 border rounded transition-all ${
                  action.done ? 'bg-white/[0.02] border-white/[0.04] opacity-40' :
                  action.urgency === 'high' ? 'bg-red-500/5 border-red-500/15' :
                  action.urgency === 'medium' ? 'bg-amber-500/5 border-amber-500/10' :
                  'bg-white/[0.02] border-white/[0.06]'
                }`}>
                  <button onClick={() => toggleAction(action.id)}
                    className={`mt-0.5 w-5 h-5 border rounded flex-shrink-0 flex items-center justify-center transition-colors ${
                      action.done ? 'bg-emerald-500 border-emerald-500' :
                      action.urgency === 'high' ? 'border-red-400/50 hover:bg-red-400/20' :
                      action.urgency === 'medium' ? 'border-amber-400/50 hover:bg-amber-400/20' :
                      'border-white/20 hover:bg-white/10'
                    }`}>
                    {action.done && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm mb-1 ${action.done ? 'line-through text-white/30' : 'text-white/80'}`}>{action.title}</p>
                    <p className="text-white/30 text-xs mb-2">{action.description}</p>
                    <div className="flex gap-3">
                      <span className="text-white/20 text-xs">{action.source}</span>
                      <span className="text-white/10 text-xs">·</span>
                      <span className="text-white/20 text-xs">{action.category}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-shrink-0 text-right">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      action.urgency === 'high' ? 'bg-red-500/20 text-red-400' :
                      action.urgency === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-white/5 text-white/30'
                    }`}>↑ {action.urgency}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      action.impact === 'high' ? 'bg-emerald-500/20 text-emerald-400' :
                      action.impact === 'medium' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-white/5 text-white/30'
                    }`}>⚡ {action.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOTS */}
        {activeTab === 'bots' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {data.bots.map((bot, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/[0.06] p-5 hover:border-white/[0.12] transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-white/80 text-sm font-medium">{bot.name}</p>
                      <p className="text-white/30 text-xs mt-0.5">{bot.role}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      <span className="text-emerald-400 text-xs">Active</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-white/20 text-xs">Last run</p>
                      <p className="text-white/40 text-xs">{bot.last_run}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-white/20 text-xs">Next run</p>
                      <p className="text-white/40 text-xs">{bot.next_run}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] p-6">
              <h2 className="text-xs tracking-widest uppercase text-white/40 mb-4">Cron Schedule</h2>
              <div className="grid grid-cols-2 gap-x-12 gap-y-2">
                {[
                  ['02:00', 'SEO Optimizer — 5 draft products'],
                  ['05:00 Mon', 'Knowledge Scraper — 10 topics'],
                  ['06:00', 'Social Media Memory + Scheduler'],
                  ['06:30', 'Atlas Databus — all bots sync'],
                  ['07:00', 'Shopify Daily Report'],
                  ['07:30', 'GA4 Analytics Report'],
                  ['07:30 Mon', 'Price Monitor — suggest changes'],
                  ['08:00', 'Meta Ads Monitor + Ad analysis'],
                  ['08:00 Mon', 'Bestseller Tracker + Bundler'],
                  ['09:00 Mon', 'Competitor Monitor'],
                  ['10:00 Fri', 'Product Scout — new products'],
                  ['Every 15m', 'Comment + DM Reply'],
                  ['Every hour', 'Abandoned Cart + Price Check'],
                ].map(([time, task], i) => (
                  <div key={i} className="flex gap-4 py-1.5 border-b border-white/[0.04]">
                    <p className="text-[#c9a96e] text-xs w-24 flex-shrink-0 font-mono">{time}</p>
                    <p className="text-white/30 text-xs">{task}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FEED */}
        {activeTab === 'feed' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-white/40 text-xs tracking-widest uppercase">Activity Feed</h2>
              <p className="text-white/20 text-xs">Today, April 21 2026</p>
            </div>
            {data.feed.map((item, i) => (
              <div key={i} className={`flex gap-4 p-4 border rounded ${
                item.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/10' :
                item.type === 'warning' ? 'bg-amber-500/5 border-amber-500/10' :
                'bg-white/[0.02] border-white/[0.06]'
              }`}>
                <div className="flex-shrink-0 mt-0.5">
                  <div className={`w-2 h-2 rounded-full mt-1 ${
                    item.type === 'success' ? 'bg-emerald-400' :
                    item.type === 'warning' ? 'bg-amber-400' :
                    'bg-white/20'
                  }`}></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-white/60 text-xs font-medium">{item.bot}</span>
                    <span className="text-white/20 text-xs font-mono">{item.time}</span>
                  </div>
                  <p className="text-white/40 text-sm">{item.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* KNOWLEDGE */}
        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 bg-white/[0.03] border border-white/[0.06] p-6">
                <h2 className="text-xs tracking-widest uppercase text-[#c9a96e] mb-2">Foundation</h2>
                <p style={{ fontFamily: "'Cormorant', serif" }} className="text-2xl font-light text-white mb-4">Breakthrough Advertising</p>
                <p className="text-white/30 text-sm mb-6">Eugene Schwartz · Stage 5 Market Sophistication</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { pattern: 'Identity', example: '"You know your style. This piece knows it too."', ctr: '3.9% CTR ✓ WINNER' },
                    { pattern: 'Transformation', example: '"You walk in. The room adjusts."', ctr: 'Active — testing' },
                    { pattern: 'Social Proof', example: '"London\'s most refined women are reaching for these."', ctr: 'Active — testing' },
                    { pattern: 'Occasion', example: '"That moment you\'ve been dressing for?"', ctr: '2.44% CTR' },
                    { pattern: 'Quality', example: '"Your hands know the difference."', ctr: '1.22% CTR — paused' },
                  ].map((p, i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/[0.06] p-4">
                      <p className="text-[#c9a96e] text-xs tracking-wider uppercase mb-2">{p.pattern}</p>
                      <p className="text-white/60 text-sm italic mb-2">"{p.example}"</p>
                      <p className="text-white/20 text-xs">{p.ctr}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/[0.03] border border-white/[0.06] p-5">
                  <h2 className="text-xs tracking-widest uppercase text-white/40 mb-4">Knowledge Stats</h2>
                  {[
                    { label: 'Power Words', value: '20' },
                    { label: 'Copy Patterns', value: '5' },
                    { label: 'Scraped Topics', value: '10' },
                    { label: 'Last Updated', value: data.knowledge.last_updated },
                    { label: 'Market Stage', value: 'Stage 5' },
                    { label: 'Auto-update', value: 'Every Monday' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-white/[0.04]">
                      <p className="text-white/30 text-xs">{item.label}</p>
                      <p className="text-white/60 text-xs">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white/[0.03] border border-white/[0.06] p-5">
                  <h2 className="text-xs tracking-widest uppercase text-white/40 mb-4">Weekly Scraped Topics</h2>
                  <div className="space-y-2">
                    {['UK Fashion Trends', 'Facebook Ads Best Practices', 'Copywriting Techniques', 'UK Consumer Behaviour', 'Social Media Strategy', 'CRO & Conversion', 'Product Page Copy', 'Fashion Copywriting', 'Trust Signals', 'Email Marketing Flows'].map((topic, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-emerald-400"></div>
                        <p className="text-white/40 text-xs">{topic}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-white/40 text-xs tracking-widest uppercase">Product Recommendations</h2>
                  <p className="text-white/20 text-xs">Ranked by priority & margin</p>
                </div>
                {data.products.recommendations.map((product, i) => (
                  <div key={i} className={`p-5 border rounded ${
                    product.priority === 'high' ? 'bg-[#c9a96e]/5 border-[#c9a96e]/20' :
                    product.priority === 'medium' ? 'bg-white/[0.03] border-white/[0.08]' :
                    'bg-white/[0.02] border-white/[0.05]'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-white/80 text-sm font-medium">{product.title}</p>
                        <p className="text-white/30 text-xs mt-0.5">{product.category} · {product.source}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          product.priority === 'high' ? 'bg-[#c9a96e]/20 text-[#c9a96e]' :
                          product.priority === 'medium' ? 'bg-white/10 text-white/40' :
                          'bg-white/5 text-white/20'
                        }`}>{product.priority.toUpperCase()}</span>
                        <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400">{product.margin} margin</span>
                      </div>
                    </div>
                    <p className="text-white/30 text-xs mb-3">{product.reason}</p>
                    <div className="flex gap-6 text-xs">
                      <div>
                        <p className="text-white/20 mb-0.5">Babyboo price</p>
                        <p className="text-white/50">£{product.babyboo_price}</p>
                      </div>
                      <div>
                        <p className="text-white/20 mb-0.5">Suggested price</p>
                        <p className="text-[#c9a96e]">£{product.suggested_price}</p>
                      </div>
                      <div>
                        <p className="text-white/20 mb-0.5">Margin</p>
                        <p className="text-emerald-400">{product.margin}x</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="bg-white/[0.03] border border-white/[0.06] p-5">
                  <h2 className="text-xs tracking-widest uppercase text-white/40 mb-4">Bestsellers</h2>
                  <div className="space-y-3">
                    {data.products.bestsellers.map((product, i) => (
                      <div key={i} className="py-2 border-b border-white/[0.04]">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-white/50 text-xs truncate flex-1 mr-2">{product.title}</p>
                          <span className={`text-xs ${
                            product.trend === 'up' ? 'text-emerald-400' :
                            product.trend === 'down' ? 'text-red-400' :
                            'text-white/20'
                          }`}>{product.trend === 'up' ? '↑' : product.trend === 'down' ? '↓' : '→'}</span>
                        </div>
                        <div className="flex gap-4 text-xs">
                          <p className="text-white/20">{product.orders} orders</p>
                          <p className="text-white/40">£{product.revenue.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.06] p-5">
                  <h2 className="text-xs tracking-widest uppercase text-white/40 mb-4">Scout Settings</h2>
                  <div className="space-y-2">
                    {[
                      { label: 'Min margin', value: '2.21x' },
                      { label: 'Focus', value: "Women's fashion" },
                      { label: 'Source', value: 'Babyboo + UK retailers' },
                      { label: 'Runs', value: 'Every Friday 10:00' },
                      { label: 'Reports to', value: '#meave-ivy-products' },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between py-1.5 border-b border-white/[0.04]">
                        <p className="text-white/20 text-xs">{item.label}</p>
                        <p className="text-white/50 text-xs">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
