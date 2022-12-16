import { AppSettings } from "types/settings";
import { StateCreator } from "zustand";
import db, { defaultSettings } from "./db";

export type SettingsStore = {
  settings: AppSettings,
  setSetting: (key: string, value: boolean) => Promise<void>,
  toggleSetting: (key: string) => Promise<void>,
  loadSettings: () => Promise<AppSettings>,
}

export const createSettingsStore: StateCreator<SettingsStore, any, [], SettingsStore> = (set, get) => ({
  settings: { ...defaultSettings },

  setSetting: async (key: string, value: boolean) => {
    console.log("settingsStore:setSetting", key, value);
    const settings = {
      ...get().settings,
      [key]: value,
    }
    set({ settings });
    await db.setSettings(settings);
  },
  toggleSetting: async (key: string) => {
    console.log("settingsStore:toggleSetting", key);
    const oldSettings = get().settings;
    const settings = {
      ...oldSettings,
      [key]: !oldSettings[key],
    }
    set({ settings });
    await db.setSettings(settings);
  },
  loadSettings: async () => {
    await db.init();
    const settings =  await db.getSettings();
    set({ settings });
    return settings;
  },
});
