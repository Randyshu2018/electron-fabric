const Database = require('../db/db').Database
const logger = require('electron-logger')
logger.setLevel('warn')

/**
 * Get db instance
 * @param name
 */
export function getDBInstance (name) {
  return Database.getInstance(name)
}

/**
 * Get logger instance
 */
export function getLogger () {
  return logger
}
