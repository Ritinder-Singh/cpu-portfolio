'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

interface Analytics {
  totalVisits: number;
  todayVisits: number;
  dailyVisits: { date: string; count: number }[];
  topCommands: { command: string; count: number }[];
  dailyCommands: { date: string; count: number }[];
}

const S = {
  h1: { color: '#bd93f9', fontSize: 22, marginBottom: 24 } as React.CSSProperties,
  statsRow: { display: 'flex', gap: 16, marginBottom: 32 } as React.CSSProperties,
  card: {
    flex: 1,
    background: '#151515',
    border: '1px solid #222',
    borderRadius: 8,
    padding: 20,
  } as React.CSSProperties,
  statVal: { fontSize: 36, color: '#bd93f9', fontWeight: 'bold' } as React.CSSProperties,
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 } as React.CSSProperties,
  section: { marginBottom: 36 } as React.CSSProperties,
  sectionTitle: { color: '#888', fontSize: 13, marginBottom: 12, textTransform: 'uppercase' as const },
  chartWrap: {
    background: '#151515',
    border: '1px solid #222',
    borderRadius: 8,
    padding: '20px 8px 8px',
    height: 240,
  } as React.CSSProperties,
};

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch('/api/admin/analytics').then(r => r.json()).then(setData);
  }, []);

  if (!data) {
    return <div style={{ color: '#555' }}>Loading analytics...</div>;
  }

  const visitChartData = data.dailyVisits.map(d => ({
    date: new Date(d.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    visits: d.count,
  }));

  return (
    <div>
      <h1 style={S.h1}>Dashboard</h1>

      <div style={S.statsRow}>
        <div style={S.card}>
          <div style={S.statVal}>{data.totalVisits.toLocaleString()}</div>
          <div style={S.statLabel}>Total visits</div>
        </div>
        <div style={S.card}>
          <div style={S.statVal}>{data.todayVisits.toLocaleString()}</div>
          <div style={S.statLabel}>Visits today</div>
        </div>
        <div style={S.card}>
          <div style={S.statVal}>{data.topCommands[0]?.command ?? '—'}</div>
          <div style={S.statLabel}>Most used command</div>
        </div>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>Daily Visitors — last 30 days</div>
        <div style={S.chartWrap}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={visitChartData} margin={{ top: 0, right: 16, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="visitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#bd93f9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#bd93f9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
              <XAxis dataKey="date" tick={{ fill: '#555', fontSize: 11 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#555', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 4, fontSize: 12 }} />
              <Area type="monotone" dataKey="visits" stroke="#bd93f9" fill="url(#visitGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>Top Commands</div>
        <div style={S.chartWrap}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.topCommands} margin={{ top: 0, right: 16, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
              <XAxis dataKey="command" tick={{ fill: '#555', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#555', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 4, fontSize: 12 }} />
              <Bar dataKey="count" fill="#ff79c6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
