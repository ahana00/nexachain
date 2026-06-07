import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ fullName:'', email:'', mobile:'', password:'', referralCode: params.get('ref') || '' });
  const [err, setErr] = useState('');
  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try { await register(form); nav('/'); }
    catch (e) { setErr(e.response?.data?.message || 'Register failed'); }
  };
  return (
    <div className="auth">
      <h2>Create account</h2>
      {err && <div className="err">{err}</div>}
      <form onSubmit={submit}>
        {['fullName','email','mobile','password','referralCode'].map(k => (
          <input key={k} className="input" type={k==='password'?'password':'text'}
            placeholder={k} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})}/>
        ))}
        <button className="btn" style={{width:'100%'}}>Register</button>
      </form>
      <p style={{marginTop:16,fontSize:14}}>Have an account? <Link to="/login">Sign in</Link></p>
    </div>
  );
}
