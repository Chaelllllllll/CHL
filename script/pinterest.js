module.exports.config = {
  name: "pinterest",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  credits: "Chael",
  description: "Search image in Pinterest",
  usages: "pinterest [prompt]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require('axios');
  const fs = require('fs-extra');
  const path = require('path');

  try {
    const { threadID, messageID } = event;
    const query = args.join(" ");
    if (!query) return api.sendMessage("Please provide your prompt.", threadID, messageID);

    api.sendMessage(`Searching for ${query}`, threadID, messageID);

    const response = await axios.get(`https://pinte-hiroshi-api.vercel.app/pinterest?search=${encodeURIComponent(query)}&amount=10`);
    const images = response.data.data;

    if (images.length === 0) {
      return api.sendMessage("No images found.", threadID, messageID);
    }

    const attachments = [];

    for (let i = 0; i < images.length; i++) {
      const imageUrl = images[i];
      const time = new Date();
      const timestamp = time.toISOString().replace(/[:.]/g, "-");
      const imagePath = path.join(__dirname, `/cache/${timestamp}_pinterest_${i}.png`);

      const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, "binary"));

      attachments.push(fs.createReadStream(imagePath));
    }

    api.sendMessage({
      body: "Results",
      attachment: attachments
    }, threadID, () => {
      attachments.forEach((file) => fs.unlinkSync(file.path));
    });

  } catch (error) {
    api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
  }
};
