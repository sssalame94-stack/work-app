// Work: Windows desktop app
const { app, BrowserWindow, protocol, net, shell, Menu } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');
const { autoUpdater } = require('electron-updater');

// The app is served from a private secure address so that login, fingerprint
// (Windows Hello) and saved sessions work like in a real browser.
const HOST = 'work-app.local';
const WWW = path.join(__dirname, '..', 'www');

if (!app.requestSingleInstanceLock()) app.quit();

function createWindow() {
  const win = new BrowserWindow({
    width: 1360, height: 900, minWidth: 380, minHeight: 600,
    title: 'Work', backgroundColor: '#f3f6f6', autoHideMenuBar: true,
    icon: path.join(__dirname, '..', 'assets', 'icon-win.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false }
  });
  Menu.setApplicationMenu(null);
  // Links to Google, WhatsApp, email, GitHub open in the normal browser / mail app
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(`https://${HOST}`)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith(`https://${HOST}`)) { e.preventDefault(); shell.openExternal(url); }
  });
  win.loadURL(`https://${HOST}/index.html`);
  return win;
}

app.whenReady().then(() => {
  protocol.handle('https', (req) => {
    const u = new URL(req.url);
    if (u.hostname === HOST) {
      let p = decodeURIComponent(u.pathname);
      if (!p || p === '/') p = '/index.html';
      const file = path.normalize(path.join(WWW, p));
      if (!file.startsWith(WWW)) return new Response('Not found', { status: 404 });
      return net.fetch(pathToFileURL(file).toString());
    }
    return net.fetch(req, { bypassCustomProtocolHandlers: true });
  });
  createWindow();
  // Automatic updates from GitHub Releases (your data stays in Supabase)
  autoUpdater.autoDownload = true;
  autoUpdater.checkForUpdatesAndNotify().catch(() => {});
});

app.on('second-instance', () => {
  const [w] = BrowserWindow.getAllWindows();
  if (w) { if (w.isMinimized()) w.restore(); w.focus(); }
});
app.on('window-all-closed', () => app.quit());
