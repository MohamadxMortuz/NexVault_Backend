const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const fileController = require('../controllers/fileController');

// Optional auth — attaches user if token present, continues either way
const authOptional = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const jwt = require('jsonwebtoken');
      const User = require('../models/User');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (user) { req.user = user; req.userId = user._id; }
    }
  } catch {}
  next();
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 32212254720 }
});

router.post('/upload', auth, upload.single('file'), fileController.uploadFile);
router.get('/my-files', auth, fileController.getUserFiles);
router.get('/download-history', auth, fileController.getDownloadHistory);
router.get('/shared/meta/:shareLink', fileController.getFileMeta);
router.get('/shared/:shareLink', fileController.getSharedFile);
router.get('/preview/:shareLink', fileController.previewFile);
router.delete('/:id', auth, fileController.deleteFile);
router.get('/info/:shareLink', fileController.getFileInfo);
router.get('/download/:shareLink', authOptional, fileController.downloadFile);

module.exports = router;
