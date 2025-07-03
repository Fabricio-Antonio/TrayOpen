const path = require("path");
const { app, Tray, Menu } = require("electron");

if (app.dock) {    // Only to macOS
  app.dock.hide(); // Hide icon of Dock
}

app.whenReady().then(() => {
  const isMac = process.platform === "darwin";
  const iconFile = isMac ? "iconTemplate.png" : "icon.png";
  const iconPath = path.join(__dirname, "assets", iconFile);
  const tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    { label: "Item 1", type: "radio", checked: true },
  ]);

  tray.setToolTip("TrayOpen — status: on 🔥");
  tray.setContextMenu(contextMenu);
});
