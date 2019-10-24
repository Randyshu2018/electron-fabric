const Nedb = require('nedb')
const path = require('path')
const blockdb = new Nedb({filename: path.join(__dirname, 'persistence/block.db'), autoload: true})
const transactiondb = new Nedb({filename: path.join(__dirname, 'persistence/transactiondb.db'), autoload: true})
const peerdb = new Nedb({filename: path.join(__dirname, 'persistence/peerdb.db'), autoload: true})
const chaincodedb = new Nedb({filename: path.join(__dirname, 'persistence/chaincodedb.db'), autoload: true})
const channeldb = new Nedb({filename: path.join(__dirname, 'persistence/channeldb.db'), autoload: true})

export class Database {
  static getInstance = (dbName) => {
    switch (dbName) {
      case 'blockdb' :
        return blockdb
      case 'transactiondb' :
        return transactiondb
      case 'peerdb' :
        return peerdb
      case 'chaincodedb' :
        return chaincodedb
      case 'channeldb' :
        return channeldb
      default :
        throw new Error('unknown db')
    }
  }
}
