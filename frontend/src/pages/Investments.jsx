import { useEffect, useState } from 'react';
import api from '../api/axios';
export default function Investments() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ amount: 1000, planName: 'Starter', durationDays: 30, dailyRoiPercent: 1.5 });
  const load = () => api.get('/investments').then(r => setList(r.data));
  useEffect(load, []);
  const submit = async (e) => {
    e.preventDefault();
    await api.post('/investments', { ...form, amount: +form.amount, durationDays: +form.durationDays, dailyRoiPercent: +form.dailyRoiPercent });
    load();
  };
  return (
    <>
      <h1 style={{marginBottom:20}}>Investments</h1>
      <div className="panel">
        <h3>New Investment</h3>
        <form onSubmit={submit} style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12}}>
          {['amount','planName','durationDays','dailyRoiPercent'].map(k =>
            <input key={k} className="input" placeholder={k} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})}/>)}
          <button className="btn">Invest</button>
        </form>
      </div>
      <div className="panel">
        <h3>History</h3>
        <table><thead><tr><th>Plan</th><th>Amount</th><th>Daily %</th><th>Start</th><th>End</th><th>Status</th></tr></thead>
          <tbody>{list.map(i => (
            <tr key={i._id}><td>{i.planName}</td><td>${i.amount}</td><td>{i.dailyRoiPercent}%</td>
              <td>{new Date(i.startDate).toLocaleDateString()}</td>
              <td>{new Date(i.endDate).toLocaleDateString()}</td><td>{i.status}</td></tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}
