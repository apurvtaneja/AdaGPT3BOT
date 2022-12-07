require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  User
} = require('discord.js');  
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});
const {
  Configuration,
  OpenAIApi
} = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const { Console } = require("console");
// get fs module for creating write streams
const fs = require("fs");

// make a new logger
const myLogger = new Console({
  stdout: fs.createWriteStream("normalStdout.txt"),
  stderr: fs.createWriteStream("errorlogs.txt"),
});

// let prompt = fs.readFileSync('./Ada.txt', 'utf8');


client.on("messageCreate", function (message) {
  if (message.author.bot) return;

  // if (!message.mentions.has(client.user.id)) return;

  let prompt = `You: ${message.content}\n\n###\n\n`;
  (async () => {
    const gptResponse = await openai.createCompletion({
      model: "davinci:ft-personal-2022-12-06-19-20-02",
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 500,
      top_p: 0.3,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
      stop: ["###"],
    });

    message.reply(`${gptResponse.data.choices[0].text.substring(5)}`);
    // prompt += `${gptResponse.data.choices[0].text}\n`;

    // var writeStream = fs.createWriteStream("./Ada.txt");
    // writeStream.write(prompt);
    // writeStream.end();
  })();
});

client.on('error', err => {
  console.warn(err);
});

client.login(process.env.BOT_TOKEN);