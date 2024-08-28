module.exports.config = {
  name: 'help',
  version: '1.0.0',
  role: 0,
  hasPrefix: true,
  aliases: ['info'],
  description: "Beginner's guide",
  usage: "help [page] or [command]",
  credits: 'Chael',
};
module.exports.run = async function({
  api,
  event,
  enableCommands,
  args,
  Utils,
  prefix
}) {
  const input = args.join(' ');
  try {
    const eventCommands = enableCommands[1].handleEvent;
    const commands = enableCommands[0].commands;
    if (!input) {
      const pages = 20;
      let page = 1;
      let start = (page - 1) * pages;
      let end = start + pages;
      let helpMessage = `Command List:\n`;
      for (let i = start; i < Math.min(end, commands.length); i++) {
        helpMessage += `\t• ${prefix}${commands[i]}\n`;
      }
      helpMessage += '\nEvent List:\n';
      eventCommands.forEach((eventCommand) => {
        helpMessage += `\t• ${prefix}${eventCommand}\n`;
      });
      helpMessage += `\nPage ${page}/${Math.ceil(commands.length / pages)}. To view the next page, type '${prefix}help page number'. To view information about a specific command, type '${prefix}help command name'.`;
      api.sendMessage(helpMessage, event.threadID, event.messageID);
    } else if (!isNaN(input)) {
      const page = parseInt(input);
      const pages = 20;
      let start = (page - 1) * pages;
      let end = start + pages;
      let helpMessage = `Command List:\n`;
      for (let i = start; i < Math.min(end, commands.length); i++) {
        helpMessage += `\t• ${prefix}${commands[i]}\n`;
      }
      helpMessage += '\nEvent List:\n';
      eventCommands.forEach((eventCommand) => {
        helpMessage += `\t• ${prefix}${eventCommand}\n`;
      });
      helpMessage += `\nPage ${page} of ${Math.ceil(commands.length / pages)}`;
      api.sendMessage(helpMessage, event.threadID, event.messageID);
    } else {
      const command = [...Utils.handleEvent, ...Utils.commands].find(([key]) => key.includes(input?.toLowerCase()))?.[1];
      if (command) {
        const {
          name,
          version,
          role,
          aliases = [],
          description,
          usage,
          credits,
          cooldown,
          hasPrefix
        } = command;
        const roleMessage = role !== undefined ? (role === 0 ? '• 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻: User' : (role === 1 ? '• 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻: Admin' : (role === 2 ? '➛ 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻: Thread Admin' : (role === 3 ? '• 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻: Super Admin' : '')))) : '';
        const aliasesMessage = aliases.length ? `• 𝗔𝗹𝗶𝗮𝘀𝗲𝘀: ${aliases.join(', ')}\n` : '';
        const descriptionMessage = description ? `• 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${description}\n` : '';
        const usageMessage = usage ? `• 𝗨𝘀𝗮𝗴𝗲: ${usage}\n` : '';
        const creditsMessage = credits ? `• 𝗖𝗿𝗲𝗱𝗶𝘁𝘀: ${credits}\n` : '';
        const versionMessage = version ? `• 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${version}\n` : '';
        const cooldownMessage = cooldown ? `• 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻: ${cooldown} second(s)\n` : '';
        const message = ` Command Information\n\n• 𝗡𝗮𝗺𝗲: ${name}\n${versionMessage}${roleMessage}\n${aliasesMessage}${descriptionMessage}${usageMessage}${creditsMessage}${cooldownMessage}`;
        api.sendMessage(message, event.threadID, event.messageID);
      } else {
        api.sendMessage('Command not found.', event.threadID, event.messageID);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports.handleEvent = async function({
  api,
  event,
  prefix
}) {
  const {
    threadID,
    messageID,
    body
  } = event;
  const message = prefix ? 'This is my prefix: ' + prefix : "Sorry i don't have prefix";
  if (body?.toLowerCase().startsWith('prefix')) {
    api.sendMessage(message, threadID, messageID);
  }
}
