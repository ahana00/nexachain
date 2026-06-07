import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try { await login(form.email, form.password); nav('/'); }
    catch (e) { setErr(e.response?.data?.message || 'Login failed'); }
  };
  return (
    <div className="auth">
      <h2>Sign in</h2>
      {err && <div className="err">{err}</div>}
      <form onSubmit={submit}>
        <input className="input" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
        <input className="input" type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}/>
        <button className="btn" style={{width:'100%'}}>Login</button>
      </form>
      <p style={{marginTop:16,fontSize:14}}>No account? <Link to="/register">Register</Link></p>
    </div>
  );
}
