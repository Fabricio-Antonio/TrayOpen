const { resolve, basename } = require("path");
const { app, Tray, Menu, dialog } = require("electron");
const Store = require("electron-store");

const schema = {
  projects: {
    type: "array",
    default: [],
  },
};

if (app.dock) {    // Only to macOS
  app.dock.hide(); // Hide icon of Dock
}

const store = new Store({ schema });

app.on("ready", () => {
  const isMac = process.platform === "darwin";
  const iconFile = isMac ? "iconTemplate.png" : "icon.png";
  const tray = new Tray(resolve(process.cwd(), "assets", iconFile));
  const projects = store.get("projects", []);

  console.log(projects);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Item1",
      type: "radio",
      checked: true,
      click: () => {
        const [path] = dialog.showOpenDialogSync({
          properties: ["openDirectory"],
        });
        store.set("projects", [
          ...projects,
          {
            path,
            name: basename(path),
          },
        ]);
      },
    },
  ]);

  tray.setToolTip("TrayOpen — status: on 🔥");
  tray.setContextMenu(contextMenu);
});
