module.exports.config = {
  name: "wallpaper",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  credits: "Chael",
  description: "Search for wallpapers",
  usages: "wallpaper [query]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require('axios');
  const fs = require('fs-extra');
  const path = require('path');

  try {
    const { threadID, messageID } = event;
    const query = args.join(" ");
    if (!query) return api.sendMessage("Please provide your query.", threadID, messageID);

    api.sendMessage(`Searching for wallpapers related to "${query}"`, threadID, messageID);

    const response = await axios.get(`https://deku-rest-api.gleeze.com/api/wallpaper?q=${encodeURIComponent(query)}`);
    const wallpapers = response.data.result;

    if (wallpapers.length === 0) {
      return api.sendMessage("No wallpapers found.", threadID, messageID);
    }

    const attachments = [];
    const filePaths = [];

    for (let i = 0; i < wallpapers.length; i++) {
      const imageUrl = wallpapers[i].image;
      const time = new Date();
      const timestamp = time.toISOString().replace(/[:.]/g, "-");
      const imagePath = path.join(__dirname, `/cache/${timestamp}_wallpaper_${i}.png`);
      filePaths.push(imagePath);

      const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, "binary"));

      attachments.push(fs.createReadStream(imagePath));
    }

    api.sendMessage({
      body: "Here are your wallpapers:",
      attachment: attachments
    }, threadID, () => {
      // Delete all files after the message is sent
      filePaths.forEach((filePath) => {
        fs.unlink(filePath, (err) => {
          if (err) console.error(`Failed to delete file ${filePath}: ${err.message}`);
        });
      });
    });

  } catch (error) {
    api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
  }
};
