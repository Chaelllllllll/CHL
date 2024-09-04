module.exports.config = {
  name: "add",
  version: "1.0.1",
  role: 2,
  description: "Add user to group by id",
  usePrefix: true,
  usages: "[args]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const botID = api.getCurrentUserID();
  const out = msg => api.sendMessage(msg, threadID, messageID);
  var { participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(threadID);
  var participantIDs = participantIDs.map(e => parseInt(e));

  // Function to extract id from the URL
  function extractIDFromURL(url) {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Check if the URL is a profile URL
    if (pathname.startsWith('/profile.php')) {
      const urlParams = new URLSearchParams(urlObj.search);
      return urlParams.get('id');
    }

    // Check if the URL is a post URL
    const segments = pathname.split('/');
    if (segments.length > 1) {
      return segments[1];
    }

    return null;
  }

  if (!args[0]) return out("Please enter an id/link profile user to add.");

  // Check if the argument is a URL and extract the id if it is
  let userID = args[0];
  if (userID.startsWith("https://www.facebook.com/")) {
    userID = extractIDFromURL(userID);
  }

  if (!isNaN(userID)) {
    return adduser(userID, undefined);
  } else {
    try {
      var [id, name, fail] = await getUID(userID, api);
      if (fail == true && id != null) return out(id);
      else if (fail == true && id == null) return out("User ID not found.")
      else {
        await adduser(id, name || "Facebook users");
      }
    } catch (e) {
      return out(`${e.name}: ${e.message}.`);
    }
  }

  async function adduser(id, name) {
    id = parseInt(id);
    if (participantIDs.includes(id)) return out(`${name ? name : "Member"} is already in the group.`);
    else {
      var admins = adminIDs.map(e => parseInt(e.id));
      try {
        await api.addUserToGroup(id, threadID);
      }
      catch {
        return out(`Can't add ${name ? name : "user"} in group.`);
      }
      if (approvalMode === true && !admins.includes(botID)) return out(`Added ${name ? name : "member"} to the approved list !`);
      else return out(`Added ${name ? name : "member"} to the group!`)
    }
  }
}
