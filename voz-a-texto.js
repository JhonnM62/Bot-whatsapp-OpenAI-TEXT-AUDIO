const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

async function transcribeAudio(filePath) {
  let data = new FormData();
  data.append("model", "whisper-1");
  data.append("file", fs.createReadStream(filePath));

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.openai.com/v1/audio/transcriptions",
    headers: {
      Authorization:
        "Bearer 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",
      ...data.getHeaders(),
    },
    data: data,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = {
  transcribeAudio,
};
