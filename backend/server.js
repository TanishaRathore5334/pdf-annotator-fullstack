const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const pdfRoutes = require('./routes/pdfs');
const highlightRoutes = require('./routes/highlights');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pdf_annotator';

mongoose.connect(MONGODB_URI, {useNewUrlParser:true, useUnifiedTopology:true})
  .then(()=> console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error', err));

app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/pdfs', pdfRoutes);
app.use('/api/highlights', highlightRoutes);

app.get('/', (req, res) => res.send({ok:true, msg:'PDF Annotator Backend'}));

app.listen(PORT, ()=> console.log('Server started on port', PORT));
