import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Sidebar() {
  const { user, logout } = useAuth();
  return (
    <aside className="sidebar">
      <h2>⚡ Nexachain</h2>
      <NavLink to="/" end>Dashboard</NavLink>
      <NavLink to="/investments">Investments</NavLink>
      <NavLink to="/roi">ROI History</NavLink>
      <NavLink to="/referrals">Referrals</NavLink>
      <div style={{marginTop:32,padding:12,background:'#0f172a',borderRadius:8,fontSize:13}}>
        <div style={{color:'#94a3b8'}}>Logged in as</div>
        <div style={{fontWeight:600,marginTop:4}}>{user?.fullName}</div>
        <div style={{color:'#22d3ee',marginTop:4}}>Code: {user?.referralCode}</div>
        <button className="btn" style={{marginTop:12,width:'100%'}} onClick={logout}>Logout</button>
      </div>
    </aside>
  );
}
