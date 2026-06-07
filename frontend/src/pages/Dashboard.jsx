import { useEffect, useState } from 'react';
import api from '../api/axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
export default function Dashboard() {
  const [d, setD] = useState(null);
  useEffect(() => { api.get('/dashboard').then(r => setD(r.data)); }, []);
  if (!d) return <p>Loading…</p>;
  const chart = [...(d.recentRoi || [])].reverse().map(r => ({ date: r.dateKey, roi: r.amount }));
  return (
    <>
      <h1 style={{marginBottom:20}}>Dashboard</h1>
      <div className="cards">
        <Card label="Total Investments" val={`$${d.totalInvestments.toFixed(2)}`} />
        <Card label="Total ROI Earned" val={`$${d.totalRoiEarned.toFixed(2)}`} />
        <Card label="Level Income" val={`$${d.totalLevelIncome.toFixed(2)}`} />
        <Card label="Wallet Balance" val={`$${d.walletBalance.toFixed(2)}`} />
      </div>
      <div className="panel">
        <h3>ROI Trend (last 30 entries)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chart}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3"/>
            <XAxis dataKey="date" stroke="#94a3b8"/>
            <YAxis stroke="#94a3b8"/>
            <Tooltip contentStyle={{background:'#0f172a',border:'1px solid #334155'}}/>
            <Line type="monotone" dataKey="roi" stroke="#22d3ee" strokeWidth={2}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
function Card({label, val}) { return <div className="card"><h4>{label}</h4><div className="val">{val}</div></div>; }
