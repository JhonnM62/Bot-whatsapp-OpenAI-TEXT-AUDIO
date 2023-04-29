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
