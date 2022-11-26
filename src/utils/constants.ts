// Handle Development
export const VERSION = "0.1.0";

export const DEV_MODE = process.env.NODE_ENV === "development";
if (DEV_MODE) {
  console.log("---------------------");
  console.log("DEV MODE", DEV_MODE);
  console.log("---------------------");
}

// Get API Key from .env
const key = DEV_MODE ? process.env.REACT_APP_DEV_API_KEY : process.env.REACT_APP_API_KEY;
if (!key) {
  throw new Error("Missing .env file for API key. See .envExample")
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
