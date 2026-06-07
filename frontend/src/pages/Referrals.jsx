import { useEffect, useState } from 'react';
import api from '../api/axios';
import ReferralTree from '../components/ReferralTree';
import { useAuth } from '../context/AuthContext';
export default function Referrals() {
  const { user } = useAuth();
  const [direct, setDirect] = useState([]);
  const [tree, setTree] = useState([]);
  const [income, setIncome] = useState([]);
  useEffect(() => {
    api.get('/referrals/direct').then(r => setDirect(r.data));
    api.get('/referrals/tree').then(r => setTree(r.data));
    api.get('/referrals/income').then(r => setIncome(r.data));
  }, []);
  const link = `${location.origin}/register?ref=${user?.referralCode}`;
  return (
    <>
      <h1 style={{marginBottom:20}}>Referrals</h1>
      <div className="panel">
        <h3>Your Referral Link</h3>
        <code style={{background:'#0f172a',padding:10,borderRadius:6,display:'block'}}>{link}</code>
      </div>
      <div className="panel"><h3>Direct Referrals ({direct.length})</h3>
        <table><thead><tr><th>Name</th><th>Email</th><th>Code</th><th>Joined</th></tr></thead>
        <tbody>{direct.map(u => (
          <tr key={u._id}><td>{u.fullName}</td><td>{u.email}</td><td>{u.referralCode}</td>
          <td>{new Date(u.createdAt).toLocaleDateString()}</td></tr>))}</tbody></table>
      </div>
      <div className="panel"><h3>Referral Tree</h3><ReferralTree nodes={tree}/></div>
      <div className="panel"><h3>Level Income History</h3>
        <table><thead><tr><th>Date</th><th>From</th><th>Level</th><th>Amount</th></tr></thead>
        <tbody>{income.map(r => (
          <tr key={r._id}><td>{new Date(r.date).toLocaleDateString()}</td>
          <td>{r.source?.fullName}</td><td>L{r.level}</td><td>${r.amount.toFixed(4)}</td></tr>))}</tbody></table>
      </div>
    </>
  );
}
