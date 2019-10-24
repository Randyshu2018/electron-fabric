/**
 * ipc通信工具类
 */
const ipcRenderer = require('electron').ipcRenderer
export default {
  send (eventName, options = {}) {
    const responseEvent = `${eventName}_res`
    return new Promise((resolve, reject) => {
      ipcRenderer.once(responseEvent, (event, response) => {
        if (response.code === 200) {
          resolve(response.data)
        } else {
          reject(response.data)
        }
      })
      ipcRenderer.send(eventName, options)
    })
  }
}
