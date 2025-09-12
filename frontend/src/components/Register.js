import React, {useState} from 'react';
import axios from 'axios';
export default function Register({onRegister}){
  const [email,setEmail]=useState(''), [password,setPassword]=useState(''), [name,setName]=useState(''), [err,setErr]=useState('');
  const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';
  const submit=async e=>{
    e.preventDefault();
    try{
      const res = await axios.post(API + '/api/auth/signup',{email,password,name});
      onRegister(res.data.token, res.data.user);
    }catch(err){ setErr(err.response?.data?.error || 'Signup failed'); }
  }
  return (<div className='card'><h3>Register</h3><form onSubmit={submit}><input value={name} onChange={e=>setName(e.target.value)} placeholder='name'/><input value={email} onChange={e=>setEmail(e.target.value)} placeholder='email'/><input value={password} onChange={e=>setPassword(e.target.value)} placeholder='password' type='password'/><button type='submit'>Register</button>{err && <div style={{color:'red'}}>{err}</div>}</form></div>)
}
