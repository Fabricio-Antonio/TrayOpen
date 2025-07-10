const Store = require("electron-store");
const { validateProject, validateProjectList, createProject } = require("../types/project");
const Logger = require("./logger");
const config = require("../config/app-config");

class ProjectManager {
  constructor() {
    this.store = new Store({ schema: config.schema });
    Logger.info('ProjectManager initialized');
  }
  
  getProjects() {
    try {
      let storedProjects = this.store.get("projects");
      let projects = Array.isArray(storedProjects)
        ? storedProjects
        : (typeof storedProjects === "string" ? JSON.parse(storedProjects) : []);
      
      if (!validateProjectList(projects)) {
        Logger.warn('Invalid project list found, resetting to empty array');
        projects = [];
        this.store.set("projects", projects);
      }
      
      return projects;
    } catch (error) {
      Logger.error('Error getting projects', error);
      return [];
    }
  }
  
  addProject(path, name, ideCommand = null) {
    try {
      const project = createProject(path, name, ideCommand);
      
      if (!validateProject(project)) {
        throw new Error('Invalid project data');
      }
      
      const projects = this.getProjects();
      
      if (projects.some(p => p.path === path)) {
        throw new Error('Project already exists');
      }
      
      projects.push(project);
      this.store.set("projects", projects);
      
      Logger.info('Project added successfully', { name, path });
      return project;
    } catch (error) {
      Logger.error('Error adding project', error);
      throw error;
    }
  }
  
  removeProject(index) {
    try {
      const projects = this.getProjects();
      
      if (index < 0 || index >= projects.length) {
        throw new Error('Invalid project index');
      }
      
      const removedProject = projects.splice(index, 1)[0];
      this.store.set("projects", projects);
      
      Logger.info('Project removed successfully', { name: removedProject.name });
      return removedProject;
    } catch (error) {
      Logger.error('Error removing project', error);
      throw error;
    }
  }
  
  updateProject(index, updates) {
    try {
      const projects = this.getProjects();
      
      if (index < 0 || index >= projects.length) {
        throw new Error('Invalid project index');
      }
      
      const updatedProject = { ...projects[index], ...updates };
      
      if (!validateProject(updatedProject)) {
        throw new Error('Invalid project data');
      }
      
      projects[index] = updatedProject;
      this.store.set("projects", projects);
      
      Logger.info('Project updated successfully', { name: updatedProject.name });
      return updatedProject;
    } catch (error) {
      Logger.error('Error updating project', error);
      throw error;
    }
  }
  
  projectExists(path) {
    const projects = this.getProjects();
    return projects.some(p => p.path === path);
  }
  
  getProjectByPath(path) {
    const projects = this.getProjects();
    return projects.find(p => p.path === path);
  }
}

module.exports = ProjectManager; 