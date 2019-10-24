'use strict'

import { app, BrowserWindow } from 'electron'
import autoUpdater from './lib/auto-updater'
import listener from './lib/listener'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

async function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      nodeIntegration: true
    },
    show: false
  })

  mainWindow.loadURL(winURL)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    mainWindow.webContents.send('ping', 'whoooooooh!')
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', function () {
  createWindow().then(() => {
    autoUpdater.init(mainWindow)
    listener.initialize()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

// // 发送消息给渲染线程
// function sendStatusToWindow (status, params) {
//   BrowserWindow.getFocusedWindow().webContents.send(status, params)
// }

// // disable auoDownload
// autoUpdater.autoDownload = false
//
// autoUpdater.on('error', (error) => {
//   logger.error('error:%s', error.message)
//   sendStatusToWindow(commonConst.ERROR, updaterConst.error)
// })
//
// autoUpdater.on('update-available', (info) => {
//   logger.info('info:%s', info)
//   sendStatusToWindow(commonConst.UPDATE_AVAILABLE, info)
// })
//
// autoUpdater.on('update-not-available', () => {
//   logger.info('info:%s', updaterConst.updateNotAvailable)
//   sendStatusToWindow(commonConst.UPDATE_NOT_AVAILABLE, updaterConst.updateNotAvailable)
// })
//
// autoUpdater.on('download-progress', (progress) => {
//   logger.info('progress:%s', JSON.stringify(progress))
//   sendStatusToWindow(commonConst.DOWNLOAD_PROGRESS, progress)
// })
//
// autoUpdater.on('update-downloaded', () => {
//   sendStatusToWindow(commonConst.DOWNLOADED, '')
// })
//
// ipcMain.on(commonConst.DOWNLOAD_NOW, function () {
//   autoUpdater.downloadUpdate().then(path => {
//     logger.info('***********start download*************')
//     logger.info('file will store at %s', path)
//   })
// })
//
// ipcMain.on(commonConst.UPDATE_NOW, function () {
//   logger.info('***********start update*************')
//   autoUpdater.quitAndInstall()
// })
