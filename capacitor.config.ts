import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.echo',
  appName: 'Smart Campus Assistant',
  webDir: 'dist',
  server: {
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
