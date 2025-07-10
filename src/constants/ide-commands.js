const IDE_COMMANDS = {
  'Visual Studio Code': 'code',
  'IntelliJ IDEA': 'idea',
  'Visual Studio': 'devenv',
  'Eclipse': 'eclipse',
  'NetBeans': 'netbeans',
  'Sublime Text': 'subl',
  'Atom': 'atom',
  'WebStorm': 'webstorm',
  'Brackets': 'brackets',
  'CodeSandbox': 'codesandbox',
  'Android Studio': process.platform === 'win32' ? 'studio64' : 'studio',
  'Xcode': 'xcode-select --print-path',
  'FlutterFlow': 'flutterflow',
  'PyCharm': 'pycharm',
  'JupyterLab': 'jupyter lab',
  'Neovim': 'nvim'
};

const PLATFORM_SPECIFIC_IDES = {
  'win32': ['Visual Studio', 'Android Studio'],
  'darwin': ['Xcode'],
  'linux': []
};

module.exports = { 
  IDE_COMMANDS,
  PLATFORM_SPECIFIC_IDES
}; 