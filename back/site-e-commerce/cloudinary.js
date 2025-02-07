const cloudinary = require("cloudinary").v2;

const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;
cloudinary.config({
  cloud_name: "ddsrn06vn",
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
});

module.exports = { cloudinary };
