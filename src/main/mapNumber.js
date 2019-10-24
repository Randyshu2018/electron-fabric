// 主进程 mapNumbers.js
exports.withRendererCallback = (mapper) => {
  return [1, 2, 3].map(mapper)
}

exports.withLocalCallback = () => {
  return [1, 2, 3].map(x => x + 1)
}

exports.asyncMessage = () => {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve('say hello')
    }, 1000)
  })
}
