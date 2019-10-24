const ipcMain = require('electron').ipcMain
export default {
  registerListener (eventName, handler) {
    ipcMain.on(eventName, async (e, request) => {
      console.log(eventName)
      console.log(request)
      const response = {code: 200}
      try {
        console.log(handler)
        response.data = await handler(request)
      } catch (err) {
        response.code = err.code || 500
        response.data = {message: err.message || 'Main process error.'}
      }
      e.sender.send(`${eventName}_res`, response)
    })
  }
}
