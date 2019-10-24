// Get db instance
const db = require('../../utils/helper').getDBInstance('peerdb')
/**
 *
 * @param peer
 * @return {Promise}
 */
export async function save (peer) {
  return new Promise(function (resolve, reject) {
    db.findOne({channelId: peer.channelId, name: peer.name}, (err, data) => {
      if (err) reject(new Error('Query error'))
      if (!data) {
        db.insert(peer, (error) => {
          if (error) {
            reject(new Error('The operation of insert into database failed'))
          }
          resolve(data)
        })
      } else {
        resolve()
        // reject(new Error(`peer ${peer.name} has exist!`))
      }
    })
  })
}
/**
 * return list
 * @param req
 * @return {Promise}
 */
export async function list (req) {
  return new Promise(function (resolve, reject) {
    db.find(req).exec((err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

/**
 * return count
 * @param req
 * @return {Promise}
 */
export async function count (req) {
  return new Promise(function (resolve, reject) {
    db.count(req, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}
