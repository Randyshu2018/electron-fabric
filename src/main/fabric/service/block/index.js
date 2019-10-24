// Get db instance
const db = require('../../utils/helper').getDBInstance('blockdb')
/**
 *
 * @param block
 * @return {Promise}
 */
export async function save (block) {
  return new Promise(function (resolve, reject) {
    db.findOne({channelId: block.channelId, number: block.number}, (err, data) => {
      if (err) reject(new Error('Query error'))
      if (!data) {
        db.insert(block, (error) => {
          if (error) {
            reject(new Error('The operation of insert into database failed'))
          }
          resolve(data)
        })
      } else {
        resolve()
        // reject(new Error('block has exist!'))
      }
    })
  })
}

/**
 *
 * @param req
 * @return {Promise}
 */
export async function query (req) {
  return new Promise(function (resolve, reject) {
    db.findOne(req, (err, data) => {
      console.log(data)
      if (err) reject(err)
      resolve(data)
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
    db.find(req).sort({number: -1}).exec((err, data) => {
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
