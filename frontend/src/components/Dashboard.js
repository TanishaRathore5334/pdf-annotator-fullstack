import React, {useState, useEffect} from 'react';
import axios from 'axios';
import PDFUploader from './PDFUploader';
import PDFViewer from './PDFViewer';

export default function Dashboard({api, token, user, onLogout}){
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(()=>{ fetchList(); },[]);
  const fetchList = async ()=>{
    const res = await axios.get(api + '/api/pdfs/list', {headers:{Authorization:'Bearer '+token}});
    setList(res.data.list);
  }

  const handleUploaded = (pdf)=>{ setList(prev=>[pdf,...prev]); };
  return (<div><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><h2>My Library</h2><div>{user?.email} <button onClick={onLogout}>Logout</button></div></div><div className='dashboard'><div className='sidebar card'><PDFUploader api={api} token={token} onUploaded={handleUploaded}/><h4>Your PDFs</h4><ul className='pdf-list'>{list.map(p=> <li key={p.uuid}><div onClick={()=>setSelected(p)} style={{cursor:'pointer'}}>{p.originalname}</div><div><button onClick={async ()=>{ await axios.delete(api + '/api/pdfs/'+p.uuid, {headers:{Authorization:'Bearer '+token}}); fetchList(); }}>Delete</button></div></li>)}</ul></div><div className='content card'>{selected ? <PDFViewer api={api} token={token} pdf={selected}/> : <div>Select a PDF to view</div>}</div></div></div>)
}
