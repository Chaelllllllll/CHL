const autopostInterval = 1800000; // 10 seconds
let autopostActive = false;
let intervalID = null;

module.exports.config = {
  name: "autopost",
  version: "1.0.0",
  role: 2,
  credits: "Chael",
  description: "Automatically create a post in your bot account to prevent your account from being locked!",
  usePrefix: true,
  cooldowns: 5
};

module.exports.run = async ({ event, api }) => {
  const { threadID, messageID } = event;

  if (autopostActive) {
    clearInterval(intervalID);
    autopostActive = false;
    return api.sendMessage(`AUTO POSTING STOPPED.`, threadID, messageID);
  }

  autopostActive = true;
  intervalID = setInterval(async () => {
    // Regenerate UUID to ensure uniqueness for each post
    const uuid = getGUID();

    // Generate random text from a fixed array of words
    const randomText = generateRandomText();

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
            "base_state": "EVERYONE",
            "deny": [],
            "tag_expansion_state": "UNSPECIFIED"
          }
        },
        "message": {
          "ranges": [],
          "text": randomText
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

    api.httpPost('https://www.facebook.com/api/graphql/', form, (e, info) => {
      try {
        if (e) throw e;
        if (typeof info === "string") info = JSON.parse(info.replace("for (;;);", ""));
        const postID = info.data.story_create.story.legacy_story_hideable_id;
        //const urlPost = info.data.story_create.story.url;

        if (!postID) throw info.errors;

        return api.sendMessage(`AUTO POST NOTIF: Post created successfully!`, threadID, messageID);

      } catch (e) {
        //return console.log('Post creation failed, please try again later', e.message);
      }
    });
  }, autopostInterval);

  return api.sendMessage(`AUTO POSTING STARTED.`, threadID, messageID);
};

function generateRandomText() {
  const words = [
    "hi guys", "hi kumusta kayo", "hi kumusta ka naman", "hays nakakapagod pero laban lang", "kumusta kayo? sana okay lang kayo", "wag niyo kakalimutang magpahinga ha",
    "okay lang yan, palaging may chance para bumawi", "hello, proud ako sayo!", "okay ka lang ba?", "hello, ngiti ka lang palagi ha", "hello pooo guys", "laban lang palagi haaa, proud ako sayoo",
    "hi, incase na walang nagsabi sayo, proud na proud ako sayo!", "hi, good day everyone!", "hello pagsubok lang yan haa, kayang kaya mong lagpasan yan", "hello, smilee ka langgg", "hello pooo, goodjob dahil nalagpasan mo mga challenges ngayong araw", "hello, normal lang maging mahina minsan ha? normal lang madapa ka ha? ang importante'y babangon ka at lalaban ulit, kaya mo yan!!"
  ];

  // Pick a single random string from the array
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}

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
