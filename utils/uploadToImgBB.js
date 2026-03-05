const axios = require("axios");

const uploadToImgBB = async (base64Image) => {
  const formData = new URLSearchParams();
  formData.append("image", base64Image);

  const response = await axios.post(
    `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
    formData.toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      maxBodyLength: Infinity,
    }
  );

  return response.data.data.url;
};

module.exports = uploadToImgBB;
