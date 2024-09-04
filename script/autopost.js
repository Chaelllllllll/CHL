const axios = require("axios");

module.exports.config = {
  name: "autopost",
  version: "1.0.0",
  role: 2,
  credits: "Chael",
  description: "Automatically post in bot account to prevent your account from being locked.",
  usePrefix: true,
  usages: "autopost",
  cooldowns: 5
};

let intervalId = null;

module.exports.run = async ({ event, api}) => {
  const { threadID, messageID, body } = event;

  async function fetchPostText() {
    try {
      const response = await axios.get("https://deku-rest-api.gleeze.com/dogfact");
      return response.data.fact;
    } catch (error) {
      console.error("Error fetching post text:", error);
      return "Error fetching post text.";
    }
  }

  async function createPost() {
    const postText = await fetchPostText();
    const uuid = getGUID();
    const formData = {
      "input": {
        "composer_entry_point": "inline_composer",
        "composer_source_surface": "timeline",
        "idempotence_token": uuid + "_FEED",
        "source": "WWW",
        "attachments": [],
        "audience": {
          "privacy": {
            "allow": [],
            "base_state": "EVERYONE", // Set audience to "Everyone"
            "deny": [],
            "tag_expansion_state": "UNSPECIFIED"
          }
        },
        "message": {
          "ranges": [],
          "text": "Hi" // Set post content from API
        },
        "with_tags_ids": [],
        "inline_activities": [],
        "explicit_place_id": "0",
        "text_format_preset_id": "0",
        "logging": {
          "composer_session_id": uuid
        },
        "tracking": [
          null
        ],
        "actor_id": api.getCurrentUserID(),
        "client_mutation_id": Math.floor(Math.random() * 17)
      },
      "displayCommentsFeedbackContext": null,
      "displayCommentsContextEnableComment": null,
      "displayCommentsContextIsAdPreview": null,
      "displayCommentsContextIsAggregatedShare": null,
      "displayCommentsContextIsStorySet": null,
      "feedLocation": "TIMELINE",
      "feedbackSource": 0,
      "focusCommentID": null,
      "gridMediaWidth": 230,
      "groupID": null,
      "scale": 3,
      "privacySelectorRenderLocation": "COMET_STREAM",
      "renderLocation": "timeline",
      "useDefaultActor": false,
      "inviteShortLinkKey": null,
      "isFeed": false,
      "isFundraiser": false,
      "isFunFactPost": false,
      "isGroup": false,
      "isTimeline": true,
      "isSocialLearning": false,
      "isPageNewsFeed": false,
      "isProfileReviews": false,
      "isWorkSharedDraft": false,
      "UFI2CommentsProvider_commentsKey": "ProfileCometTimelineRoute",
      "hashtag": null,
      "canUserManageOffers": false
    };

    const form = {
      av: api.getCurrentUserID(),
      fb_api_req_friendly_name: "ComposerStoryCreateMutation",
      fb_api_caller_class: "RelayModern",
      doc_id: "7711610262190099",
      variables: JSON.stringify(formData)
    };

    try {
      let info = await api.httpPost('https://www.facebook.com/api/graphql/', form);
      if (typeof info === "string") info = JSON.parse(info.replace("for (;;);", ""));
      const postID = info.data.story_create.story.legacy_story_hideable_id;
      const urlPost = info.data.story_create.story.url;
      if (!postID) throw info.errors;
      return `AUTO POST NOTIF: Post created successfully!`;
    } catch (e) {
      console.error("Error creating post:", e);
      return "Post creation failed, please try again later";
    }
  }

  // Handle "autopost" command
  if (body.toLowerCase() === "autopost") {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      return api.sendMessage("Automatic posting stopped. (autopost | off)", threadID, messageID);
    } else {
      intervalId = setInterval(async () => {
        const resultMessage = await createPost();
        api.sendMessage(resultMessage, threadID, messageID);
      }, 600000); // 10000 milliseconds = 10 seconds
      return api.sendMessage("Automatic posting started every 10 minutes. (autopost | on)", threadID, messageID);
    }
  }
};

module.exports.stop = ({ event, api }) => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    return api.sendMessage("Automatic posting stopped.", event.threadID, event.messageID);
  } else {
    return api.sendMessage("Automatic posting is not running.", event.threadID, event.messageID);
  }
};

function getGUID() {
  var sectionLength = Date.now();
  var id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.floor((sectionLength + Math.random() * 16) % 16);
    sectionLength = Math.floor(sectionLength / 16);
    var _guid = (c === "x" ? r : (r & 7) | 8).toString(16);
    return _guid;
  });
  return id;
}
