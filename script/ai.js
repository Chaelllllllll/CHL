const axios = require('axios');

module.exports.config = {
  name: 'ai',
  version: '1.0.0',
  role: 0,
  usePrefix: false,
  aliases: ['gpt', 'openai'],
  description: "An AI command powered by GPT-4",
  usages: "ai [prompt]",
  credits: 'Chael',
  cooldowns: 3,
  dependencies: {
    "axios": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  const input = args.join(' ');

  if (!input) {
    api.sendMessage(`Please provide a question or statement after 'ai'. For example: 'ai What is the capital of France?'`, event.threadID, event.messageID);
    return;
  }

  const ask = ["who made you", "who created you", "who is your creator", "who is your developer", "who is your owner", "sino ka", "sino gumawa sayo", "who are you", "who developed you", "who develop you"];

  if (ask.includes(input.toLowerCase())) {
    api.sendMessage("Hi, I was made by Chael! https://www.facebook.com/chaelyoooo/", event.threadID, event.messageID);
    return;
  } else {
    try {
      const url = `https://deku-rest-api.gleeze.com/gpt4?prompt=${encodeURIComponent(input)}&uid=${encodeURIComponent(event.senderID)}`;
      const { data } = await axios.get(url);
      api.sendMessage(`${data.gpt4}`, event.threadID, event.messageID);
    } catch {
      api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
    }
  }
};