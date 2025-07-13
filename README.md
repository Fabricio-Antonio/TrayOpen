
<div align="center">

# TrayOpen

<img src="https://github.com/user-attachments/assets/fae2d448-fbb3-4fb5-adab-640a53f9ddb9" width="120" />
</div>
<br/>

<p align="center">
  <img src="https://img.shields.io/badge/projecti--in--progess-yellow" />
  <img src="https://img.shields.io/badge/made%20with-Electron--JS-darkblue" />
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  <br/>
  <strong>English version</strong> | <a href="README.pt.md">Portuguese version</a>
</p>




## 📝 Description
TrayOpen is a minimalist desktop app built with ElectronJS, originally created as a playground to explore desktop development and experiment with observability tools like Sentry.
What began as a simple study project quickly evolved into a powerful productivity booster for developers — a lightweight yet effective tool designed to streamline daily workflows and reduce context-switching.

## 🎯 Project Objective

TrayOpen is a minimalist desktop application built with ElectronJS that runs in the system tray and provides instant access to your recent projects. With a single click, you can open any project directly in your IDE. It's designed for developers who value speed, simplicity, and productivity in their daily workflow.

## 🚀 How could TrayOpen improve my productivity as a dev?

- **Instant project access:** Open any project in your preferred IDE with just two clicks, eliminating the need to browse folders or type commands.
- **Centralized project management:** Keep all your active and favorite projects organized and accessible from the system tray.
- **Multi-IDE support:** Easily switch between different IDEs (VS Code, IntelliJ, PyCharm, etc.) per project, adapting to polyglot and multi-stack workflows.
- **Cross-platform convenience:** Works seamlessly on Windows, macOS, and Linux, so your workflow stays consistent across environments.
- **No more clutter:** Keeps your desktop and taskbar clean by running in the system tray, always ready but never in the way.
- **Quick context switching:** Instantly jump between projects without losing focus or wasting time searching for directories.
- **Single instance enforcement:** Prevents accidental duplicate launches, reducing confusion and resource waste.
- **Persistent project list:** Your projects are always remembered, even after rebooting or updating the app.
- **JSON Notes system:** Instantly create and open structured notes per project, auto-organized and moved to scratch folders when filled, with real-time file watching, IDE integration, and centralized viewing — perfect for jotting down bugs, ideas, configs, and API mockups without interrupting your flow.

## 📦 Installation

### Download
Download the latest release for your platform:
- **Windows**: `.exe` installer
- **macOS**: `.dmg` or `.pkg`
- **Linux**: `.AppImage`, `.deb`, `.rpm`, `.snap`, `.flatpak`, or `.pacman`


## 🧰 Usage

1. **Add a Project**
   - Right-click the tray icon
   - Select "Add new project..."
   - Choose your project folder
   - Select your preferred IDE

2. **Open a Project**
   - Right-click the tray icon
   - Select your project
   - Click "Open in IDE"

3. **Configure IDE**
   - Right-click the tray icon
   - Select your project
   - Click "Configure IDE"
   - Choose a different IDE

4. **Remove a Project**
   - Right-click the tray icon
   - Select your project
   - Click "Remove"

5. **Create a JSON Note**
    - Right-click the tray icon
    - Select your project
    - Click "New JSON Note"
    - A note is created and opened in your IDE
    - If you write content, it will be auto-moved to the scratch directory

6. **View All Notes**
    - Right-click the tray icon
    - Select your project
    - Click "View all notes..."
    - Browse, search, and open all JSON notes for that project


## 🛠️ Supported IDEs

The application automatically detects and supports the following IDEs:

### Code Editors
- **Visual Studio Code** (`code`)
- **Sublime Text** (`subl`)
- **Atom** (`atom`)
- **Brackets** (`brackets`)

### Java IDEs
- **IntelliJ IDEA** (`idea`)
- **Eclipse** (`eclipse`)
- **NetBeans** (`netbeans`)

### Microsoft IDEs
- **Visual Studio** (`devenv`) - Windows only
- **Xcode** (`xcode-select`) - macOS only

### Web Development
- **WebStorm** (`webstorm`)
- **CodeSandbox** (`codesandbox`)

### Mobile Development
- **Android Studio** (`studio64`/`studio`)
- **FlutterFlow** (`flutterflow`)

### Python/Data Science
- **PyCharm** (`pycharm`)
- **JupyterLab** (`jupyter lab`)

### Terminal Editors
- **Neovim** (`nvim`)

## 👨‍💻 Technologies Used

| Technologies         | Description                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| **Electron**   | Framework for building cross-platform desktop applications using web technologies like HTML, CSS, and JavaScript. |
| **Sentry**           | Error tracking and performance monitoring tool used to capture and diagnose runtime issues in real time. |
| **JavaScript**     | Core programming language used to implement the application logic. |
| **electron-store** | Lightweight, persistent key-value storage for Electron apps, used to manage and save user data locally. |
| **Node.js** | Runtime environment that powers the backend of the Electron app, allowing access to native system APIs. |


## 📋 Prerequisites
Before getting started, make sure you have the following installed:

- Node.js (version 18 or higher)
- npm or yarn

## 🔧 Installation
Clone the repository:

```
git clone <https://github.com/Fabricio-Antonio/TrayOpen>
cd TrayOpen
```

Install dependencies:

```
npm install
# or
yarn install
```

### 🏃‍♂️ Running the Project
Development
```
# Start the development server
npm start
# or
yarn start
```

## 📁 Project Structure
```
TrayOpen/
├── src/
│   ├── main.js              # Application entry point
│   ├── app.js               # Main application logic
│   ├── ide-detector.js      # IDE detection module
│   ├── config/
│   │   └── app-config.js    # Application configuration
│   ├── constants/
│   │   └── ide-commands.js  # IDE command mappings
│   ├── types/
│   │   └── project.js       # Project validation
│   └── utils/
│       ├── project-manager.js
│       ├── dialog-helper.js
│       └── logger.js
├── assets/                  # Application icons
├── dist/                    # Build outputs
└── package.json
```

## 📝 Changelog

### v1.5.0 - LATEST
- New JSON Notes System: Complete integration of JSON note creation and management directly from the tray menu
- Smart File Management: Automatic file watching and movement of JSON notes from project directories to scratch directories when they contain content
- Enhanced IDE Integration: JSON notes can be opened directly in configured IDEs with automatic IDE detection and configuration
- Dedicated Notes Window: New "View all notes..." feature with a dedicated window to browse and manage all JSON notes for each project
- Advanced File Operations: Support for creating, opening, and deleting JSON notes with proper file path normalization and error handling
- Scratch Directory System: Intelligent organization of notes in user-specific scratch directories with project-based subdirectories
- Real-time File Monitoring: File watchers that detect changes and automatically move completed notes to scratch directories
- Improved Menu Structure: Reorganized tray menu with "More" submenu containing JSON functionality for better organization
- Enhanced Error Handling: Comprehensive logging and error management for all JSON note operations with Sentry integration
- Cross-platform File Support: Proper handling of file paths across Windows, and Linux with platform-specific considerations
- Debounced File Processing: Smart debouncing system to prevent file conflicts and ensure stable file operations
- Automatic IDE Opening: JSON notes are automatically opened in the configured IDE when created
- Project-specific Note Management: Each project maintains its own collection of JSON notes with proper isolation
- File Existence Validation: Robust checking for file existence in both project and scratch directories
- User Confirmation Dialogs: Proper confirmation dialogs for note deletion with user-friendly messaging

### v1.4.0

- Major refactor: complete modularization of the codebase
- New project structure with clear separation of concerns (`src/config`, `src/constants`,` src/types`, `src/utils`)
- Centralized configuration and schema management
- Improved project validation and error handling
- Added robust logging with Sentry integration
- Enhanced IDE detection logic (now supports 15+ IDEs)
- Dialogs and user interactions are now handled by dedicated helper modules
- Updated build scripts for easier cross-platform packaging
- Improved maintainability, scalability, and code readability

### v1.3.0
- Added comprehensive Linux distribution support with multiple installer formats
- Improved cross-distribution support for Linux
- Enhanced IDE detection and configuration
- Better error handling and logging
- Modular code architecture

### v1.2.0
- Added RPM installer for Fedora/openSUSE users
- Improved cross-distribution support for Linux

### v1.1.0
- Added support for .deb installer (easy installation for Ubuntu/Debian users)
- Implemented a check for the VS Code `code` command before opening projects
- Improved user experience and error handling on Linux and Windows

### v1.0.0
- Initial release
- Basic project management
- VS Code integration
- System tray functionality

## 📜 License

[MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

### 🤝 Want to contribute?
This project is open to contributions! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👥 Stay in touch

- Author - [Fabrício Santos](https://www.linkedin.com/in/fabricio-ss/)
- Website - [www.fabriciosantos.dev.br](https://www.fabriciosantos.dev.br)
- Youtube - [@DevFabricioSantos](https://www.youtube.com/@DevFabricioSantos)

