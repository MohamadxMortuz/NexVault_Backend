const mongoose = require('mongoose');

const downloadHistorySchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  mimeType: { type: String, required: true },
  downloadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  downloadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DownloadHistory', downloadHistorySchema);
