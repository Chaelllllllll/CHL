const axios = require('axios');

module.exports.config = {
  name: 'aiv2',
  version: '1.0.0',
  hasPermission: 0,
  usePrefix: false,
  aliases: ['gpt4', 'aiv2'],
  description: "An AI command powered by GPT-4",
  usages: "aiv2 [prompt]",
  credits: 'Chael',
  cooldowns: 3,
  dependencies: {
    "axios": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  const input = args.join(' ');

  if (!input) {
    api.sendMessage(`Please provide a question or statement after 'aiv2'. For example: 'aiv2 What is the capital of France?'`, event.threadID, event.messageID);
    return;
  }

  try {
    const url = `https://deku-rest-api.gleeze.com/gpt4?prompt=${encodeURIComponent(input)}&uid=${encodeURIComponent(event.senderID)}`;

    const { data } = await axios.get(url);

    api.sendMessage(`${data.gpt4}`, event.threadID, event.messageID);

  } catch {
    api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};
