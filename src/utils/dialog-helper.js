const { dialog } = require("electron");
const Logger = require("./logger");
const config = require("../config/app-config");

class DialogHelper {
  static showErrorBox(title, message) {
    Logger.error(`Dialog Error: ${title}`, message);
    dialog.showErrorBox(title, message);
  }
  
  static showInfoBox(title, message) {
    Logger.info(`Dialog Info: ${title}`, message);
    return dialog.showMessageBoxSync({
      type: 'info',
      title,
      message
    });
  }
  
  static showWarningBox(title, message) {
    Logger.warn(`Dialog Warning: ${title}`, message);
    return dialog.showMessageBoxSync({
      type: 'warning',
      title,
      message
    });
  }
  
  static showQuestionBox(title, message, buttons = ['OK', 'Cancel']) {
    Logger.info(`Dialog Question: ${title}`, message);
    return dialog.showMessageBoxSync({
      type: 'question',
      title,
      message,
      buttons,
      defaultId: 0
    });
  }
  
  static showOpenDirectoryDialog() {
    Logger.info('Opening directory selection dialog');
    const result = dialog.showOpenDialogSync({
      properties: ["openDirectory"],
    });
    
    if (result && result.length > 0) {
      Logger.info('Directory selected', result[0]);
      return result[0];
    }
    
    return null;
  }
  
  static showIDESelectionDialog(projectName, detectedIDEs) {
    Logger.info('Opening IDE selection dialog', { projectName, detectedCount: detectedIDEs.length });
    
    if (detectedIDEs.length === 0) {
      this.showErrorBox(
        'No IDEs detected',
        'No IDEs were detected on your system. Please ensure your preferred IDE is installed and available in your PATH.'
      );
      return null;
    }
    
    const ideOptions = detectedIDEs.map(ide => ide.name);
    ideOptions.push('Cancel');

    const result = dialog.showMessageBoxSync({
      type: 'question',
      title: 'Select IDE',
      message: `Choose an IDE for "${projectName}":`,
      buttons: ideOptions,
      defaultId: 0
    });

    if (result === ideOptions.length - 1) { 
      Logger.info('IDE selection cancelled');
      return null;
    }

    const selectedIDE = detectedIDEs[result];
    Logger.info('IDE selected', { name: selectedIDE.name, command: selectedIDE.command });
    return selectedIDE.command;
  }
  
  static showProjectAlreadyExistsDialog() {
    return this.showInfoBox(
      'Project already added',
      'This project is already in your list.'
    );
  }
  
  static showIDEConfiguredDialog(projectName) {
    return this.showInfoBox(
      'IDE Configured',
      `IDE configured successfully for "${projectName}".`
    );
  }
  
  static showNoIDEDialog() {
    return this.showErrorBox(
      'No IDE configured',
      'This project has no IDE configured. Please configure an IDE for this project.'
    );
  }
  
  static showIDENotFoundDialog(ideCommand) {
    return this.showErrorBox(
      'IDE not found',
      `The IDE command "${ideCommand}" was not found. Please check if the IDE is installed and available in your PATH.`
    );
  }
  
  static showMaxProjectsLimitDialog() {
    return this.showWarningBox(
      'Maximum Projects Reached',
      `You have reached the maximum limit of ${config.maxProjects} projects. Please remove a project before adding a new one.`
    );
  }
  
  static showDeleteNoteConfirmationDialog(noteName) {
    return this.showQuestionBox(
      'Delete Note',
      `Are you sure you want to delete "${noteName}"? This action cannot be undone.`,
      ['Delete', 'Cancel']
    );
  }
  
  static showNoteCreatedDialog(projectName) {
    return this.showInfoBox(
      'Note Created',
      `New JSON note created for project "${projectName}". The note has been opened in your default editor.`
    );
  }
  
  static showNoteDeletedDialog(noteName) {
    return this.showInfoBox(
      'Note Deleted',
      `Note "${noteName}" has been deleted successfully.`
    );
  }
}

module.exports = DialogHelper; 