import {version} from '../../../package.json'
const app = require('electron').app
app.getVersion = () => version
const ipcMain = require('electron').ipcMain
const autoUpdater = require('electron-updater').autoUpdater
const commonConst = require('../constant').common.const
const updaterConst = require('../constant').autoupdater.const

const logger = require('electron-logger')

// disable auoDownload
autoUpdater.autoDownload = false

let win

// send message to render process
function sendStatusToWindow (status, params) {
  logger.info('status:' + status + ', param:' + JSON.stringify(params))
  win.webContents.send(status, params)
}

export default {
  init (BrowserWindow) {
    win = BrowserWindow
    autoUpdater.on('error', (error) => {
      logger.error('error:', error.message)
      sendStatusToWindow(commonConst.ERROR, updaterConst.error)
    })

    autoUpdater.on('update-available', (info) => {
      logger.info('update-available:' + JSON.stringify(info))
      sendStatusToWindow(commonConst.UPDATE_AVAILABLE, info)
    })

    autoUpdater.on('update-not-available', () => {
      logger.info(updaterConst.updateNotAvailable)
      sendStatusToWindow(commonConst.UPDATE_NOT_AVAILABLE, updaterConst.updateNotAvailable)
    })

    autoUpdater.on('download-progress', (progress) => {
      logger.info('progress:%s', JSON.stringify(progress))
      sendStatusToWindow(commonConst.DOWNLOAD_PROGRESS, progress)
    })

    autoUpdater.on('update-downloaded', () => {
      sendStatusToWindow(commonConst.DOWNLOADED, updaterConst.downloaded)
    })

    ipcMain.on(commonConst.CHECKING, function () {
      logger.info('***********start checking*************')
      autoUpdater.checkForUpdates()
    })

    ipcMain.on(commonConst.DOWNLOAD_NOW, function () {
      autoUpdater.downloadUpdate().then(path => {
        logger.info('***********start download*************')
        logger.info('file will store at %s', path)
      })
    })

    ipcMain.on(commonConst.UPDATE_NOW, function () {
      logger.info('***********start update*************')
      autoUpdater.quitAndInstall()
    })
  }
}
