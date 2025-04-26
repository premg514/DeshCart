const cloudinary = require("cloudinary").v2;
require('dotenv').config();

exports.connectToCloudinary = () => {
  try {
    cloudinary.config({
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
      cloud_name: process.env.CLOUD_NAME,
    });
    console.log("Cloudinary config set");
  } catch (err) {
    console.error("Error while connecting to Cloudinary:", err);
  }
};
