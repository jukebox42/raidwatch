// Handle Development
export const VERSION = "2.0.0b.2023.4.1";

export const DEV_MODE = process.env.NODE_ENV === "development";
if (DEV_MODE) {
  console.log("---------------------");
  console.log("DEV MODE", DEV_MODE);
  console.log("---------------------");
}

export const IS_BETA = process.env.REACT_APP_MODE === "beta";
if (IS_BETA) {
  console.log("---------------------");
  console.log("BETA", IS_BETA);
  console.log("---------------------");
}

// Get API Key from .env
const key = DEV_MODE ? process.env.REACT_APP_DEV_API_KEY : IS_BETA ? process.env.REACT_APP_API_BETA_KEY : process.env.REACT_APP_API_KEY;
if (!key) {
  throw new Error("Missing .env file for API key. See .envExample");
}
export const API_KEY = key ?? "";

// Lang
export const LANGUAGE = "en";

// Bungie
export const ASSET_URL = "https://www.bungie.net";
export const API_URL = `${ASSET_URL}/platform`;
export const MISSING_ICON_URL = "img/misc/missing_icon_d2.png";

// Temps before i do better
export const MAX_PLAYERS = 6;

// URLs
export const SOURCE_URL = "https://github.com/jukebox42/raidwatch";
export const BUNGIE_HELP_URL = "https://help.bungie.net";
export const BUNGIE_HELP_TWITTER_URL = "https://twitter.com/bungiehelp";
