import { useEffect, useState } from 'react';
import api from '../api/axios';
export default function Roi() {
  const [list, setList] = useState([]);
  useEffect(() => { api.get('/dashboard/roi').then(r => setList(r.data)); }, []);
  return (
    <>
      <h1 style={{marginBottom:20}}>ROI History</h1>
      <div className="panel">
        <table><thead><tr><th>Date</th><th>Plan</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>{list.map(r => (
          <tr key={r._id}><td>{r.dateKey}</td><td>{r.investment?.planName || '—'}</td>
            <td>${r.amount.toFixed(4)}</td><td>{r.status}</td></tr>
        ))}</tbody></table>
      </div>
    </>
  );
}
