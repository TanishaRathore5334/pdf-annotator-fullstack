const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Highlight = require('../models/Highlight');

router.post('/', auth, async (req,res)=>{
  const {pdfUuid, page, text, boundingRect, note} = req.body;
  if(!pdfUuid) return res.status(400).json({error:'pdfUuid required'});
  try{
    const h = new Highlight({user: req.user.id, pdfUuid, page, text, boundingRect, note});
    await h.save();
    res.json({ok:true, highlight:h});
  }catch(err){ console.error(err); res.status(500).json({error:'server error'}); }
});

router.get('/:pdfUuid', auth, async (req,res)=>{
  const list = await Highlight.find({user: req.user.id, pdfUuid: req.params.pdfUuid});
  res.json({ok:true, list});
});

router.put('/:id', auth, async (req,res)=>{
  const upd = await Highlight.findOneAndUpdate({_id:req.params.id, user:req.user.id}, req.body, {new:true});
  if(!upd) return res.status(404).json({error:'not found'});
  res.json({ok:true, highlight:upd});
});

router.delete('/:id', auth, async (req,res)=>{
  const del = await Highlight.findOneAndDelete({_id:req.params.id, user:req.user.id});
  if(!del) return res.json({ok:true});
  res.status(404).json({error:'not found'});
});

module.exports = router;
