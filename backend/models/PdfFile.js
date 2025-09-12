const mongoose = require('mongoose');
const PdfFileSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  filename: String,
  originalname: String,
  uuid: {type: String, required: true, unique: true},
  createdAt: {type: Date, default: Date.now}
});
module.exports = mongoose.model('PdfFile', PdfFileSchema);
