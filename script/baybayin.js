const axios = require('axios');

module.exports.config = {
  name: 'baybayin',
  version: '1.0.0',
  hasPermission: 0,
  usePrefix: true,
  aliases: ['translate', 'baybay'],
  description: "Translates text to Baybayin",
  usages: "baybayin [text]",
  credits: 'Developer',
  cooldowns: 3,
  dependencies: {
    "axios": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  const input = args.join(' ');

  if (!input) {
    api.sendMessage(`Please provide text to translate after 'baybayin'. For example: 'baybayin Mahal kita'`, event.threadID, event.messageID);
    return;
  }

  try {
    const url = `https://deku-rest-api.gleeze.com/api/baybay?q=${encodeURIComponent(input)}`;

    const { data } = await axios.get(url);

    if (data && data.status) {
      api.sendMessage(`${data.result}`, event.threadID, event.messageID);
    } else {
      api.sendMessage('Failed to translate the text.', event.threadID, event.messageID);
    }

  } catch (error) {
    api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};
