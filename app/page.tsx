'use client'

import { useState, useEffect } from 'react'

const DATA_URL = 'https://raw.githubusercontent.com/automationnextego1-del/meave-ivy-dashboard/main/public/data.json'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [filter, setFilter] = useState('all')
  const [time, setTime] = useState('')
  const [liveData, setLiveData] = useState<any>(null)
  const [adsPeriod, setAdsPeriod] = useState('max')
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null)
  const [spyFilter, setSpyFilter] = useState('all')
  const [expandedAd, setExpandedAd] = useState<string | null>(null)
  const [actions, setActions] = useState([
    { id: 1, urgency: 'high', impact: 'high', title: 'Remove "Save 30-40%" badges from homepage', description: 'Public discounting destroys premium positioning. Immediate CVR impact.', source: 'CRO Expert', category: 'Website', done: false },
    { id: 2, urgency: 'high', impact: 'high', title: 'Activate customer reviews on product pages', description: 'Zero reviews visible. UGC increases CVR by up to 166% in fashion.', source: 'CRO Expert', category: 'Trust', done: false },
    { id: 3, urgency: 'high', impact: 'medium', title: 'Replace hero headline "Timeless style for the modern woman"', description: 'Too generic. Replace with identity-based copy from Schwartz principles.', source: 'CRO Expert', category: 'Copy', done: false },
    { id: 4, urgency: 'medium', impact: 'high', title: 'Monitor V5 & V6 Schwartz ads performance', description: 'New Schwartz-based ads launched. Check CTR vs V2 Identity (3.9% benchmark).', source: 'Meta Ads Bot', category: 'Ads', done: false },
    { id: 5, urgency: 'medium', impact: 'medium', title: 'Add trust bar below navigation on all pages', description: 'Free delivery · 30-day returns · Secure checkout. Reduces purchase anxiety.', source: 'CRO Expert', category: 'Website', done: false },
    { id: 6, urgency: 'medium', impact: 'medium', title: 'Add contact information to footer', description: 'No visible phone/email/address. First-time visitors need to trust a real business.', source: 'CRO Expert', category: 'Trust', done: false },
    { id: 7, urgency: 'low', impact: 'high', title: 'Set up BOF retargeting campaign', description: 'Wait until 50+ pixel purchase events. Currently building data.', source: 'Meta Ads Bot', category: 'Ads', done: false },
    { id: 8, urgency: 'low', impact: 'high', title: 'Start email marketing (Klaviyo)', description: 'Begin when customer base reaches 100. Currently at 14 customers.', source: 'Atlas', category: 'Email', done: false },
    { id: 9, urgency: 'low', impact: 'medium', title: 'Replace "Shop Now" CTA with "Discover the Collection"', description: 'More editorial, less marketplace. Aligns with premium positioning.', source: 'CRO Expert', category: 'Copy', done: false },
  ])

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString('nl-NL')), 1000)
    setTime(new Date().toLocaleTimeString('nl-NL'))
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(DATA_URL)
        const json = await res.json()
        if (json && json.updated_at) setLiveData(json)
      } catch (e) {
        console.error('Failed to fetch data:', e)
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 300000)
    return () => clearInterval(interval)
  }, [])

  const meta = liveData?.meta || { spend: 0, ctr: 0, cpc: 0, roas: 0, campaigns: 0, ads_active: 6 }
  const shopify = liveData?.shopify || { total_orders: 0, total_revenue: 0, avg_order_value: 0, abandoned: 0 }
  const ga4 = liveData?.ga4 || { sessions: 0, users: 0, channels: {}, top_pages: [] }
  const knowledge = liveData?.knowledge || { last_updated: '2026-04-22', topics: 10 }
  const products = liveData?.products || { recommendations: [] }
  const bots = liveData?.bots || []

  const pendingHigh = actions.filter(a => !a.done && a.urgency === 'high').length
  const totalDone = actions.filter(a => a.done).length

  const toggleAction = (id: number) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, done: !a.done } : a))
  }

  const filteredActions = actions
    .filter(a => filter === 'done' ? a.done : filter === 'todo' ? !a.done : true)
    .sort((a, b) => {
      const o: Record<string, number> = { high: 0, medium: 1, low: 2 }
      return (o[a.urgency] + o[a.impact]) - (o[b.urgency] + o[b.impact])
    })

  const tabs = ['overview', 'ads', 'actions', 'bots', 'knowledge', 'products', 'spy']

  return (
    <div className="min-h-screen bg-[#080808] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Cormorant:wght@300;400&display=swap" rel="stylesheet" />

      {/* Header */}
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
            <p className="text-white/20 text-xs">April 22, 2026</p>
            <p className="text-white/50 text-sm font-mono">{time}</p>
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
            className={`px-4 py-3 text-xs tracking-widest uppercase transition-all border-b-2 ${activeTab === tab ? 'text-[#c9a96e] border-[#c9a96e]' : 'text-white/30 border-transparent hover:text-white/60'}`}>
            {tab}{tab === 'actions' && pendingHigh > 0 && <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingHigh}</span>}
          </button>
        ))}
      </div>

      <main className="p-6 max-w-7xl mx-auto">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Ad Spend', value: '€' + meta.spend.toFixed(2), sub: meta.campaigns + ' campaign active', color: 'white' },
                { label: 'CTR', value: meta.ctr.toFixed(2) + '%', sub: 'Click through rate', color: meta.ctr >= 2 ? '#10b981' : '#f59e0b' },
                { label: 'CPC', value: '€' + meta.cpc.toFixed(2), sub: 'Cost per click', color: meta.cpc > 0 && meta.cpc <= 1.5 ? '#10b981' : '#f59e0b' },
                { label: 'ROAS', value: meta.roas + 'x', sub: 'Return on ad spend', color: meta.roas >= 3 ? '#10b981' : '#f59e0b' },
                { label: 'Orders', value: shopify.total_orders.toString(), sub: 'Total customers', color: 'white' },
                { label: 'Revenue', value: '£' + shopify.total_revenue.toFixed(2), sub: 'Avg £' + shopify.avg_order_value.toFixed(2), color: 'white' },
                { label: 'Sessions', value: ga4.sessions.toLocaleString(), sub: 'Last 7 days', color: 'white' },
                { label: 'Abandoned', value: shopify.abandoned.toString(), sub: 'Carts not completed', color: shopify.abandoned > 0 ? '#f59e0b' : 'white' },
              ].map((kpi, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/[0.06] p-5 hover:border-white/[0.12] transition-colors">
                  <p className="text-white/30 text-xs tracking-widest uppercase mb-3">{kpi.label}</p>
                  <p style={{ fontFamily: "'Cormorant', serif", color: kpi.color }} className="text-3xl font-light mb-1">{kpi.value}</p>
                  <p className="text-white/20 text-xs">{kpi.sub}</p>
                </div>
              ))}
            </div>

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
                    { label: 'Actions done', value: totalDone + '/9', ok: totalDone === 9 },
                    { label: 'Live data', value: liveData ? 'Connected ✓' : 'Loading...', ok: !!liveData },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-1.5 border-b border-white/[0.04]">
                      <p className="text-white/30 text-xs">{item.label}</p>
                      <div className="flex items-center gap-2">
                        <div className={`w-1 h-1 rounded-full ${item.ok ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                        <p className="text-white/60 text-xs">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-[#c9a96e]/5 border border-[#c9a96e]/10 p-3 rounded">
                  <p className="text-[#c9a96e] text-xs font-medium mb-1">Market Stage 5</p>
                  <p className="text-white/30 text-xs">Identity messaging · Schwartz principles loaded</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ADS */}
        {activeTab === 'ads' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-white/40 text-xs tracking-widest uppercase">Ad Performance</h2>
              <div className="flex gap-1">
                {[
                  { key: 'today', label: 'Vandaag' },
                  { key: 'yesterday', label: 'Gisteren' },
                  { key: '7d', label: '7 dagen' },
                  { key: '30d', label: '30 dagen' },
                  { key: 'max', label: 'Max' },
                ].map(p => (
                  <button key={p.key} onClick={() => setAdsPeriod(p.key)}
                    className={"px-3 py-1.5 text-xs rounded transition-colors " + (adsPeriod === p.key ? 'bg-[#c9a96e]/20 text-[#c9a96e] border border-[#c9a96e]/30' : 'text-white/30 hover:text-white/60 border border-white/[0.06]')}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            {(() => {
              const campaigns = liveData?.ads?.campaigns || []
              const pd = campaigns.reduce((acc: any, c: any) => {
                const p = c.periods?.[adsPeriod] || {}
                acc.spend += p.spend || 0
                acc.clicks += p.clicks || 0
                acc.impressions += p.impressions || 0
                acc.ctr = acc.impressions > 0 ? (acc.clicks / acc.impressions * 100) : 0
                acc.cpc = acc.clicks > 0 ? (acc.spend / acc.clicks) : 0
                return acc
              }, { spend: 0, clicks: 0, impressions: 0, ctr: 0, cpc: 0 })
              const lbl: Record<string, string> = { today: 'Vandaag', yesterday: 'Gisteren', '7d': '7 dagen', '30d': '30 dagen', max: 'Totaal' }
              return (
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'Spend', value: '€' + pd.spend.toFixed(2), sub: lbl[adsPeriod] },
                    { label: 'CTR', value: pd.ctr.toFixed(2) + '%', sub: pd.clicks + ' clicks' },
                    { label: 'CPC', value: pd.cpc > 0 ? '€' + pd.cpc.toFixed(2) : '—', sub: 'Cost per click' },
                    { label: 'Impressions', value: pd.impressions.toLocaleString(), sub: 'Total' },
                  ].map((kpi, i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/[0.06] p-5">
                      <p className="text-white/30 text-xs tracking-widest uppercase mb-3">{kpi.label}</p>
                      <p style={{ fontFamily: "'Cormorant', serif" }} className="text-3xl font-light mb-1">{kpi.value}</p>
                      <p className="text-white/20 text-xs">{kpi.sub}</p>
                    </div>
                  ))}
                </div>
              )
            })()}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Total Spend', value: '€' + meta.spend.toFixed(2), sub: 'Since launch' },
                { label: 'Best CTR', value: meta.ctr.toFixed(2) + '%', sub: 'Campaign average' },
                { label: 'Best CPC', value: '€' + meta.cpc.toFixed(2), sub: 'Campaign average' },
                { label: 'Active Ads', value: meta.ads_active.toString(), sub: '2 paused' },
              ].map((kpi, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/[0.06] p-5">
                  <p className="text-white/30 text-xs tracking-widest uppercase mb-3">{kpi.label}</p>
                  <p style={{ fontFamily: "'Cormorant', serif" }} className="text-3xl font-light mb-1">{kpi.value}</p>
                  <p className="text-white/20 text-xs">{kpi.sub}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {(liveData?.ads?.campaigns || []).map((campaign: any, i: number) => {
                const spend = campaign.spend ?? 0
                const ctr = campaign.ctr ?? 0
                const cpc = campaign.cpc ?? 0
                const isActive = (campaign.ads || []).some((a: any) => a.status === 'ACTIVE')
                const isExpanded = expandedCampaign === campaign.name
                return (
                  <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded overflow-hidden">
                    <button onClick={() => setExpandedCampaign(isExpanded ? null : campaign.name)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors text-left">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={"w-1.5 h-1.5 rounded-full flex-shrink-0 " + (isActive ? 'bg-emerald-400' : 'bg-white/20')}></div>
                          <p className="text-white/80 text-sm truncate">{campaign.name}</p>
                        </div>
                        <p className="text-white/20 text-xs ml-3.5">{(campaign.ads || []).length} ads · {(campaign.ads || []).filter((a: any) => a.status === 'ACTIVE').length} active</p>
                      </div>
                      <div className="grid grid-cols-3 gap-6 text-right flex-shrink-0">
                        <div><p className="text-white/20 text-xs mb-0.5">Spend</p><p className="text-white/60 text-sm">{'€'}{spend.toFixed(2)}</p></div>
                        <div><p className="text-white/20 text-xs mb-0.5">CTR</p><p className={"text-sm " + (ctr >= 3 ? 'text-emerald-400' : ctr >= 2 ? 'text-white/60' : ctr > 0 ? 'text-amber-400' : 'text-white/20')}>{ctr > 0 ? ctr.toFixed(2) + '%' : '—'}</p></div>
                        <div><p className="text-white/20 text-xs mb-0.5">CPC</p><p className={"text-sm " + (cpc > 0 && cpc <= 1.5 ? 'text-emerald-400' : cpc > 3 ? 'text-red-400' : cpc > 0 ? 'text-white/60' : 'text-white/20')}>{cpc > 0 ? '€' + cpc.toFixed(2) : '—'}</p></div>
                      </div>
                      <span className="text-white/20 text-xs flex-shrink-0 w-4">{isExpanded ? '▲' : '▼'}</span>
                    </button>
                    {isExpanded && (campaign.ads || []).length > 0 && (
                      <div className="border-t border-white/[0.06] divide-y divide-white/[0.04]">
                        {(campaign.ads || []).map((ad: any, j: number) => (
                          <div key={j} className={"flex items-center gap-4 px-6 py-3 " + (ad.status === 'PAUSED' ? 'opacity-40' : '')}>
                            <div className="flex-1 min-w-0">
                              <p className="text-white/60 text-xs truncate">{ad.ad_name}</p>
                              <p className={"text-xs mt-0.5 " + (ad.status === 'ACTIVE' ? 'text-emerald-400' : 'text-white/20')}>{ad.status}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-6 text-right flex-shrink-0">
                              <div><p className="text-white/20 text-xs mb-0.5">Spend</p><p className="text-white/40 text-xs">{'€'}{(ad.spend || 0).toFixed(2)}</p></div>
                              <div><p className="text-white/20 text-xs mb-0.5">CTR</p><p className={"text-xs " + ((ad.ctr || 0) >= 3 ? 'text-emerald-400' : (ad.ctr || 0) > 0 ? 'text-white/40' : 'text-white/20')}>{(ad.ctr || 0) > 0 ? (ad.ctr).toFixed(2) + '%' : '—'}</p></div>
                              <div><p className="text-white/20 text-xs mb-0.5">CPC</p><p className={"text-xs " + ((ad.cpc || 0) > 0 && (ad.cpc || 0) <= 1.5 ? 'text-emerald-400' : (ad.cpc || 0) > 3 ? 'text-red-400' : 'text-white/20')}>{(ad.cpc || 0) > 0 ? '€' + (ad.cpc).toFixed(2) : '—'}</p></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ACTIONS */}
        {activeTab === 'actions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white/60 text-sm">Action Centre</h2>
                <p className="text-white/20 text-xs mt-0.5">{totalDone}/9 completed · {pendingHigh} urgent</p>
              </div>
              <div className="flex gap-2">
                {['all', 'todo', 'done'].map(f => (
                  <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs tracking-wider uppercase rounded transition-colors ${filter === f ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}>{f}</button>
                ))}
              </div>
            </div>
            {filteredActions.map(action => (
              <div key={action.id} className={`flex items-start gap-4 p-5 border rounded transition-all ${
                action.done ? 'bg-white/[0.01] border-white/[0.03] opacity-40' :
                action.urgency === 'high' ? 'bg-red-500/5 border-red-500/15' :
                action.urgency === 'medium' ? 'bg-amber-500/5 border-amber-500/10' :
                'bg-white/[0.02] border-white/[0.06]'
              }`}>
                <button onClick={() => toggleAction(action.id)} className={`mt-0.5 w-5 h-5 border rounded flex-shrink-0 flex items-center justify-center transition-colors ${
                  action.done ? 'bg-emerald-500 border-emerald-500' :
                  action.urgency === 'high' ? 'border-red-400/50 hover:bg-red-400/20' :
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
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded ${action.urgency === 'high' ? 'bg-red-500/20 text-red-400' : action.urgency === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-white/30'}`}>↑ {action.urgency}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${action.impact === 'high' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>⚡ {action.impact}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOTS */}
        {activeTab === 'bots' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {(bots.length > 0 ? bots : [
                { name: 'Atlas', role: 'Orchestrator', status: 'active', last_run: 'Daily 06:30', next_run: 'Tomorrow 06:30' },
                { name: 'Meta Ads', role: 'Ad Monitor', status: 'active', last_run: 'Daily 08:00', next_run: 'Tomorrow 08:00' },
                { name: 'Social Media', role: 'Content', status: 'active', last_run: 'Daily 06:00', next_run: 'Tomorrow 06:00' },
                { name: 'Shopify', role: 'Store Manager', status: 'active', last_run: 'Daily 07:00', next_run: 'Tomorrow 07:00' },
                { name: 'GA4', role: 'Analytics', status: 'active', last_run: 'Daily 07:30', next_run: 'Tomorrow 07:30' },
                { name: 'Price Monitor', role: 'Pricing', status: 'active', last_run: 'Hourly', next_run: 'Next hour' },
                { name: 'Knowledge', role: 'Intelligence', status: 'active', last_run: 'Monday 05:00', next_run: 'Next Monday' },
                { name: 'Product Scout', role: 'Sourcing', status: 'active', last_run: 'Friday 10:00', next_run: 'Next Friday' },
                { name: 'CRO Expert', role: 'Conversion', status: 'active', last_run: 'On demand', next_run: 'On demand' },
              ]).map((bot: any, i: number) => (
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
                    { pattern: 'Identity', example: '"You know your style. This piece knows it too."', result: '3.9% CTR — WINNER' },
                    { pattern: 'Transformation', example: '"You walk in. The room adjusts."', result: 'Active — testing' },
                    { pattern: 'Social Proof', example: '"London\'s most refined women are reaching for these."', result: 'Active — testing' },
                    { pattern: 'Occasion', example: '"That moment you\'ve been dressing for?"', result: '2.44% CTR' },
                    { pattern: 'Quality', example: '"Your hands know the difference."', result: '1.22% CTR — paused' },
                  ].map((p, i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/[0.06] p-4">
                      <p className="text-[#c9a96e] text-xs tracking-wider uppercase mb-2">{p.pattern}</p>
                      <p className="text-white/60 text-sm italic mb-2">"{p.example}"</p>
                      <p className="text-white/20 text-xs">{p.result}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/[0.03] border border-white/[0.06] p-5">
                  <h2 className="text-xs tracking-widest uppercase text-white/40 mb-4">Stats</h2>
                  {[
                    { label: 'Power Words', value: '20' },
                    { label: 'Copy Patterns', value: '5' },
                    { label: 'Scraped Topics', value: knowledge.topics.toString() },
                    { label: 'Last Updated', value: knowledge.last_updated },
                    { label: 'Market Stage', value: 'Stage 5' },
                    { label: 'Auto-update', value: 'Every Monday' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-white/[0.04]">
                      <p className="text-white/30 text-xs">{item.label}</p>
                      <p className="text-white/60 text-xs">{item.value}</p>
                    </div>
                  ))}
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
                <h2 className="text-white/40 text-xs tracking-widest uppercase">Product Recommendations</h2>
                {products.recommendations.length > 0 ? products.recommendations.map((product: any, i: number) => (
                  <div key={i} className="p-5 border border-[#c9a96e]/20 bg-[#c9a96e]/5 rounded">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-white/80 text-sm font-medium">{product.title}</p>
                        <p className="text-white/30 text-xs mt-0.5">{product.category}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400">{product.margin}x margin</span>
                    </div>
                    <p className="text-white/30 text-xs mb-3">{product.why_it_sells}</p>
                    {product.aliexpress_search_term && (
                      <div className="bg-white/5 p-3 rounded mb-3">
                        <p className="text-white/20 text-xs mb-1">AliExpress zoekterm — sorteer op bestellingen ↓ + min 4★</p>
                        <p className="text-[#c9a96e] text-xs font-mono">{product.aliexpress_search_term}</p>
                      </div>
                    )}
                    <div className="flex gap-6 text-xs">
                      <div><p className="text-white/20 mb-0.5">AliExpress</p><p className="text-white/50">£{product.aliexpress_price_avg || product.aliexpress_price}</p></div>
                      <div><p className="text-white/20 mb-0.5">Concurrent</p><p className="text-white/50">£{product.babyboo_price || product.competitor_price}</p></div>
                      <div><p className="text-white/20 mb-0.5">Jouw prijs</p><p className="text-[#c9a96e]">£{product.your_price}</p></div>
                      <div><p className="text-white/20 mb-0.5">Marge</p><p className="text-emerald-400">{product.margin}x</p></div>
                    </div>
                  </div>
                )) : (
                  <div className="bg-white/[0.03] border border-white/[0.06] p-8 text-center">
                    <p className="text-white/30 text-sm">Geen aanbevelingen — Product Scout draait vrijdag om 10:00</p>
                  </div>
                )}
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] p-5">
                <h2 className="text-xs tracking-widest uppercase text-white/40 mb-4">Scout Settings</h2>
                {[
                  { label: 'Min margin', value: '2.21x' },
                  { label: 'Discount vs concurrent', value: '8% goedkoper' },
                  { label: 'Focus', value: "Women's fashion" },
                  { label: 'Concurrenten', value: 'Oh Polly, Babyboo, ASOS, PLT' },
                  { label: 'Runs', value: 'Every Friday 10:00' },
                  { label: 'Archiveer na', value: '14 dagen' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between py-1.5 border-b border-white/[0.04]">
                    <p className="text-white/20 text-xs">{item.label}</p>
                    <p className="text-white/50 text-xs">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}


        {/* SPY */}
        {activeTab === 'spy' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white/60 text-sm flex items-center gap-2">
                  <span>🕵️</span> Ad Spy
                  {(!liveData?.spy || liveData?.spy?.total_found === 0) && (
                    <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">Wacht op Meta goedkeuring</span>
                  )}
                </h2>
                <p className="text-white/20 text-xs mt-0.5">
                  {liveData?.spy?.total_found || 0} ads gescand · {liveData?.spy?.winning_ads?.length || 0} winners · Elke vrijdag 09:00
                </p>
              </div>
              <div className="flex gap-1">
                {['all', 'winners', 'babyboo', 'oh polly', 'plt'].map(f => (
                  <button key={f} onClick={() => setSpyFilter(f)}
                    className={"px-3 py-1.5 text-xs rounded transition-colors capitalize " + (spyFilter === f ? 'bg-[#c9a96e]/20 text-[#c9a96e] border border-[#c9a96e]/30' : 'text-white/30 hover:text-white/60 border border-white/[0.06]')}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Analyse */}
            {liveData?.spy?.ai_analysis?.winning_patterns && (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/[0.03] border border-white/[0.06] p-5">
                  <h3 className="text-white/30 text-xs tracking-widest uppercase mb-3">Winning Patronen</h3>
                  <div className="space-y-2">
                    {(liveData.spy.ai_analysis.winning_patterns || []).map((p: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></div>
                        <p className="text-white/50 text-xs">{p}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] p-5">
                  <h3 className="text-white/30 text-xs tracking-widest uppercase mb-3">Hook Types</h3>
                  <div className="space-y-2">
                    {(liveData.spy.ai_analysis.hook_types || []).map((h: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#c9a96e] mt-1.5 flex-shrink-0"></div>
                        <p className="text-white/50 text-xs">{h}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] p-5">
                  <h3 className="text-white/30 text-xs tracking-widest uppercase mb-3">Targeting Advies</h3>
                  {liveData.spy.ai_analysis.recommended_targeting && (
                    <div className="space-y-2">
                      {[
                        { label: 'Leeftijd', value: liveData.spy.ai_analysis.recommended_targeting.ages },
                        { label: 'Geslacht', value: liveData.spy.ai_analysis.recommended_targeting.gender },
                        { label: 'Interesses', value: (liveData.spy.ai_analysis.recommended_targeting.interests || []).join(', ') },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between py-1 border-b border-white/[0.04]">
                          <p className="text-white/20 text-xs">{item.label}</p>
                          <p className="text-white/50 text-xs">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Meave & Ivy Ad Suggesties */}
            {(liveData?.spy?.ai_analysis?.meave_ivy_ads || []).length > 0 && (
              <div className="bg-[#c9a96e]/5 border border-[#c9a96e]/15 p-5 rounded">
                <h3 className="text-[#c9a96e] text-xs tracking-widest uppercase mb-4">✍️ Kant-en-klare Meave & Ivy Ads</h3>
                <div className="space-y-4">
                  {(liveData.spy.ai_analysis.meave_ivy_ads || []).map((ad: any, i: number) => (
                    <div key={i} className="bg-white/[0.03] border border-white/[0.06] p-4 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[#c9a96e] text-xs font-medium">Suggestie {i+1} · {ad.product_type}</p>
                        <p className="text-white/20 text-xs">{ad.why_it_wins}</p>
                      </div>
                      <p className="text-white/80 text-sm font-medium mb-1">{ad.hook}</p>
                      <p className="text-white/40 text-xs leading-relaxed mb-2">{ad.body}</p>
                      <p className="text-white/30 text-xs">Link titel: <span className="text-white/50">{ad.title}</span></p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Concurrent Intelligence */}
            {liveData?.spy?.competitor_intelligence && Object.keys(liveData.spy.competitor_intelligence).length > 0 && (
              <div className="bg-white/[0.03] border border-white/[0.06] p-5">
                <h3 className="text-white/30 text-xs tracking-widest uppercase mb-4">🏢 Concurrent Intelligence</h3>
                <div className="space-y-2">
                  {Object.entries(liveData.spy.competitor_intelligence)
                    .sort(([,a]: any, [,b]: any) => b.total_ads - a.total_ads)
                    .slice(0, 6)
                    .map(([name, data]: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 py-2 border-b border-white/[0.04]">
                      <div className="flex-1">
                        <p className="text-white/60 text-xs font-medium">{name}</p>
                        <p className="text-white/20 text-xs">
                          {Object.entries(data.hook_patterns || {}).sort(([,a]: any, [,b]: any) => b - a).slice(0,2).map(([h]: any) => h).join(' · ')}
                        </p>
                      </div>
                      <div className="flex gap-6 text-right">
                        <div><p className="text-white/20 text-xs mb-0.5">Ads</p><p className="text-white/50 text-xs">{data.total_ads}</p></div>
                        <div><p className="text-white/20 text-xs mb-0.5">Gem. dagen</p><p className={"text-xs " + (data.avg_days >= 30 ? 'text-emerald-400' : 'text-white/50')}>{data.avg_days}d</p></div>
                        <div><p className="text-white/20 text-xs mb-0.5">Max score</p><p className={"text-xs " + (data.max_score >= 70 ? 'text-emerald-400' : data.max_score >= 50 ? 'text-amber-400' : 'text-white/50')}>{data.max_score}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Copy Intelligence */}
            {liveData?.spy?.copy_intelligence?.top_power_words && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.03] border border-white/[0.06] p-5">
                  <h3 className="text-white/30 text-xs tracking-widest uppercase mb-3">💬 Top Power Words</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(liveData.spy.copy_intelligence.top_power_words || {}).slice(0, 12).map(([word, count]: any, i: number) => (
                      <span key={i} className="bg-white/[0.05] border border-white/[0.08] px-2 py-1 rounded text-white/50 text-xs">
                        {word} <span className="text-white/20">({count})</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] p-5">
                  <h3 className="text-white/30 text-xs tracking-widest uppercase mb-3">🎯 Top Hooks</h3>
                  <div className="space-y-2">
                    {(liveData.spy.copy_intelligence.top_hooks || []).slice(0, 4).map((hook: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#c9a96e] mt-1.5 flex-shrink-0"></div>
                        <p className="text-white/40 text-xs italic">"{hook.substring(0, 80)}{hook.length > 80 ? '...' : ''}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Ad Varianten */}
            {(liveData?.spy?.ad_variants || []).length > 0 && (
              <div className="bg-[#c9a96e]/5 border border-[#c9a96e]/15 p-5 rounded">
                <h3 className="text-[#c9a96e] text-xs tracking-widest uppercase mb-4">✍️ Kant-en-klare Ad Varianten</h3>
                <div className="space-y-6">
                  {(liveData.spy.ad_variants || []).map((item: any, i: number) => (
                    <div key={i}>
                      <p className="text-white/30 text-xs mb-3">
                        Gebaseerd op: <span className="text-white/50">{item.source_ad?.page_name}</span>
                        <span className="ml-2 text-white/20">({item.source_ad?._days_running}d actief · score {item.source_ad?._score})</span>
                      </p>
                      <div className="grid grid-cols-1 gap-3">
                        {(item.variants?.variants || []).map((v: any, j: number) => (
                          <div key={j} className="bg-white/[0.03] border border-white/[0.06] p-4 rounded">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="bg-[#c9a96e]/20 text-[#c9a96e] text-xs px-2 py-0.5 rounded">Variant {v.variant}</span>
                                <span className="text-white/30 text-xs">{v.angle}</span>
                              </div>
                              {item.variants?.recommended_first_test === v.variant && (
                                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded">Aanbevolen</span>
                              )}
                            </div>
                            <p className="text-white/80 text-sm font-medium mb-1">"{v.hook}"</p>
                            <p className="text-white/40 text-xs leading-relaxed mb-2">{v.body}</p>
                            <div className="flex items-center gap-4 text-xs text-white/30">
                              <span>CTA: <span className="text-white/50">{v.cta}</span></span>
                              <span>Titel: <span className="text-white/50">{v.link_title}</span></span>
                            </div>
                            <p className="text-white/20 text-xs mt-1 italic">{v.why_it_works}</p>
                          </div>
                        ))}
                      </div>
                      {item.variants?.visual_concept && (
                        <div className="mt-3 bg-white/[0.02] border border-white/[0.04] p-3 rounded">
                          <p className="text-white/20 text-xs mb-1 tracking-widest uppercase">Visual Concept</p>
                          <p className="text-white/40 text-xs">{item.variants.visual_concept}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Winning Ads lijst */}
            <div className="space-y-3">
              <h3 className="text-white/30 text-xs tracking-widest uppercase">
                {spyFilter === 'winners' ? 'Winning Ads (30+ dagen actief)' :
                 spyFilter === 'all' ? 'Alle Gescande Ads' :
                 'Ads van ' + spyFilter}
              </h3>
              {(() => {
                const allAds = liveData?.spy?.top_ads || []
                const filtered = allAds.filter((ad: any) => {
                  if (spyFilter === 'winners') return ad._score >= 50
                  if (spyFilter === 'all') return true
                  return (ad.page_name || '').toLowerCase().includes(spyFilter)
                })

                if (filtered.length === 0) {
                  return (
                    <div className="bg-white/[0.02] border border-white/[0.06] p-8 rounded text-center">
                      <p className="text-white/20 text-sm mb-2">🕵️ Geen ads gevonden</p>
                      <p className="text-white/10 text-xs">Wacht op Meta Ad Library API goedkeuring</p>
                      <p className="text-white/10 text-xs mt-1">Je ID verificatie is ingediend — max 48 uur</p>
                    </div>
                  )
                }

                return filtered.map((ad: any, i: number) => {
                  const isExpanded = expandedAd === ad.id
                  const days = ad._days_running || 0
                  const score = ad._score || 0
                  const bodies = ad.ad_creative_bodies || []
                  const titles = ad.ad_creative_link_titles || []
                  const isWinner = score >= 50

                  return (
                    <div key={i} className={"border rounded overflow-hidden " + (isWinner ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-white/[0.02] border-white/[0.06]')}>
                      <button onClick={() => setExpandedAd(isExpanded ? null : ad.id)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors text-left">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {isWinner && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">WINNER</span>}
                            <p className="text-white/80 text-sm truncate">{ad.page_name || 'Unknown'}</p>
                          </div>
                          <p className="text-white/30 text-xs truncate">{bodies[0]?.substring(0, 80) || 'geen copy'}...</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-right flex-shrink-0">
                          <div>
                            <p className="text-white/20 text-xs mb-0.5">Dagen actief</p>
                            <p className={"text-sm " + (days >= 30 ? 'text-emerald-400' : days >= 14 ? 'text-amber-400' : 'text-white/40')}>{days}d</p>
                          </div>
                          <div>
                            <p className="text-white/20 text-xs mb-0.5">Score</p>
                            <p className={"text-sm " + (score >= 70 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-white/40')}>{score}</p>
                          </div>
                          <div>
                            <p className="text-white/20 text-xs mb-0.5">Platform</p>
                            <p className="text-white/40 text-xs">{(ad.publisher_platforms || []).join(', ') || '—'}</p>
                          </div>
                        </div>
                        <span className="text-white/20 text-xs flex-shrink-0">{isExpanded ? '▲' : '▼'}</span>
                      </button>
                      {isExpanded && (
                        <div className="border-t border-white/[0.06] p-4 space-y-3">
                          {bodies.length > 0 && (
                            <div>
                              <p className="text-white/20 text-xs mb-1 tracking-widest uppercase">Ad Copy</p>
                              <p className="text-white/60 text-sm leading-relaxed">{bodies[0]}</p>
                            </div>
                          )}
                          {titles.length > 0 && (
                            <div>
                              <p className="text-white/20 text-xs mb-1 tracking-widest uppercase">Titel</p>
                              <p className="text-white/50 text-sm">{titles[0]}</p>
                            </div>
                          )}
                          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/[0.04]">
                            <div>
                              <p className="text-white/20 text-xs mb-1">Start datum</p>
                              <p className="text-white/40 text-xs">{ad.ad_delivery_start_time?.substring(0, 10) || '—'}</p>
                            </div>
                            <div>
                              <p className="text-white/20 text-xs mb-1">Bron</p>
                              <p className="text-white/40 text-xs">{ad._source || '—'}</p>
                            </div>
                            <div>
                              <p className="text-white/20 text-xs mb-1">Target leeftijd</p>
                              <p className="text-white/40 text-xs">{(ad.target_ages || []).join(', ') || '—'}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              })()}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
