import { defineConfig } from 'tauri';

export default defineConfig({
  build: {
    devPath: 'http://localhost:5174',
    distDir: 'frontend/dist',
    beforeDevCommand: '',
    beforeBuildCommand: 'npm run build'
  },
  package: {
    productName: 'relay-operator-gui',
    version: '0.1.0'
  },
  tauri: {
    windows: [
      {
        title: 'Relay Operator GUI',
        width: 800,
        height: 600,
        resizable: true
      }
    ],
    bundle: {
      active: true,
      targets: 'all',
      icon: []
    },
    security: {
      csp: null
    }
  }
});

