const { resolve, basename } = require("path");
const { app, Tray, Menu, MenuItem, dialog } = require("electron");
const Store = require("electron-store");
const { spawn, spawnSync } = require("child_process");

const schema = {
  projects: {
    type: "array",
    default: [],
  },
};

if (app.dock) { // Only to macOS
  app.dock.hide(); // Hide icon of Dock
}

const store = new Store({ schema });

app.on("ready", () => {
  const isMac = process.platform === "darwin";
  const iconFile = isMac ? "iconTemplate.png" : "icon.png";
  const tray = new Tray(resolve(process.cwd(), "assets", iconFile));
  const projects = store.get("projects", []);

  const items = projects.map((project) => {
    return {
      label: project.name,
      click: () => spawnSync("code", [project.path]),
    };
  });

  const contextMenu = Menu.buildFromTemplate([
    ...items,
    {
      type: "separator",
    },
  ]);
  
  contextMenu.insert(0, new MenuItem(
    {
      label: "Add new project...",
      click: () => {
        const [path] = dialog.showOpenDialogSync({
          properties: ["openDirectory"],
        });
        const name = basename(path);
        store.set("projects", [
          ...projects,
          {
            path,
            name,
          },
        ]);
        const item = new MenuItem({ label: name, click: () => spawnSync("code", [path]) });
        contextMenu.append(item)
        tray.setContextMenu(contextMenu);
      },
    }
  ))

  tray.setToolTip("TrayOpen — status: on 🔥");
  tray.setContextMenu(contextMenu);
});
