const { CoreClass } = require("@bot-whatsapp/bot");
const { downloadMediaMessage } = require("@adiwajshing/baileys");
const { transcribeAudio } = require("./voz-a-texto");
const { convertAudio } = require("./convertidor-audio");
const { writeFile } = require("fs/promises");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

class chatGPTclass extends CoreClass {
  queue = [];
  optionsGPT = { model: "gpt-4" };
  openai = undefined;
  constructor(_database, _provider) {
    super(null, _database, _provider);
    this.init().then();
  }

  init = async () => {
    const { ChatGPTAPI } = await import("chatgpt");
    this.openai = new ChatGPTAPI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  };

  handleMsg = async (ctx) => {
    if (/^_event_voice_note_/.test(ctx.body)) {
      const buffer = await downloadMediaMessage(ctx, "buffer");
      const filePath = path.resolve(__dirname, "./", `${ctx.from}.ogg`);
      await fs.promises.writeFile(filePath, buffer);
      const fileogg = await convertAudio(filePath);
      const Prueba = await transcribeAudio(fileogg);
      console.log(">>text: ",Prueba);
      ctx.body = await Prueba.text;
    }

    const { from, body } = ctx;
    const completada = await this.openai.sendMessage(body, {
      conversationId: !this.queue.length
        ? undefined
        : this.queue[this.queue.length - 1].conversationId,
      parentMessageId: !this.queue.length
        ? undefined
        : this.queue[this.queue.length - 1].id,
    });
    this.queue.push(completada);
    const parseMessage = {
      ...completada,
      answer: completada.text,
    };
    this.sendFlowSimple([parseMessage], from);
  };
}
module.exports = chatGPTclass;
