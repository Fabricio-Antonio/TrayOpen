module.exports = {
  appName: 'TrayOpen',
  appId: 'com.fabriciosantos.trayopen',
  version: '1.4.0',
  description: 'Minimalist desktop application that sits in the system tray and offers quick access to your recent projects.',
  author: {
    name: 'Fabrício Santos',
    email: 'fabricio.ss2117@gmail.com',
    url: 'https://github.com/Fabricio-Antonio'
  },
  sentry: {
    dsn: "https://949124c69b4f1784d74250255500ae46@o4509625221251072.ingest.de.sentry.io/4509625303302224"
  },
  schema: {
    projects: {
      type: "array",
      default: [],
    },
  }
}; 