// Handle Development
export const VERSION = "2023.4.15-beta";

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
export const MISSING_ICON_URL = "/img/misc/missing_icon_d2.png";
// Hardcoded cause I use em often
export const UNSTOPPABLE_ICON_URL = "/common/destiny2_content/icons/DestinyBreakerTypeDefinition_825a438c85404efd6472ff9e97fc7251.png";
export const OVERLOAD_ICON_URL = "/common/destiny2_content/icons/DestinyBreakerTypeDefinition_da558352b624d799cf50de14d7cb9565.png";
export const ANTI_BARRIER_ICON_URL = "/common/destiny2_content/icons/DestinyBreakerTypeDefinition_07b9ba0194e85e46b258b04783e93d5d.png";

// Temps before i do better
export const MAX_PLAYERS = 6;

// URLs
export const SOURCE_URL = "https://github.com/jukebox42/raidwatch";
export const BUNGIE_HELP_URL = "https://help.bungie.net";
export const BUNGIE_HELP_TWITTER_URL = "https://twitter.com/bungiehelp";
