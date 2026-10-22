import { ShopSettings } from '../types/index.ts';
import { LocalStorageUtil, StorageKeys } from '../utils/storage.ts';
import { initialSettings } from '../data/initialData.ts';

export class SettingsService {
  static getSettings(): ShopSettings {
    return LocalStorageUtil.get<ShopSettings>(StorageKeys.SETTINGS, initialSettings);
  }

  static saveSettings(settings: ShopSettings): boolean {
    return LocalStorageUtil.set(StorageKeys.SETTINGS, settings);
  }

  static updateSettings(partial: Partial<ShopSettings>): ShopSettings {
    const current = this.getSettings();
    const updated: ShopSettings = { ...current, ...partial };
    this.saveSettings(updated);
    return updated;
  }
}
