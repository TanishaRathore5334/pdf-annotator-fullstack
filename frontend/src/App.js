import React, {useState, useEffect} from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')||'null'));

  useEffect(()=>{
    if(token) localStorage.setItem('token', token); else localStorage.removeItem('token');
    if(user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
  },[token,user]);

  if(!token) return <div className='auth-wrap'><h2>PDF Annotator</h2><div><Login onLogin={(t,u)=>{setToken(t); setUser(u)}}/><Register onRegister={(t,u)=>{setToken(t); setUser(u)}}/></div></div>
  return <Dashboard api={API} token={token} user={user} onLogout={()=>{ setToken(null); setUser(null); }} />
}
