const axios = require('axios');

module.exports.config = {
  name: 'ai',
  version: '1.0.0',
  hasPermission: 0,
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

  try {
    const url = `https://mota-dev.x10.bz/ai?prompt=${encodeURIComponent(input)}&name=${encodeURIComponent(event.senderID)}`;

    const { data } = await axios.get(url);

    api.sendMessage(`${data.reply}`, event.threadID, event.messageID);

  } catch {
    api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};