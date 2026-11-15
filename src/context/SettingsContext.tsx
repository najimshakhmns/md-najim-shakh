import React, { createContext, useContext, useEffect, useState } from 'react';
import { storageService } from '../services/storage';
import { WebsiteSettings } from '../types';

interface SettingsContextType {
  settings: WebsiteSettings;
  updateSettings: (newSettings: WebsiteSettings, adminUser?: { name: string; email: string }) => void;
  reloadSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WebsiteSettings>(() => storageService.getSettings());

  const updateSettings = (newSettings: WebsiteSettings, adminUser?: { name: string; email: string }) => {
    storageService.saveSettings(newSettings, adminUser);
    setSettings(newSettings);
  };

  const reloadSettings = () => {
    setSettings(storageService.getSettings());
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, reloadSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
