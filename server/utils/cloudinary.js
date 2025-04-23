import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import 'dotenv/config'
// Add validation
if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
  throw new Error('❌ Missing Cloudinary environment variables');
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Test configuration
cloudinary.api.ping()
  .then(() => console.log('✅ Cloudinary connection successful'))
  .catch(err => console.error('❌ Cloudinary connection failed:', err.message));

  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      return {
        folder: "chat_uploads",
        resource_type: "auto", // ✅ support image, video, audio, pdf
        use_filename: true,
        unique_filename: false,
      };
    },
  });

// ✨ Multer middleware with limits and optional filtering
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    console.log("Incoming file type:", file.mimetype);
    cb(null, true); // Accept all for now
  }
});

export { cloudinary, upload };
