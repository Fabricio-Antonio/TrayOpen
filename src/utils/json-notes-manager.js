const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const Logger = require('./logger');

class JSONNotesManager {
  constructor() {
    this.scratchBaseDir = path.join(process.env.HOME || process.env.USERPROFILE, 'scratch');
    this.ensureScratchDirectory();
    this.fileWatchers = new Map();
    this.processedFiles = new Set(); 
    this.processingFiles = new Set();
    this.debounceTimers = new Map();
    
    setInterval(() => {
      this.cleanupProcessedFiles();
    }, 5 * 60 * 1000);
  }

  ensureScratchDirectory() {
    if (!fs.existsSync(this.scratchBaseDir)) {
      fs.mkdirSync(this.scratchBaseDir, { recursive: true });
      Logger.info('Scratch directory created', { path: this.scratchBaseDir });
    }
  }

  getProjectScratchDir(projectName) {
    const projectDir = path.join(this.scratchBaseDir, `${projectName}-scratch`);
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }
    return projectDir;
  }

  createNewNote(projectName, projectPath, ideCommand = null) {
    try {
      Logger.info('Creating new JSON note', { projectName, projectPath, ideCommand });
      
      if (!fs.existsSync(projectPath)) {
        throw new Error(`Project directory does not exist: ${projectPath}`);
      }
      
      const now = new Date();
      const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const time = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
      const fileName = `trayopen-${date}-${time}.json`;
      
      const scratchDir = this.getProjectScratchDir(projectName);
      const scratchFilePath = path.join(scratchDir, fileName);
      
      Logger.info('Creating file in scratch', { fileName, scratchFilePath });
      
      fs.writeFileSync(scratchFilePath, '');
      
      if (!fs.existsSync(scratchFilePath)) {
        throw new Error(`Failed to create file: ${scratchFilePath}`);
      }
      
      Logger.info('New empty JSON note created successfully in scratch', { 
        projectName, 
        scratchFilePath,
        fileSize: fs.statSync(scratchFilePath).size 
      });

      if (ideCommand) {
        Logger.info('Opening note in IDE', { ideCommand, scratchFilePath });
        this.openNoteInIDE(scratchFilePath, ideCommand);
      } else {
        Logger.warn('No IDE command configured for project', { projectName });
      }

      return scratchFilePath;
    } catch (error) {
      Logger.error('Error creating new note', { 
        projectName, 
        projectPath, 
        error: error.message,
        stack: error.stack 
      });
      throw error;
    }
  }

  listProjectNotes(projectName) {
    try {
      const projectDir = this.getProjectScratchDir(projectName);
      const files = fs.readdirSync(projectDir)
        .filter(file => file.startsWith('trayopen-') && file.endsWith('.json'))
        .sort((a, b) => {
          // Ordenar por data e hora (mais recente primeiro)
          const dateTimeA = a.replace('trayopen-', '').replace('.json', '');
          const dateTimeB = b.replace('trayopen-', '').replace('.json', '');
          return new Date(dateTimeB.replace(/-/g, ':')) - new Date(dateTimeA.replace(/-/g, ':'));
        });

      return files.map(file => ({
        name: file,
        path: path.join(projectDir, file),
        date: file.replace('trayopen-', '').replace('.json', '')
      }));
    } catch (error) {
      Logger.error('Error listing project notes', error);
      return [];
    }
  }

  moveNoteToScratch(projectFilePath, projectName) {
    try {
      if (this.processedFiles.has(projectFilePath) || this.processingFiles.has(projectFilePath)) {
        Logger.info('File already processed or being processed, skipping', { projectFilePath });
        return false;
      }

      if (!fs.existsSync(projectFilePath)) {
        Logger.warn('Project file not found for moving to scratch', { projectFilePath });
        return false;
      }

      const fileStats = fs.statSync(projectFilePath);
      if (fileStats.size === 0) {
        Logger.info('File is empty, not moving to scratch', { projectFilePath });
        return false;
      }

      this.processingFiles.add(projectFilePath);

      const fileName = path.basename(projectFilePath);
      const scratchDir = this.getProjectScratchDir(projectName);
      const scratchFilePath = path.join(scratchDir, fileName);

      if (!fs.existsSync(projectFilePath)) {
        Logger.warn('File no longer exists before moving', { projectFilePath });
        this.processingFiles.delete(projectFilePath);
        return false;
      }

      if (fs.existsSync(scratchFilePath)) {
        Logger.warn('Scratch file already exists, not moving', { 
          projectFilePath, 
          scratchFilePath 
        });
        this.processingFiles.delete(projectFilePath);
        return false;
      }

      fs.renameSync(projectFilePath, scratchFilePath);
      
      if (!fs.existsSync(scratchFilePath)) {
        Logger.error('File was not moved successfully', { 
          projectFilePath, 
          scratchFilePath 
        });
        this.processingFiles.delete(projectFilePath);
        return false;
      }
      
      this.processedFiles.add(projectFilePath);
      this.processingFiles.delete(projectFilePath);
      
      Logger.info('Note moved to scratch directory', { 
        from: projectFilePath, 
        to: scratchFilePath,
        size: fs.statSync(scratchFilePath).size
      });
      
      return scratchFilePath;
    } catch (error) {
      Logger.error('Error moving note to scratch', error);
      this.processingFiles.delete(projectFilePath);
      return false;
    }
  }

  openNoteInEditor(filePath) {
    try {
      let editor;
      switch (process.platform) {
        case 'win32':
          editor = 'notepad';
          break;
        case 'darwin':
          editor = 'open';
          break;
        default:
          editor = 'xdg-open';
          break;
      }

      spawnSync(editor, [filePath], {
        stdio: 'inherit',
        shell: true,
        detached: true
      });

      Logger.info('Note opened in editor', { filePath, editor });
    } catch (error) {
      Logger.error('Error opening note in editor', error);
      throw error;
    }
  }

  openNoteInIDE(filePath, ideCommand) {
    try {
      spawnSync(ideCommand, [filePath], {
        stdio: 'inherit',
        shell: true,
        detached: true
      });

      Logger.info('Note opened in IDE', { filePath, ideCommand });
    } catch (error) {
      Logger.error('Error opening note in IDE', error);
      throw error;
    }
  }

  deleteNote(filePath) {
    try {
      Logger.info('Attempting to delete note', { filePath });
      
      if (!fs.existsSync(filePath)) {
        Logger.warn('File does not exist for deletion', { filePath });
        return false;
      }

      const stats = fs.statSync(filePath);
      if (!stats.isFile()) {
        Logger.warn('Path is not a file', { filePath, isDirectory: stats.isDirectory() });
        return false;
      }

      fs.unlinkSync(filePath);
      
      if (fs.existsSync(filePath)) {
        Logger.error('File still exists after deletion attempt', { filePath });
        return false;
      }
      
      this.processedFiles.delete(filePath);
      this.processingFiles.delete(filePath);
      
      Logger.info('Note deleted successfully', { filePath });
      return true;
    } catch (error) {
      Logger.error('Error deleting note', { 
        filePath, 
        error: error.message,
        stack: error.stack 
      });
      return false;
    }
  }

  openNote(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        this.openNoteInEditor(filePath);
        return true;
      }
      return false;
    } catch (error) {
      Logger.error('Error opening note', error);
      throw error;
    }
  }

  setupFileWatcher(projectPath, projectName) {
    try {
      if (this.fileWatchers.has(projectPath)) {
        Logger.info('File watcher already exists for project', { projectPath, projectName });
        return this.fileWatchers.get(projectPath);
      }

      Logger.info('Setting up file watcher', { projectPath, projectName });

      const watcher = fs.watch(projectPath, (eventType, filename) => {
        if (filename && filename.startsWith('trayopen-') && filename.endsWith('.json')) {
          const filePath = path.join(projectPath, filename);
          
          Logger.info('File watcher detected change', { eventType, filename, filePath });
          
          if (eventType === 'change') {
            if (this.debounceTimers.has(filePath)) {
              clearTimeout(this.debounceTimers.get(filePath));
            }
            this.debounceTimers.set(filePath, setTimeout(() => {
              this.debounceTimers.delete(filePath);
              fs.stat(filePath, (err, stats) => {
                if (!err && stats && stats.isFile()) {
                  if (this.processedFiles.has(filePath) || this.processingFiles.has(filePath)) {
                    Logger.info('File already processed or being processed, skipping', { filePath });
                    return;
                  }
                  Logger.info('File stable for 2s, moving to scratch', { filePath });
                  if (fs.existsSync(filePath)) {
                    const fileStats = fs.statSync(filePath);
                    if (fileStats.size > 0) {
                      this.moveNoteToScratch(filePath, projectName);
                    } else {
                      Logger.info('File is empty, not moving to scratch yet', { filePath });
                    }
                  } else {
                    Logger.warn('File no longer exists when trying to move', { filePath });
                  }
                } else {
                  Logger.warn('File not found or error accessing file', { filePath, error: err?.message });
                }
              });
            }, 2000));
          } else {
            Logger.info('Ignoring non-change event', { eventType, filename });
          }
        }
      });

      this.fileWatchers.set(projectPath, watcher);
      
      Logger.info('File watcher set up successfully', { projectPath, projectName });
      return watcher;
    } catch (error) {
      Logger.error('Error setting up file watcher', { 
        projectPath, 
        projectName, 
        error: error.message 
      });
    }
  }

  cleanupProcessedFiles() {
    try {
      const beforeCount = this.processedFiles.size;
      this.processedFiles.clear();
      Logger.info('Cleaned up processed files', { 
        beforeCount, 
        afterCount: 0 
      });
    } catch (error) {
      Logger.error('Error cleaning up processed files', error);
    }
  }

  cleanupWatchers() {
    this.fileWatchers.forEach((watcher, projectPath) => {
      try {
        watcher.close();
        Logger.info('File watcher closed', { projectPath });
      } catch (error) {
        Logger.error('Error closing file watcher', error);
      }
    });
    this.fileWatchers.clear();
    this.processedFiles.clear();
    this.processingFiles.clear();
    this.debounceTimers.forEach(timer => clearTimeout(timer));
    this.debounceTimers.clear();
  }
}

module.exports = JSONNotesManager; 