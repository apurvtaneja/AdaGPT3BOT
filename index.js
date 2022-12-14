require('dotenv').config();
var Deque = require("collections/deque");

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


// let prompt = fs.readFileSync('./Ada.txt', 'utf8');
const OrigPrompt = "YOUR_PROMPT";
var deque = new Deque([""]);

client.on("messageCreate", function (message) {
  if (message.author.bot) return;

  // if (!message.mentions.has(client.user.id)) return;

//   let prompt = `You: ${message.content}\n\n###\n\n`;
    let prompt = OrigPrompt + deque.join("") + ` ${message.content}\n\n###\n\n`;

  (async () => {
    const gptResponse = await openai.createCompletion({
      model: "davinci:ft-personal-2022-12-06-19-20-02",
      prompt: prompt,
      temperature: 0.9,
      max_tokens: 500,
      top_p: 1.0,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
      stop: ["###"],
    });

    message.reply(`${gptResponse.data.choices[0].text.substring(5)}`);
    
    deque.push(`\n${message.content}\n` + `${gptResponse.data.choices[0].text}###`);
    console.log("Pushed");
      
    
    console.log(deque.length);
    if(deque.length >= 10){
      deque.shift();
      console.log("Sifted");
    }
    console.log(deque.join(""));
  })();
});

client.on('error', err => {
  console.warn(err);
});

client.login(process.env.BOT_TOKEN);
