module.exports.config = {
  name: "accept",
  version: "1.0.1",
  role: 2,
  credits: "Chael",
  description: "Accept one incoming bot friend request",
  usePrefix: true,
  usages: "accept",
  cooldowns: 5
};

module.exports.run = async ({ event, api }) => {
  const form = {
    av: api.getCurrentUserID(),
    fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
    fb_api_caller_class: "RelayModern",
    doc_id: "4499164963466303",
    variables: JSON.stringify({ input: { scale: 3 } })
  };

  try {
    // Fetch the list of pending friend requests
    const listRequest = JSON.parse(await api.httpPost("https://www.facebook.com/api/graphql/", form))
      .data.viewer.friending_possibilities.edges;

    if (listRequest.length === 0) {
      return api.sendMessage("No pending friend requests.", event.threadID, event.messageID);
    }

    // Get the first pending request
    const user = listRequest[0];

    const acceptForm = {
      av: api.getCurrentUserID(),
      fb_api_req_friendly_name: "FriendingCometFriendRequestConfirmMutation",
      fb_api_caller_class: "RelayModern",
      doc_id: "3147613905362928",
      variables: JSON.stringify({
        input: {
          source: "friends_tab",
          actor_id: api.getCurrentUserID(),
          friend_requester_id: user.node.id,
          client_mutation_id: Math.round(Math.random() * 19).toString()
        },
        scale: 3,
        refresh_num: 0
      })
    };

    // Accept the first friend request
    await api.httpPost("https://www.facebook.com/api/graphql/", acceptForm);

    // Respond with confirmation
    api.sendMessage(`Accepted friend request from: ${user.node.name}`, event.threadID, event.messageID);

  } catch (error) {
    api.sendMessage("An error occurred while processing the request.", event.threadID, event.messageID);
  }
};
