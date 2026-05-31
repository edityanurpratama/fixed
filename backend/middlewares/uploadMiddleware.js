const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Determine extension from mime type if original has none
        const mimeToExt = {
            'image/jpeg': '.jpg',
            'image/jpg': '.jpg',
            'image/png': '.png',
            'image/webp': '.webp',
            'image/heic': '.heic',
        };
        const ext = path.extname(file.originalname) || mimeToExt[file.mimetype] || '.jpg';
        cb(null, `${Date.now()}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    // Accept any image/* mimetype — covers jpeg, png, webp, heic (from iPhone cameras)
    if (file.mimetype.startsWith('image/')) {
        return cb(null, true);
    }
    // Also accept by extension as fallback
    const allowedExt = /\.(jpeg|jpg|png|webp|heic)$/i;
    if (allowedExt.test(path.extname(file.originalname))) {
        return cb(null, true);
    }
    cb(new Error('Hanya file gambar yang diizinkan (jpg, png, webp)'));
};

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB (camera photos can be large)
    fileFilter,
});

module.exports = upload;
