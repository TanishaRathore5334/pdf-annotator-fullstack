const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
module.exports = (req,res,next)=>{
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if(!token) return res.status(401).json({error:'no token'});
  try{
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  }catch(err){ return res.status(401).json({error:'invalid token'}); }
}
