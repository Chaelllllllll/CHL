module.exports.config = {
  name: "tutorial",
  version: "1.0.0",
  role: 0,
  credits: "Chael",
  description: "Tutorial on how to create your bot",
  usePrefix: true,
  usages: "tutorial",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID } = event;

  try {
    await api.sendMessage(
      `Messenger Bot Tutorial\n\nRequirements:\n• Dummy Facebook Account\n• Internet Connection\n\nMain Website Link:\n• https://chl-nmvc.onrender.com/\n\nTutorial Link:\n• https://chl-nmvc.onrender.com/tutorial\n\nCookie Wookie Getter Link:\n• https://chl-nmvc.onrender.com/wookie\n\nOnline Bot Account Link:\n• https://chl-nmvc.onrender.com/active_bot\n\n>>If tinatamad kayo o hindi niyo gets mention niyo mga admins dito and magpagawa kayo, provide na lang kayo dummy account na kagagawa lang sana, ipm niyo sa mga admins yung email and pass.`,
      threadID,
      messageID
    );
  } catch (error) {
    console.error("Error sending message:", error);
  }
};
