const { resolve, basename } = require("path");
const { app, Tray, Menu, MenuItem, dialog } = require("electron");
const Store = require("electron-store");
const { spawn, spawnSync } = require("child_process");
const Sentry = require("@sentry/electron/main");

Sentry.init({
  dsn: "https://949124c69b4f1784d74250255500ae46@o4509625221251072.ingest.de.sentry.io/4509625303302224",
});

const schema = {
  projects: {
    type: "array",
    default: [],
  },
};

if (app.dock) {  // Only to macOS
  app.dock.hide(); // Hide icon of Dock
}

const store = new Store({ schema });

let tray = null;

function render(tray) {
  let storedProjects = store.get("projects");
  let projects = Array.isArray(storedProjects)
    ? storedProjects
    : (typeof storedProjects === "string" ? JSON.parse(storedProjects) : []);

  const items = projects.map((project, idx) => ({
    label: project.name,
    submenu: [
      {
        label: 'Open in VS Code',
        click: () => spawnSync('code', [project.path], { stdio: 'inherit' }),
      },
      {
        label: 'Remove',
        click: () => {
          projects.splice(idx, 1);
          store.set('projects', projects);
          render(tray);
        },
      },
    ],
  }));

  const contextMenu = Menu.buildFromTemplate([
    new MenuItem({
      label: "Add new project...",
      click: () => {
        const [path] = dialog.showOpenDialogSync({
          properties: ["openDirectory"],
        }) || [];
        if (!path) return;
        const name = basename(path);
        projects = [
          ...projects,
          { path, name },
        ];
        store.set("projects", projects);
        render(tray);
      },
    }),
    ...items,
    { type: "separator" },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip("TrayOpen — status: on 🔥");
}

app.on("ready", () => {
  const isMac = process.platform === "darwin";
  const iconFile = isMac ? "iconTemplate.png" : "icon.png";
  tray = new Tray(resolve(__dirname, "assets", iconFile));
  render(tray);
});
