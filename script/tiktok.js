const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: 'tiktok',
  version: '1.0.0',
  hasPermission: 0,
  usePrefix: false,
  aliases: ['ttdl', 'tiktok'],
  description: "Downloads a TikTok video",
  usages: "tiktok [TikTok URL]",
  credits: 'Developer',
  cooldowns: 3,
  dependencies: {
    "axios": "",
    "fs": "",
    "path": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  const input = args.join(' ');

  if (!input) {
    api.sendMessage(`Please provide a TikTok video URL after 'tiktok'. For example: 'tiktok https://www.tiktok.com/@user/video/123456789'`, event.threadID, event.messageID);
    return;
  }

  try {
    const url = `https://deku-rest-api.gleeze.com/tiktokdl?url=${encodeURIComponent(input)}`;

    const { data } = await axios.get(url);

    if (data && data.result) {
      const videoUrl = data.result;
      const videoPath = path.resolve(__dirname, 'video.mp4');

      // Download the video
      const video = await axios({
        url: videoUrl,
        method: 'GET',
        responseType: 'stream'
      });

      // Save the video to the filesystem
      const writer = fs.createWriteStream(videoPath);
      video.data.pipe(writer);

      writer.on('finish', () => {
        // Send the video
        api.sendMessage({
          body: 'Result:',
          attachment: fs.createReadStream(videoPath)
        }, event.threadID, () => {
          // Clean up the downloaded file
          fs.unlinkSync(videoPath);
        }, event.messageID);
      });

      writer.on('error', (error) => {
        console.error(error);
        api.sendMessage('Failed to download the video.', event.threadID, event.messageID);
      });

    } else {
      api.sendMessage('Failed to retrieve the video link.', event.threadID, event.messageID);
    }

  } catch (error) {
    console.error(error);
    api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};
