const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const PdfFile = require('../models/PdfFile');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
if(!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '-' + file.originalname;
    cb(null, name);
  }
});
const upload = multer({ storage });

router.post('/upload', auth, upload.single('file'), async (req,res)=>{
  if(!req.file) return res.status(400).json({error:'no file uploaded'});
  try{
    const uuid = uuidv4();
    const pdf = new PdfFile({
      user: req.user.id,
      filename: req.file.filename,
      originalname: req.file.originalname,
      uuid
    });
    await pdf.save();
    res.json({ok:true, pdf});
  }catch(err){ console.error(err); res.status(500).json({error:'server error'}); }
});

router.get('/list', auth, async (req,res)=>{
  const list = await PdfFile.find({user: req.user.id}).sort({createdAt:-1});
  res.json({ok:true, list});
});

router.get('/:uuid', auth, async (req,res)=>{
  const pdf = await PdfFile.findOne({uuid: req.params.uuid, user: req.user.id});
  if(!pdf) return res.status(404).json({error:'not found'});
  res.json({ok:true, pdf});
});

router.delete('/:uuid', auth, async (req,res)=>{
  const pdf = await PdfFile.findOneAndDelete({uuid: req.params.uuid, user: req.user.id});
  if(!pdf) return res.status(404).json({error:'not found'});
  // delete file
  const p = path.join(process.cwd(), (process.env.UPLOAD_DIR||'uploads'), pdf.filename);
  try{ if(fs.existsSync(p)) fs.unlinkSync(p); }catch(e){}
  res.json({ok:true});
});

module.exports = router;
