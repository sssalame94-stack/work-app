// Tells the app it is running as the Windows desktop app
const { contextBridge } = require('electron');
contextBridge.exposeInMainWorld('workDesktop', { platform: process.platform });
