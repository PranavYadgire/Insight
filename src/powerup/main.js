/* global TrelloPowerUp */
import { isAuthorized } from "../lib/auth.js";

const ICON_URL =
  typeof window !== "undefined" && window.location.origin
    ? `${window.location.origin}/icons/icon.svg`
    : "./icons/icon.svg";

TrelloPowerUp.initialize({
  // Trello queries this capability to decide whether to prompt the member to authorize
  "authorization-status": async function (t) {
    const authorized = await isAuthorized(t);
    return { authorized };
  },

  // Called when Trello prompts authorization
  "show-authorization": function (t) {
    return t.popup({
      title: "Authorize Insight",
      url: "./auth.html",
      height: 320,
    });
  },

  // Called when member opens Power-Up settings from the board menu
  "show-settings": function (t) {
    return t.popup({
      title: "Insight Settings",
      url: "./auth.html",
      height: 320,
    });
  },

  // Adds an Insight button in the top board header
 "board-buttons": function () {
  return [
    {
      icon: {
        dark: ICON_URL,
        light: ICON_URL,
      },
      text: "Insight",

      callback: async function (t) {
        const authorized = await isAuthorized(t);

        if (!authorized) {
          return t.popup({
            title: "Authorize Insight",
            url: "./auth.html",
            height: 320,

            callback: function (t) {
              return t.modal({
                title: "Insight",
                url: "./dashboard.html",
                
              });
            },
          });
        }

        return t.modal({
          title: "Insight",
          url: "./dashboard.html",
          
        });
      },
    },
  ];
},
});
