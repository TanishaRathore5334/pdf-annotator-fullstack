import React, {useEffect, useState, useRef} from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import axios from 'axios';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PDFViewer({api, token, pdf}){
  const [numPages,setNumPages]=useState(null);
  const [pageNumber,setPageNumber]=useState(1);
  const [highlights, setHighlights] = useState([]);
  const canvasRefs = useRef({});

  useEffect(()=>{ if(pdf) fetchHighlights(); },[pdf]);
  const fetchHighlights = async ()=>{
    const res = await axios.get(api + '/api/highlights/' + pdf.uuid, {headers:{Authorization:'Bearer '+token}});
    setHighlights(res.data.list || []);
  }

  function onDocumentLoadSuccess({ numPages }){
    setNumPages(numPages);
    setPageNumber(1);
  }

  // Basic click-to-highlight demo: this does NOT capture exact bounding rectangles,
  // but saves a simple highlight object. For production use, integrate text-layer selection.
  const addHighlight = async ()=>{
    const text = prompt('Enter highlighted text (demo)');
    if(!text) return;
    const payload = {pdfUuid: pdf.uuid, page: pageNumber, text, boundingRect: {demo:true}};
    const res = await axios.post(api + '/api/highlights', payload, {headers:{Authorization:'Bearer '+token}});
    setHighlights(prev=>[res.data.highlight, ...prev]);
  }

  return (<div><h3>{pdf.originalname}</h3><div style={{marginBottom:8}}><button onClick={()=>setPageNumber(p=> Math.max(1,p-1))}>Prev</button> <button onClick={()=>setPageNumber(p=> Math.min(numPages||1,p+1))}>Next</button> <button onClick={addHighlight}>Add Highlight (demo)</button></div><div style={{overflow:'auto'}}><Document file={api + '/uploads/' + pdf.filename} onLoadSuccess={onDocumentLoadSuccess}><Page pageNumber={pageNumber} width={800} /></Document></div><div style={{marginTop:10}}><h4>Highlights (page {pageNumber})</h4><ul>{highlights.filter(h=>h.page===pageNumber).map(h=> <li key={h._id}>{h.text} <small>• {new Date(h.createdAt).toLocaleString()}</small></li>)}</ul></div></div>)
}
