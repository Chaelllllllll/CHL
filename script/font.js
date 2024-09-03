const axios = require('axios');

module.exports.config = {
  name: 'font',
  version: '1.0.0',
  hasPermission: 0,
  usePrefix: true,
  aliases: ['font'],
  description: "Translates text into various fonts",
  usages: "font [text] | [font]",
  credits: 'Chael',
  cooldowns: 3,
  dependencies: {
    "axios": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  const input = args.join(' ').split('|');
  const text = input[0].trim(); 
  const font = input[1] ? input[1].trim() : 'sansbold';

  if (!text) {
    api.sendMessage(`Please provide text to translate. Usage: 'font [text] | [font]'`, event.threadID, event.messageID);
    return;
  }

  try {
    const { data: fontData } = await axios.get('https://openapi-idk8.onrender.com/fonts');
    const availableFonts = fontData.fonts;

    if (!availableFonts.includes(font)) {
      api.sendMessage(`Invalid font specified. Available fonts are: \n${availableFonts.join(', ')}`, event.threadID, event.messageID);
      return;
    }

    const url = `https://openapi-idk8.onrender.com/convert?text=${encodeURIComponent(text)}&font=${encodeURIComponent(font)}`;
    const { data } = await axios.get(url);

    if (data && data.converted_text) {
      api.sendMessage(`${data.converted_text}`, event.threadID, event.messageID);
    } else {
      api.sendMessage('Failed to convert the text.', event.threadID, event.messageID);
    }

  } catch (error) {
    api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};
