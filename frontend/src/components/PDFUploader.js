import React, {useState} from 'react';
import axios from 'axios';
export default function PDFUploader({api, token, onUploaded}){
  const [file,setFile]=useState(null);
  const upload = async e=>{
    e.preventDefault();
    if(!file) return alert('choose file');
    const fd = new FormData();
    fd.append('file', file);
    const res = await axios.post(api + '/api/pdfs/upload', fd, {headers: {Authorization:'Bearer '+token, 'Content-Type':'multipart/form-data'}});
    onUploaded(res.data.pdf);
  }
  return (<div className='uploader'><h4>Upload PDF</h4><form onSubmit={upload}><input type='file' accept='application/pdf' onChange={e=>setFile(e.target.files[0])}/><button type='submit'>Upload</button></form></div>)
}
