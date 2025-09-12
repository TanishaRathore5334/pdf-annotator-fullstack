const mongoose = require('mongoose');
const HighlightSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  pdfUuid: {type: String, required: true},
  page: Number,
  text: String,
  boundingRect: Object,
  createdAt: {type: Date, default: Date.now},
  note: String
});
module.exports = mongoose.model('Highlight', HighlightSchema);
