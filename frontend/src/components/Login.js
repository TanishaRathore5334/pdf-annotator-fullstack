import React, {useState} from 'react';
import axios from 'axios';
export default function Login({onLogin}){
  const [email,setEmail]=useState(''), [password,setPassword]=useState(''), [err,setErr]=useState('');
  const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';
  const submit=async e=>{
    e.preventDefault();
    try{
      const res = await axios.post(API + '/api/auth/login',{email,password});
      onLogin(res.data.token, res.data.user);
    }catch(err){ setErr(err.response?.data?.error || 'Login failed'); }
  }
  return (<div className='card'><h3>Login</h3><form onSubmit={submit}><input value={email} onChange={e=>setEmail(e.target.value)} placeholder='email'/><input value={password} onChange={e=>setPassword(e.target.value)} placeholder='password' type='password'/><button type='submit'>Login</button>{err && <div style={{color:'red'}}>{err}</div>}</form></div>)
}
