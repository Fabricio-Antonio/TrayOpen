
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




## Description
TrayOpen is a minimalist desktop app built with ElectronJS. I created this project to explore desktop application development and integrate observability tools like Sentry.


## 🎯 Project Objective

TrayOpen is a minimalist desktop application built with ElectronJS that runs in the system tray and provides instant access to your recent projects. With a single click, you can open any project directly in Visual Studio Code. It's designed for developers who value speed, simplicity, and productivity in their daily workflow.

### 🚀 Key Features
1. System Tray Interface
- Runs discreetly in the system tray.

- Adaptive icon depending on the operating system: iconTemplate.png for macOS, icon.png for others.
<br/>

2. Project Management
- Add Projects: "Add new project..." option lets you select folders through a file dialog.

- Project Listing: displays all saved projects using the folder name as the label.

- Remove Projects: each listed project has a "Remove" option to delete it from storage.
<br/>

3. Quick Launch in Visual Studio Code
- Each project has a submenu option "Open in VS Code".

- Runs code [project-path] to open the folder directly in the editor.

- Seamless native integration with Visual Studio Code.
<br/>

4. Data Persistence
- Uses electron-store for local storage of project data.

- Data persists between sessions and is validated with a schema to ensure consistency.
<br/>

5. Auto Startup
- Configured to launch automatically with the operating system (Windows and macOS).

- Leverages the openAtLogin feature to stay available at system startup.
<br/>

6. Cross-Platform Compatibility
- Fully compatible with Windows, macOS, and Linux.

- Automatically adjusts icons and behaviors to match each OS.

- On macOS, the Dock icon is hidden for a cleaner interface.
<br/>

7. Monitoring & Stability
- Integrated with Sentry for real-time error tracking and crash reporting.

- Implements robust data validation (e.g., JSON structure, array types) to ensure stability.



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
├── main.js              # Main file of app
├── package.json         # Configs and dependencies
├── assets/              # Icons of app
│   ├── icon.png         # Icons for Windows/Linux
│   └── iconTemplate.png # Icons for MacOS
├── dist/                # Builds of app
└── node_modules/        # Dependencies
```

## 👥 Stay in touch

- Author - [Fabrício Santos](https://www.linkedin.com/in/fabricio-ss/)
- Website - [www.fabriciosantos.dev.br](https://www.fabriciosantos.dev.br)
- Youtube - [@DevFabricioSantos](https://www.youtube.com/@DevFabricioSantos)

## 📜 License

[MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

### 🤝 Want to contribute?
This project is open to contributions! Feel free to fork, open an issue, or submit a PR.

