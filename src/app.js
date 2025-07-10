const { resolve, basename } = require("path");
const { app, Tray, Menu, MenuItem } = require("electron");
const { spawnSync } = require("child_process");
const Sentry = require("@sentry/electron/main");

const config = require("./config/app-config");
const ProjectManager = require("./utils/project-manager");
const DialogHelper = require("./utils/dialog-helper");
const { detectIDEs } = require("./ide-detector");
const Logger = require("./utils/logger");

class TrayOpenApp {
  constructor() {
    this.projectManager = new ProjectManager();
    this.tray = null;
    this.initializeSentry();
    this.setupAppEvents();
  }
  
  initializeSentry() {
    Sentry.init({
      dsn: config.sentry.dsn,
    });
    Logger.info('Sentry initialized');
  }
  
  setupAppEvents() {
    app.on("ready", () => {
      this.initializeApp();
    });
    
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
      DialogHelper.showErrorBox('TrayOpen is already running', 'TrayOpen is already running.');
      app.quit();
    } else {
      app.on('second-instance', () => {
        DialogHelper.showErrorBox('TrayOpen is already running', 'TrayOpen is already running.');
      });
    }
  }
  
  initializeApp() {
    try {
      if (process.platform === 'win32' || process.platform === 'darwin') {
        app.setLoginItemSettings({ openAtLogin: true });
      }
      
      if (app.dock) {
        app.dock.hide();
      }
      
      this.createTray();
      this.render();
      
      Logger.info('TrayOpen app initialized successfully');
    } catch (error) {
      Logger.error('Error initializing app', error);
    }
  }
  
  createTray() {
    const isMac = process.platform === "darwin";
    const iconFile = isMac ? "iconTemplate.png" : "icon.png";
    this.tray = new Tray(resolve(__dirname, "..", "assets", iconFile));
    this.tray.setToolTip("TrayOpen — status: on 🔥");
  }
  
  openInIDE(projectPath, ideCommand) {
    if (!ideCommand) {
      DialogHelper.showNoIDEDialog();
      return;
    }

    try {
      spawnSync(ideCommand, [projectPath], {
        stdio: 'inherit',
        shell: true,
      });
      Logger.info('IDE opened successfully', { projectPath, ideCommand });
    } catch (error) {
      Logger.error('Error opening IDE', error);
      DialogHelper.showIDENotFoundDialog(ideCommand);
    }
  }
  
  addNewProject() {
    try {
      const projects = this.projectManager.getProjects();
      if (projects.length >= config.maxProjects) {
        DialogHelper.showMaxProjectsLimitDialog();
        return;
      }
      
      const path = DialogHelper.showOpenDirectoryDialog();
      if (!path) return;
      
      const name = basename(path);
      
      if (this.projectManager.projectExists(path)) {
        DialogHelper.showProjectAlreadyExistsDialog();
        return;
      }
      
      const detectedIDEs = detectIDEs();
      const selectedIDE = DialogHelper.showIDESelectionDialog(name, detectedIDEs);
      
      if (selectedIDE !== null) {
        this.projectManager.addProject(path, name, selectedIDE);
        this.render();
        Logger.info('New project added', { name, path, ideCommand: selectedIDE });
      }
    } catch (error) {
      Logger.error('Error adding new project', error);
      DialogHelper.showErrorBox('Error', 'Failed to add project. Please try again.');
    }
  }
  
  configureIDE(projectIndex) {
    try {
      const projects = this.projectManager.getProjects();
      const project = projects[projectIndex];
      
      if (!project) {
        Logger.error('Project not found for IDE configuration', { projectIndex });
        return;
      }
      
      const detectedIDEs = detectIDEs();
      const selectedIDE = DialogHelper.showIDESelectionDialog(project.name, detectedIDEs);
      
      if (selectedIDE) {
        this.projectManager.updateProject(projectIndex, { ideCommand: selectedIDE });
        this.render();
        DialogHelper.showIDEConfiguredDialog(project.name);
        Logger.info('IDE configured for project', { projectName: project.name, ideCommand: selectedIDE });
      }
    } catch (error) {
      Logger.error('Error configuring IDE', error);
      DialogHelper.showErrorBox('Error', 'Failed to configure IDE. Please try again.');
    }
  }
  
  removeProject(projectIndex) {
    try {
      const removedProject = this.projectManager.removeProject(projectIndex);
      this.render();
      Logger.info('Project removed', { name: removedProject.name });
    } catch (error) {
      Logger.error('Error removing project', error);
      DialogHelper.showErrorBox('Error', 'Failed to remove project. Please try again.');
    }
  }
  
  render() {
    try {
      const projects = this.projectManager.getProjects();
      
      const items = projects.map((project, idx) => ({
        label: project.name,
        submenu: [
          {
            label: 'Open in IDE',
            click: () => {
              this.openInIDE(project.path, project.ideCommand);
            },
          },
          {
            label: 'Configure IDE',
            click: () => {
              this.configureIDE(idx);
            },
          },
          {
            label: 'Remove',
            click: () => {
              this.removeProject(idx);
            },
          },
        ],
      }));

      const contextMenu = Menu.buildFromTemplate([
        new MenuItem({
          label: "Add new project...",
          click: () => {
            this.addNewProject();
          },
        }),
        ...items,
        { type: "separator" },
        { type: "separator" },
        {
          label: "Quit TrayOpen",
          click: () => app.quit(),
        },
      ]);

      this.tray.setContextMenu(contextMenu);
      Logger.debug('Tray menu rendered', { projectCount: projects.length });
    } catch (error) {
      Logger.error('Error rendering tray menu', error);
    }
  }
}

module.exports = TrayOpenApp; 