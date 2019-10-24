// Get db instance
const db = require('../../utils/helper').getDBInstance('transactiondb')
/**
 *
 * @param transaction
 * @return {Promise}
 */
export async function save (transaction) {
  return new Promise(function (resolve, reject) {
    db.findOne({channelId: transaction.channelId, number: transaction.number, txId: transaction.txId}, (err, data) => {
      if (err) reject(new Error('Query error'))
      if (!data) {
        db.insert(transaction, (error) => {
          if (error) {
            reject(new Error('The operation of insert into database failed'))
          }
          resolve(data)
        })
      } else {
        reject(new Error('transaction has exist!'))
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
    db.find(req).sort({timestamp: -1}).exec((err, data) => {
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
