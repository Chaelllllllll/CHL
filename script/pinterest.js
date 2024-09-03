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

    // Fetch 100 images
    const response = await axios.get(`https://pinte-hiroshi-api.vercel.app/pinterest?search=${encodeURIComponent(query)}&amount=100`);
    const images = response.data.data;

    if (images.length === 0) {
      return api.sendMessage("No images found.", threadID, messageID);
    }

    // Shuffle and pick 12 random images
    const shuffledImages = images.sort(() => 0.5 - Math.random());
    const selectedImages = shuffledImages.slice(0, 12);

    const attachments = [];

    for (let i = 0; i < selectedImages.length; i++) {
      const imageUrl = selectedImages[i];
      const time = new Date();
      const timestamp = time.toISOString().replace(/[:.]/g, "-");
      const imagePath = path.join(__dirname, `/cache/${timestamp}_pinterest_${i}.png`);

      const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, "binary"));

      attachments.push(fs.createReadStream(imagePath));
    }

    api.sendMessage({
      body: 'Here are the images from Pinterest: Prompt: ${query}!',
      attachment: attachments
    }, threadID, () => {
      attachments.forEach((file) => fs.unlinkSync(file.path));
    });

  } catch (error) {
    api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
  }
};
