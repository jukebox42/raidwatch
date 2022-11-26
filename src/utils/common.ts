import { v4 } from "uuid";
import { DestinyDisplayPropertiesDefinition } from "bungie-api-ts/destiny2";

import { ASSET_URL, MISSING_ICON_URL } from "./constants";

type ManifestData<T> = { [key: number]: T };

/**
 * Helper function to generate a unique ID. Only use this if you know an ID could be duplicated (like mods).
 */
export const id = () => v4();

/**
 * Generate a URL for an item's icon.
 */
export const itemUrl = (displayProperties: DestinyDisplayPropertiesDefinition) => {
  if (!displayProperties.hasIcon) {
    return assetUrl(MISSING_ICON_URL);
  }
  return assetUrl(displayProperties.icon);
}

/**
 * Generate a URL for any generic asset.
 */
export const assetUrl = (path: string) => {
  if (!path) {
    return ASSET_URL + MISSING_ICON_URL;
  }
  return ASSET_URL + path;
}

/**
 * Filters manifest data by an array of keys.
 */
export function filterManifestData<T>(data: ManifestData<T>, keys: string[]): T[] {
  return Object.keys(data)
    .filter(key => keys.includes(key.toString()))
    .map(key => data[key]);
}