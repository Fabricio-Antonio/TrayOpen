function validateProject(project) {
  return project && 
         typeof project.path === 'string' && 
         typeof project.name === 'string' &&
         project.path.length > 0 &&
         project.name.length > 0;
}

function validateProjectList(projects) {
  return Array.isArray(projects) && 
         projects.every(validateProject);
}

function createProject(path, name, ideCommand = null) {
  return {
    path,
    name,
    ideCommand,
    createdAt: new Date().toISOString()
  };
}

module.exports = { 
  validateProject,
  validateProjectList,
  createProject
}; 