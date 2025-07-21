/**
 * Simple Logger for Kpop News Aggregator
 */
class Logger {
  constructor(module = 'App') {
    this.module = module;
  }

  info(message, meta = {}) {
    console.log(`[INFO] [${this.module}] ${message}`, meta);
  }

  error(message, meta = {}) {
    console.error(`[ERROR] [${this.module}] ${message}`, meta);
  }

  warn(message, meta = {}) {
    console.warn(`[WARN] [${this.module}] ${message}`, meta);
  }

  debug(message, meta = {}) {
    console.log(`[DEBUG] [${this.module}] ${message}`, meta);
  }
}

module.exports = { Logger };
module.exports.default = Logger;