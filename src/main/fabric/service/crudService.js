const Database = require('../db/db').Database
const blockdb = Database.getInstance('blockdb')
export class CRUDService {
  static getBlockList (req) {
    return new Promise(function (resolve, reject) {
      blockdb.find(req).sort({number: -1}).exec((err, data) => {
        if (err) {
          reject(err)
        }
        resolve({ status: 200, data })
      })
    })
  }

  static getBlockCount (req) {
    return new Promise(function (resolve, reject) {
      blockdb.count(req, (err, data) => {
        if (err) {
          reject(err)
        }
        resolve({ status: 200, data })
      })
    })
  }
  /**
   * @param block
   * @return {Promise}
   */
  static saveBlock = (block) => {
    return new Promise(function (resolve, reject) {
      blockdb.findOne({channelId: block.channelId, number: block.number}, (err, data) => {
        if (err) reject(new Error('Query error'))
        if (!data) {
          blockdb.insert(block, (error) => {
            if (error) {
              reject(new Error('The operation of insert into database failed'))
            }
            resolve()
          })
        }
      })
    })
  }
}
