const MailSlurp = require('mailslurp-client').default;

const apiKey = '7685fd8776f7c3b02c93e75edb639cac73d460a979a90c125353f6cc1771f501'; 
const mailslurp = new MailSlurp({ apiKey });

module.exports.config = {
  name: "tempmail",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Chael",
  description: "Generate a temporary email address and fetch all inbox messages",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  if (args.length === 1 && args[0] === "email") {
    try {
      const inbox = await mailslurp.createInbox();
      const emailAddress = inbox.emailAddress;

      api.sendMessage(`Your TempMail: ${emailAddress}`, event.threadID);
    } catch (error) {
      api.sendMessage("Unsuccessful, please try again later", event.threadID);
    }
  } else if (args.length === 2 && args[0] === "inbox") {
    const email = args[1];

    try {
      const inboxes = await mailslurp.getInboxes();
      const inbox = inboxes.find(inbox => inbox.emailAddress === email);

      if (!inbox) {
        api.sendMessage("No inbox found for the provided email address.", event.threadID);
        return;
      }

      const emails = await mailslurp.getEmails(inbox.id);
      if (emails.length === 0) {
        api.sendMessage("No emails found in the inbox.", event.threadID);
        return;
      }

      let message = "Emails in your inbox:\n";
      for (const email of emails) {
        message += `\nMessage: ${email.subject}`;
      }

      api.sendMessage(message, event.senderID);
    } catch (error) {
      api.sendMessage("An error occurred while fetching inbox messages.", event.threadID);
    }
  } else {
    api.sendMessage("Usage:\ntempmail email for a new temp email.\ntempmail inbox [email] to retrieve all inbox messages.", event.threadID);
  }
};
