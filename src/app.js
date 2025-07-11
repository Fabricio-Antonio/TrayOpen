const { resolve, basename } = require("path");
const { app, Tray, Menu, MenuItem, BrowserWindow, ipcMain } = require("electron");
const { spawnSync } = require("child_process");
const Sentry = require("@sentry/electron/main");
const fs = require("fs");
const path = require("path");

const config = require("./config/app-config");
const ProjectManager = require("./utils/project-manager");
const DialogHelper = require("./utils/dialog-helper");
const JSONNotesManager = require("./utils/json-notes-manager");
const { detectIDEs } = require("./ide-detector");
const Logger = require("./utils/logger");

class TrayOpenApp {
  constructor() {
    this.projectManager = new ProjectManager();
    this.jsonNotesManager = new JSONNotesManager();
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
    
    app.on("before-quit", () => {
      this.cleanup();
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
  
  cleanup() {
    try {
      this.jsonNotesManager.cleanupWatchers();
      Logger.info('TrayOpen cleanup completed');
    } catch (error) {
      Logger.error('Error during cleanup', error);
    }
  }
  
  forceMenuUpdate() {
    try {
      Logger.info('Forcing menu update...');
      
      this.render();
      
      Logger.info('Menu update completed');
    } catch (error) {
      Logger.error('Error forcing menu update', error);
    }
  }
  
  reloadMenu() {
    try {
      Logger.info('Reloading menu completely...');
      
      this.render();
      
      Logger.info('Menu reload completed');
    } catch (error) {
      Logger.error('Error reloading menu', error);
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
  
  createNewJSONNote(projectIndex) {
    try {
      Logger.info('=== CREATE NEW JSON NOTE START ===');
      Logger.info('Creating new JSON note for project', { projectIndex });
      
      const projects = this.projectManager.getProjects();
      Logger.info('Projects loaded', { projectCount: projects.length });
      
      const project = projects[projectIndex];
      
      if (!project) {
        Logger.error('Project not found for JSON note creation', { projectIndex });
        DialogHelper.showErrorBox('Error', 'Project not found. Please try again.');
        return;
      }
      
      Logger.info('Project found', { 
        projectName: project.name, 
        projectPath: project.path,
        ideCommand: project.ideCommand 
      });
      
      Logger.info('Calling jsonNotesManager.createNewNote...');
      const filePath = this.jsonNotesManager.createNewNote(project.name, project.path, project.ideCommand);
      
      Logger.info('JSON note created successfully', { filePath });
      
      Logger.info('Setting up file watcher...');
      this.jsonNotesManager.setupFileWatcher(project.path, project.name);
      
      Logger.info('Updating menu...');
      setTimeout(() => {
        if (fs.existsSync(filePath)) {
          Logger.info('File confirmed to exist, updating menu', { filePath });
          this.render();
        } else {
          Logger.warn('File not found when trying to update menu', { filePath });
        }
      }, 200);
      
      Logger.info('New JSON note process completed', { projectName: project.name, filePath });
      Logger.info('=== CREATE NEW JSON NOTE END ===');
    } catch (error) {
      Logger.error('=== CREATE NEW JSON NOTE ERROR ===');
      Logger.error('Error creating JSON note', { 
        projectIndex, 
        error: error.message,
        stack: error.stack 
      });
      DialogHelper.showErrorBox('Error', `Failed to create JSON note: ${error.message}`);
      Logger.error('=== CREATE NEW JSON NOTE ERROR END ===');
    }
  }
  
  openJSONNote(filePath, projectIndex) {
    try {
      const projects = this.projectManager.getProjects();
      const project = projects[projectIndex];
      
      if (!project) {
        Logger.error('Project not found for opening JSON note', { projectIndex });
        return;
      }
      
      if (fs.existsSync(filePath)) {
        this.jsonNotesManager.openNoteInIDE(filePath, project.ideCommand);
        return;
      }
      
      const fileName = path.basename(filePath);
      const scratchDir = this.jsonNotesManager.getProjectScratchDir(project.name);
      const scratchFilePath = path.join(scratchDir, fileName);
      
      if (fs.existsSync(scratchFilePath)) {
        Logger.info('File found in scratch directory, opening from there', { 
          originalPath: filePath, 
          scratchPath: scratchFilePath 
        });
        this.jsonNotesManager.openNoteInIDE(scratchFilePath, project.ideCommand);
        return;
      }
      
      Logger.error('Note file not found in any location', { 
        originalPath: filePath, 
        scratchPath: scratchFilePath 
      });
      DialogHelper.showErrorBox('Error', 'Note file not found. It may have been moved or deleted.');
    } catch (error) {
      Logger.error('Error opening JSON note', error);
      DialogHelper.showErrorBox('Error', 'Failed to open JSON note. Please try again.');
    }
  }
  
  deleteJSONNote(filePath, noteName) {
    try {
      Logger.info('Attempting to delete JSON note', { filePath, noteName });
      
      const result = DialogHelper.showDeleteNoteConfirmationDialog(noteName);
      if (result === 0) { 
        Logger.info('User confirmed deletion', { filePath, noteName });
        
        if (fs.existsSync(filePath)) {
          const success = this.jsonNotesManager.deleteNote(filePath);
          if (success) {
            Logger.info('JSON note deleted successfully', { filePath, noteName });
            DialogHelper.showNoteDeletedDialog(noteName);
            this.render();
            return;
          } else {
            Logger.error('Failed to delete JSON note', { filePath, noteName });
            DialogHelper.showErrorBox('Error', 'Failed to delete note. File may not exist or be inaccessible.');
            return;
          }
        }
        
        const fileName = path.basename(filePath);
        const projectIndex = this.findProjectIndexByFilePath(filePath);
        
        if (projectIndex !== -1) {
          const project = this.projectManager.getProjects()[projectIndex];
          const scratchDir = this.jsonNotesManager.getProjectScratchDir(project.name);
          const scratchFilePath = path.join(scratchDir, fileName);
          
          if (fs.existsSync(scratchFilePath)) {
            Logger.info('File found in scratch directory, deleting from there', { 
              originalPath: filePath, 
              scratchPath: scratchFilePath 
            });
            
            const success = this.jsonNotesManager.deleteNote(scratchFilePath);
            if (success) {
              Logger.info('JSON note deleted successfully from scratch', { scratchFilePath, noteName });
              DialogHelper.showNoteDeletedDialog(noteName);
              this.render();
              return;
            } else {
              Logger.error('Failed to delete JSON note from scratch', { scratchFilePath, noteName });
              DialogHelper.showErrorBox('Error', 'Failed to delete note. File may not exist or be inaccessible.');
              return;
            }
          }
        }
        
        Logger.warn('File not found for deletion in any location', { filePath, noteName });
        DialogHelper.showErrorBox('Error', 'Note file not found. It may have been already deleted or moved.');
      } else {
        Logger.info('User cancelled deletion', { filePath, noteName });
      }
    } catch (error) {
      Logger.error('Error deleting JSON note', { 
        filePath, 
        noteName, 
        error: error.message,
        stack: error.stack 
      });
      DialogHelper.showErrorBox('Error', `Failed to delete JSON note: ${error.message}`);
    }
  }
  
  findProjectIndexByFilePath(filePath) {
    try {
      const projects = this.projectManager.getProjects();
      const fileName = path.basename(filePath);
      
      const match = fileName.match(/^trayopen-(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2})\.json$/);
      if (!match) {
        Logger.warn('Could not extract project info from filename', { fileName });
        return -1;
      }
      
      for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        if (filePath.startsWith(project.path) || filePath.includes(project.name)) {
          return i;
        }
      }
      
      return -1;
    } catch (error) {
      Logger.error('Error finding project index by file path', error);
      return -1;
    }
  }
  
  render() {
    try {
      const projects = this.projectManager.getProjects();
      const items = projects.map((project, idx) => {
        const scratchNotes = this.jsonNotesManager.listProjectNotes(project.name);
        let projectNotes = [];
        try {
          const projectFiles = fs.readdirSync(project.path)
            .filter(file => file.startsWith('trayopen-') && file.endsWith('.json'))
            .map(file => ({
              name: file,
              path: resolve(project.path, file),
              date: file.replace('trayopen-', '').replace('.json', ''),
              isInProject: true
            }))
            .filter(note => fs.existsSync(note.path));
          projectNotes = projectFiles;
        } catch (error) {
          Logger.warn('Error reading project directory for JSON files', { projectPath: project.path, error: error.message });
        }
        const allNotes = [...projectNotes, ...scratchNotes];
        const sortedNotes = allNotes.sort((a, b) => b.date.localeCompare(a.date));
        const limitedNotes = sortedNotes.slice(0, 5);
        const validNotes = limitedNotes.filter(note => {
          const exists = fs.existsSync(note.path);
          if (!exists) {
            Logger.warn('Note file no longer exists, removing from menu', { notePath: note.path, noteName: note.name });
          }
          return exists;
        });
        const jsonNotesList = validNotes.map(note => ({
          label: note.name + (note.isInProject ? ' (in project)' : ''),
          submenu: [
            {
              label: 'Open',
              click: () => {
                this.openJSONNote(note.path, idx);
              },
            },
            {
              label: 'Delete',
              click: () => {
                this.deleteJSONNote(note.path, note.name);
              },
            },
          ],
          click: () => {
            this.openJSONNote(note.path, idx);
          },
        }));
        jsonNotesList.push({
          label: 'View all notes...',
          click: () => {
            this.showAllJsonNotesWindow(project.name);
          },
        });
        const jsonSubmenu = [
          {
            label: 'New JSON note',
            click: () => {
              Logger.info('New JSON note button clicked', { projectIndex: idx, projectName: project.name });
              this.createNewJSONNote(idx);
            },
          },
          ...(validNotes.length > 0 ? [{ type: 'separator' }] : []),
          ...jsonNotesList,
        ];
        return {
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
            { type: 'separator' },
            {
              label: 'More',
              submenu: [
                {
                  label: 'JSON',
                  submenu: jsonSubmenu,
                },
              ],
            },
          ],
        };
      });

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

  showAllJsonNotesWindow(projectName) {
    const path = require('path');
    const allNotes = this.jsonNotesManager.listProjectNotes(projectName);
    const win = new BrowserWindow({
      width: 600,
      height: 500,
      show: true,
      frame: true,
      resizable: true,
      alwaysOnTop: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });
    win.loadFile(path.join(__dirname, '../assets/all-json-notes.html'));
    ipcMain.once('request-all-json-notes', (event) => {
      event.sender.send('all-json-notes-data', {
        projectName,
        notes: allNotes,
      });
    });
    ipcMain.on('open-json-note', (event, filePath) => {
      const projects = this.projectManager.getProjects();
      const project = projects.find(p => p.name === projectName);
      if (project) {
        this.jsonNotesManager.openNoteInIDE(filePath, project.ideCommand);
      }
    });
    ipcMain.on('delete-json-note', (event, { path: filePath, name }) => {
      this.deleteJSONNote(filePath, name);
      const updatedNotes = this.jsonNotesManager.listProjectNotes(projectName);
      event.sender.send('all-json-notes-data', {
        projectName,
        notes: updatedNotes,
      });
    });
  }
}

module.exports = TrayOpenApp; 