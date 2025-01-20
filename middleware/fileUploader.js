const multer = require("multer");
// const fileType = require("file-type");
const fs = require("fs");
const sizeOf = require("image-size");

const { uploader, config } = require("cloudinary").v2;

config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const parser = multer({ storage: multer.diskStorage({}) });

const validatePassport = (path) => {
  // Read the file
  const file = fs.readFileSync(path);

  // Check file type
  // const type = await fileType.fromBuffer(file);
  // if (!type || !type.mime.startsWith("image")) {
  //   throw new Error("Uploaded file is not an image.");
  // }

  // Get image dimensions
  const dimensions = sizeOf(file);

  // Check if dimensions are within range for a passport photo
  const passportPhotoDimensions = {
    width: 800, // Adjust as needed
    height: 800, // Adjust as needed
  };
  console.log({ width: dimensions.width, height: dimensions.height });
  if (
    dimensions.width > passportPhotoDimensions.width ||
    dimensions.height > passportPhotoDimensions.height
  ) {
    throw new Error("Image dimensions do not match a passport photo.");
  }
};

const fileUploader = async (path) => {
  try {
    const data = await uploader.upload(path, {
      resource_type: "auto",
    });
    return { status: true, message: "Uploaded", data };
  } catch (error) {
    return { status: false, message: error.message, data: error };
  }
};

const deleteFile = async (publicId, fileType) => {
  try {
    await uploader.destroy(publicId, {
      resource_type: fileType === "document" ? "raw" : fileType,
    });
    return { status: true, message: "File deleted", data: null };
  } catch (error) {
    return { status: false, message: error.message, data: null };
  }
};

module.exports = {
  fileUploader,
  parser,
  deleteFile,
  validatePassport,
};
