const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';

router.post('/signup', async (req, res) => {
  const {email, password, name} = req.body;
  if(!email || !password) return res.status(400).json({error:'email and password required'});
  try{
    const existing = await User.findOne({email});
    if(existing) return res.status(400).json({error:'User exists'});
    const hash = await bcrypt.hash(password, 10);
    const user = new User({email, passwordHash: hash, name});
    await user.save();
    const token = jwt.sign({id:user._id, email:user.email}, JWT_SECRET, {expiresIn:'7d'});
    res.json({token, user:{id:user._id, email:user.email, name:user.name}});
  }catch(err){ console.error(err); res.status(500).json({error:'server error'}); }
});

router.post('/login', async (req, res) => {
  const {email, password} = req.body;
  if(!email || !password) return res.status(400).json({error:'email and password required'});
  try{
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({error:'Invalid credentials'});
    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) return res.status(400).json({error:'Invalid credentials'});
    const token = jwt.sign({id:user._id, email:user.email}, JWT_SECRET, {expiresIn:'7d'});
    res.json({token, user:{id:user._id, email:user.email, name:user.name}});
  }catch(err){ console.error(err); res.status(500).json({error:'server error'}); }
});

// middleware to verify token
router.get('/verify', (req,res)=>{
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if(!token) return res.status(401).json({error:'no token'});
  try{
    const payload = jwt.verify(token, JWT_SECRET);
    res.json({ok:true, payload});
  }catch(err){ res.status(401).json({error:'invalid token'}); }
});

module.exports = router;
