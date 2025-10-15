import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.8dc9faae7bc94d46920baa8d3589b41a',
  appName: 'Smart Campus Assistant',
  webDir: 'dist',
  server: {
    url: 'https://8dc9faae-7bc9-4d46-920b-aa8d3589b41a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
