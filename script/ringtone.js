const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "ringtone",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  credits: "Chael",
  description: "Search ringtones",
  usages: "ringtone [query]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  try {
    const { threadID, messageID } = event;
    const query = args.join(" ");
    if (!query) return api.sendMessage("Please provide your search query.", threadID, messageID);

    api.sendMessage(`Searching for ${query} ringtones`, threadID, messageID);

    // Fetching data from the API
    const response = await axios.get(`https://deku-rest-api.gleeze.com/api/ringtone?q=${encodeURIComponent(query)}`);
    const results = response.data.result;

    if (results.length === 0) {
      return api.sendMessage("No ringtones found.", threadID, messageID);
    }

    // Formatting results
    let message = "Ringtones found:\n";
    results.forEach((result, index) => {
      message += `\n${index + 1}. ${result.title}\nAudio: ${result.audio}\n`;
    });

    api.sendMessage(message, threadID, messageID);

  } catch (error) {
    api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
  }
};
