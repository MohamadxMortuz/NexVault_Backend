const mongoose = require('mongoose');

const uploadHistorySchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  mimeType: { type: String, required: true },
  shareLink: { type: String, required: true },
  expiry: { type: String, default: 'after-download' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedAt: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('UploadHistory', uploadHistorySchema);
