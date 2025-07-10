const Sentry = require("@sentry/electron/main");

class Logger {
  static info(message, data = null) { 
    console.log(`[INFO] ${message}`, data || '');
  }
  
  static error(message, error = null) { 
    console.error(`[ERROR] ${message}`, error || '');
    if (error) {
      Sentry.captureException(error);
    }
  }
  
  static warn(message, data = null) {
    console.warn(`[WARN] ${message}`, data || '');
  }
  
  static debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data || '');
    }
  }
}

module.exports = Logger; 