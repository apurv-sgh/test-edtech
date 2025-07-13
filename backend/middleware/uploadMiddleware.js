const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb){
      cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
    }
});

// Check file type.
function checkFileType(file, cb){
      const filetypes = /pdf|doc|docx|ppt|pptx/; // Allowed file types
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
      if(extname && mimetype){
            return cb(null, true);
      } else {
            cb('Error: File type not allowed!');
      }
}

const upload = multer({
      storage: storage,
      limits: { fileSize: 10000000 }, // Limit file size to 10MB
      fileFilter: function(req, file, cb) {
            checkFileType(file, cb);
      }
});

module.exports = upload;
// This code sets up a middleware for handling file uploads using multer. It configures the storage location, filename format, file size limit, and allowed file types. The uploads directory is created if it doesn't exist, and the middleware is exported for use in other parts of the application. This middleware can be used to handle file uploads in routes related to notes, quizzes, or tests in an educational application.