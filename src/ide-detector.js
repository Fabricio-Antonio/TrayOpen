const { spawnSync } = require("child_process");
const { IDE_COMMANDS, PLATFORM_SPECIFIC_IDES } = require("./constants/ide-commands");
const Logger = require("./utils/logger");

function isIDEInstalled(command) {
  try {
    if (process.platform === 'win32') {
      const result = spawnSync('where', [command], { encoding: 'utf8', shell: true });
      return result.status === 0;
    } else {
      const result = spawnSync('which', [command], { encoding: 'utf8' });
      return result.status === 0;
    }
  } catch (e) {
    return false;
  }
}

function detectIDEs() {
  const ides = [];
  Logger.info('Starting IDE detection');
  
  Object.entries(IDE_COMMANDS).forEach(([name, command]) => {
    const platformSpecific = PLATFORM_SPECIFIC_IDES[process.platform] || [];
    if (platformSpecific.includes(name) && process.platform !== 'win32' && process.platform !== 'darwin') {
      return;
    }
    
    if (isIDEInstalled(command)) {
      ides.push({ name, command });
      Logger.debug(`IDE detected: ${name} (${command})`);
    }
  });
  
  Logger.info(`IDE detection completed. Found ${ides.length} IDEs`);
  return ides;
}

module.exports = { detectIDEs }; 