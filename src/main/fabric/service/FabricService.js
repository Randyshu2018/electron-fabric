const blockService = require('./block')
const txService = require('./transaction')
const peerService = require('./peer')
const chaincodeService = require('./chaincode')
const channelService = require('./channel')
const logger = require('../utils/helper').getLogger()

export class FabricService {
  /**
   *
   * @param block
   * @return {Promise}
   */
  static async saveBlock (block) {
    return new Promise(async function (resolve, reject) {
      logger.info(`saveBlock-->begin`)
      try {
        let ret = await blockService.save(block)
        logger.info(`saveBlock: ${JSON.stringify(ret)} `)
        resolve()
      } catch (err) {
        logger.error(`${err}`)
        // reject(err)
      }
      logger.info(`saveBlock-->end`)
    })
  }
  static async getBlock (req) {
    logger.info(`getBlock req: ${JSON.stringify(req)}`)
    let block = await blockService.query(req)
    logger.debug(`blocks: ${JSON.stringify(block)} `)
    return Promise.resolve(block)
  }
  static async getBlockList (req) {
    let blocks = await blockService.list(req)
    logger.debug(`blocks: ${JSON.stringify(blocks)} `)
    return Promise.resolve(blocks)
  }
  static async getBlockCount (req) {
    let total = await blockService.count(req)
    logger.debug(`block total: ${JSON.stringify(total)}`)
    return Promise.resolve(total)
  }
  static async saveTransaction (transaction) {
    return new Promise(async function (resolve, reject) {
      logger.info(`saveTransaction-->begin`)
      try {
        let ret = await txService.save(transaction)
        logger.info(`saveTransaction: ${JSON.stringify(ret)} `)
        resolve()
      } catch (err) {
        logger.error(`${err}`)
      }
      logger.info(`saveTransaction-->end`)
    })
  }
  static async getTransaction (req) {
    logger.info(`getTransaction req: ${JSON.stringify(req)}`)
    let transaction = await txService.query(req)
    logger.debug(`transaction: ${JSON.stringify(transaction)} `)
    return Promise.resolve(transaction)
  }
  static async getTransactionList (req) {
    let blocks = await txService.list(req)
    logger.debug(`transactions: ${JSON.stringify(blocks)} `)
    return Promise.resolve(blocks)
  }
  static async getTransactionCount (req) {
    let total = await txService.count(req)
    logger.debug(`transaction total: ${JSON.stringify(total)}`)
    return Promise.resolve(total)
  }

  static async savePeer (peer) {
    return new Promise(async function (resolve, reject) {
      logger.info(`savePeer-->begin`)
      try {
        let ret = await peerService.save(peer)
        logger.info(`savePeer: ${JSON.stringify(ret)} `)
        resolve()
      } catch (err) {
        logger.error(`${err}`)
      }
      logger.info(`savePeer-->end`)
    })
  }
  static async getPeerList (req) {
    let blocks = await peerService.list(req)
    logger.debug(`peerList: ${JSON.stringify(blocks)} `)
    return Promise.resolve(blocks)
  }
  static async getPeerCount (req) {
    let total = await peerService.count(req)
    logger.debug(`peer total: ${JSON.stringify(total)}`)
    return Promise.resolve(total)
  }

  static async saveChaincode (chaincode) {
    return new Promise(async function (resolve, reject) {
      logger.info(`saveChaincode-->begin`)
      try {
        let ret = await chaincodeService.save(chaincode)
        logger.info(`saveChaincode: ${JSON.stringify(ret)} `)
        resolve()
      } catch (err) {
        logger.error(`${err}`)
      }
      logger.info(`saveChaincode-->end`)
    })
  }
  static async getChaincodeList (req) {
    let blocks = await chaincodeService.list(req)
    logger.debug(`peerList: ${JSON.stringify(blocks)} `)
    return Promise.resolve(blocks)
  }
  static async getChaincodeCount (req) {
    let total = await chaincodeService.count(req)
    logger.debug(`peer total: ${JSON.stringify(total)}`)
    return Promise.resolve(total)
  }

  static async saveChannel (channel) {
    return new Promise(async function (resolve, reject) {
      logger.info(`saveChannel-->begin`)
      try {
        let ret = await channelService.save(channel)
        logger.info(`saveChannel: ${JSON.stringify(ret)} `)
        resolve()
      } catch (err) {
        logger.error(`${err}`)
      }
      logger.info(`saveChannel-->end`)
    })
  }

  static async getChannelList (req) {
    let blocks = await channelService.list(req)
    logger.debug(`peerList: ${JSON.stringify(blocks)} `)
    return Promise.resolve(blocks)
  }
  static async getChannelCount (req) {
    let total = await channelService.count(req)
    logger.debug(`peer total: ${JSON.stringify(total)}`)
    return Promise.resolve(total)
  }
  static async info () {
    let channelList = await this.getChannelList()
    for (let i = 0; i < channelList.length; i++) {
      let channel = channelList[i]
      let req = {channelId: channel.name}
      channel.blockCount = await this.getBlockCount(req)
      channel.txCount = await this.getTransactionCount(req)
      channel.peerCount = await this.getPeerCount(req)
      channel.chaincodeCount = await this.getChaincodeCount(req)
    }
    return channelList
  }
  /**
   * return missed block Numbers
   * @param height
   * @return {Promise.<Array>}
   */
  static async getMissedBlockNumbers (height) {
    let blockList = await this.getBlockList()
    logger.info(`${JSON.stringify(blockList)}`)
    let missedNums = []
    if (height !== blockList.length) {
      for (let i = 0; i < height; i++) {
        let exist = false
        for (let j = 0; j < blockList.length; j++) {
          if (blockList[j].number === i + '') {
            exist = true
            break
          }
        }
        if (!exist) missedNums.push(i)
      }
    }
    logger.debug(`missed blocks: ${JSON.stringify(missedNums)}`)
    return Promise.resolve(missedNums)
  }
}
