/*
 * SPDX-License-Identifier: Apache-2.0
 */

// const grpc = require('grpc')
// const convertHex = require('convert-hex')
// const helper = require('../../../common/helper')

// const logger = helper.getLogger('SyncServices')
// const ExplorerError = require('../../../common/ExplorerError')
// const FabricUtils = require('../../../platform/fabric/utils/FabricUtils')
// const fabric_const = require('../../../platform/fabric/utils/FabricConst')
// .fabric.const
// const explorer_error = require('../../../common/ExplorerMessage').explorer
// .error

// const _transProto = grpc.load(
//   `${__dirname}/../../../../node_modules/fabric-client/lib/protos/peer/transaction.proto`
// ).protos
//
// const blocksInProcess = []
//
// // Transaction.js validation code
// const _validationCodes = {}
// const keys = Object.keys(_transProto.TxValidationCode)
// for (let i = 0; i < keys.length; i++) {
//   const newKey = _transProto.TxValidationCode[keys[i]]
//   _validationCodes[newKey] = keys[i]
// }
// const logger = require('../../lib/logger')
// import { Block } from '../model/Block'

// import { Block } from '../model/Block'
// import { Transaction } from '../model/Transaction'

// import { Block } from '../model/Block'

import { Block } from '../model/Block'
import { Transaction } from '../model/Transaction'
import { Peer } from '../model/Peer'
import { Chaincode } from '../model/Chaincode'
import { Channel } from '../model/Channel'

const FabricService = require('../service/FabricService').FabricService
const logger = require('../utils/helper').getLogger()
// const CurdService = require('../service/crudService').CRUDService
// const BlockDecoder = require('fabric-client/lib/BlockDecoder')

/**
 *
 *
 * @class SyncServices
 */
export class SyncService {
  /**
   * Creates an instance of SyncServices.
   * @param {*} platform
   * @param {*} persistence
   * @memberof SyncServices
   */
  constructor (client, fabricService, persistence) {
    this.client = client
    this.fabricService = fabricService
    this.persistence = persistence
    this.blocks = []
    this.synchInProcess = []
  }

  /**
   *
   *
   * @memberof SyncServices
   */
  async initialize () {}
  /* eslint-enable */
  /**
   *
   *
   * @param {*} client
   * @returns
   * @memberof SyncServices
   */
  async synchNetworkConfigToDB (client) {
    // const channels = client.getChannels()
    // for (const [channelName, channel] of channels.entries()) {
    //   console.log(
    //     'SyncServices.synchNetworkConfigToDB client ',
    //     client.client_name,
    //     ' channel_name ',
    //     channelName
    //   )
    //   const block = await client.getGenesisBlock(channel)
    //   const channelGenesisHash = await FabricUtils.generateBlockHash(
    //     block.header
    //   )
    //   const res = await this.insertNewChannel(
    //     client,
    //     channel,
    //     block,
    //     channelGenesisHash
    //   )
    //   if (res) {
    //     await this.insertFromDiscoveryResults(
    //       client,
    //       channel,
    //       channelGenesisHash
    //     )
    //   } else {
    //     return false
    //   }
    // }
    // return true
  }

  // Insert new channel to DB
  /**
   *
   * @param {*} client
   * @param {*} channel
   * @param {*} block
   * @param {*} channelGenesisHash
   * @returns
   * @memberof SyncServices
   */
  async insertNewChannel (channelName) {
    const channel = this.client.getChannel(channelName)
    logger.info(`channel: ${channel.getName()}`)
    await FabricService.saveChannel(Channel.parseFromObject(channel))
  }

  /**
   *
   *
   * @param {*} client
   * @param {*} channel
   * @param {*} channelGenesisHash
   * @memberof SyncServices
   */
  async insertFromDiscoveryResults (client, channel, channelGenesisHash) {
    // const channel_name = channel.getName()
    // const discoveryResults = await client.initializeChannelFromDiscover(
    //   channel_name
    // )
    // // Insert peer
    // if (discoveryResults && discoveryResults.peers_by_org) {
    //   for (const org_name in discoveryResults.peers_by_org) {
    //     const org = discoveryResults.peers_by_org[org_name]
    //     for (const peer of org.peers) {
    //       await this.insertNewPeer(peer, channelGenesisHash, client)
    //     }
    //   }
    // }
    // // Insert orderer
    // if (discoveryResults && discoveryResults.orderers) {
    //   for (const org_name in discoveryResults.orderers) {
    //     const org = discoveryResults.orderers[org_name]
    //     for (const orderer of org.endpoints) {
    //       orderer.org_name = org_name
    //       await this.insertNewOrderers(orderer, channelGenesisHash, client)
    //     }
    //   }
    // }
    //
    // // Insert chaincode
    // await this.insertNewChannelChaincode(
    //   client,
    //   channel,
    //   channelGenesisHash,
    //   discoveryResults
    // )
  }

  /**
   *
   *
   * @param {*} channelName
   * @returns
   * @memberof FabricClient
   */
  initializeChannelFromDiscover = async (channelName) => {
    console.debug('initializeChannelFromDiscover ', channelName)
    let channel = this.client.getChannel(channelName, false)
    if (!channel) {
      await this.initializeNewChannel(channelName)
      channel = this.getChannel(channelName)
    }
    if (channel) {
      // if (!this.tls) {
      //   this.client.setConfigSetting('discovery-protocol', 'grpc')
      // } else {
      //   this.client.setConfigSetting('discovery-protocol', 'grpcs')
      // }
      await channel.initialize({
        discover: true,
        target: this.defaultPeer,
        asLocalhost: this.asLocalhost
      })
    }

    const discoverRequest = {
      target: this.defaultPeer,
      config: true
    }
    const discoverResults = await channel._discover(discoverRequest)
    // console.log(
    //   'Discover results for client [%s] >> %j',
    //   this.client_name,
    //   discoverResults
    // )
    return discoverResults
  }

  // /**
  //  *
  //  *
  //  * @param {*} peer
  //  * @param {*} channelGenesisHash
  //  * @param {*} client
  //  * @memberof SyncServices
  //  */
  // async insertNewPeer (peer, channelGenesisHash, client) {
  //   let eventurl = ''
  //   let requesturl = peer.endpoint
  //   const host_port = peer.endpoint.split(':')
  //   if (
  //     client.client_config.peers &&
  //   client.client_config.peers[host_port[0]] &&
  //   client.client_config.peers[host_port[0]].url
  //   ) {
  //     requesturl = client.client_config.peers[host_port[0]].url
  //   }
  //   if (
  //     client.client_config.peers &&
  //   client.client_config.peers[host_port[0]] &&
  //   client.client_config.peers[host_port[0]].eventUrl
  //   ) {
  //     eventurl = client.client_config.peers[host_port[0]].eventUrl
  //   }
  //
  //   const peer_row = {
  //     mspid: peer.mspid,
  //     requests: requesturl,
  //     events: eventurl,
  //     server_hostname: host_port[0],
  //     channelGenesisHash,
  //     peer_type: 'PEER'
  //   }
  //   await this.persistence.getCrudService().savePeer(peer_row)
  //   const channel_peer_row = {
  //     peerid: host_port[0],
  //     channelid: channelGenesisHash
  //   }
  //   await this.persistence.getCrudService().savePeerChannelRef(channel_peer_row)
  // }

  /**
   *
   *
   * @param {*} orderer
   * @param {*} channelGenesisHash
   * @param {*} client
   * @memberof SyncServices
   */
  async insertNewOrderers (orderer, channelGenesisHash, client) {
    // const discoveryProtocol = client.hfc_client.getConfigSetting(
    //   'discovery-protocol'
    // )
    // const requesturl = `${discoveryProtocol}://${orderer.host}:${orderer.port}`
    // console.log(
    //   'insertNewOrderers discoveryProtocol ',
    //   discoveryProtocol,
    //   ' requesturl ',
    //   requesturl
    // )
    //
    // const orderer_row = {
    //   mspid: orderer.org_name,
    //   requests: requesturl,
    //   server_hostname: orderer.host,
    //   channelGenesisHash,
    //   peer_type: 'ORDERER'
    // }
    // await this.persistence.getCrudService().savePeer(orderer_row)
    // const channel_orderer_row = {
    //   peerid: orderer.host,
    //   channelid: channelGenesisHash
    // }
    // await this.persistence
    //   .getCrudService()
    //   .savePeerChannelRef(channel_orderer_row)
  }

  /**
   *
   *
   * @param {*} channelName
   * @memberof SyncServices
   */
  async insertNewChannelChaincode (
    channelName
  ) {
    const channel = this.client.getChannel(channelName)
    const chaincodes = await channel.queryInstantiatedChaincodes(
      this.client.defaultPeer,
      true
    )
    for (const chaincode of chaincodes.chaincodes) {
      // const chaincode_row = {
      //   name: chaincode.name,
      //   version: chaincode.version,
      //   path: chaincode.path,
      //   txcount: 0,
      //   createdt: new Date(),
      //   channelGenesisHash
      // }
      await FabricService.saveChaincode(Chaincode.parseFromObject(channelName, chaincode))
    }
  }

  /**
   *
   *
   * @param {*} chaincode
   * @param {*} endpoint
   * @param {*} channelGenesisHash
   * @memberof SyncServices
   */
  async insertNewChaincodePeerRef (chaincode, endpoint, channelGenesisHash) {
    // const host_port = endpoint.split(':')
    // const chaincode_peer_row = {
    //   chaincodeid: chaincode.name,
    //   cc_version: chaincode.version,
    //   peerid: host_port[0],
    //   channelid: channelGenesisHash
    // }
    // await this.persistence
    //   .getCrudService()
    //   .saveChaincodPeerRef(chaincode_peer_row)
  }

  synchBlocks = async (client, channel) => {
    console.log('=========syncBlocks==========')
    // const clientName = client.getClientName()
    // const channelName = channel.getName()
    //
    // const syncKey = `${clientName}_${channelName}`
    // if (this.synchInProcess.includes(syncKey)) {
    //   logger.info(`Block synch in process for >> ${clientName}_${channelName}`)
    //   return
    // }
    // this.synchInProcess.push(syncKey)
    // Get channel information from ledger
    const channelInfo = await channel.queryInfo(this.client.defaultPeer, true)
    // const channelGenesisHash = client.getChannelGenHash(channel_name)
    const blockHeight = parseInt(channelInfo.height.low)
    // Query missing blocks from DB
    const results = await FabricService.getMissedBlockNumbers(blockHeight)
    logger.info(`results.length: ${results.length}`)
    if (results) {
      for (let i = 0; i < results.length; i++) {
        // Get block by number
        logger.info(`block num: ${results[i]}`)
        const block = await channel.queryBlock(results[i], this.client.defaultPeer, true)
        logger.info(`block: ${block}`)
        await this.processBlockEvent(client, block)
      }
    } else {
      console.log('Missing blocks not found for %s', channel.getName())
    }
    // const index = this.synchInProcess.indexOf(syncKey)
    // this.synchInProcess.splice(index, 1)
  }

  /**
   *
   *
   * @param {*} client
   * @param {*} block
   * @returns
   * @memberof SyncServices
   */
  processBlockEvent = async (client, block) => {
    let transactionList = Transaction.parseFromObject(block)
    for (let i = 0; i < transactionList.length; i++) {
      await FabricService.saveTransaction(transactionList[i])
    }
    await FabricService.saveBlock(Block.parseFromObject(block))
  }

  /**
   *
   * @param channelName
   * @return {Promise.<void>}
   */
  async processDiscoveryResult (channelName) {
    const discoveryResults = await this.initializeChannelFromDiscover(
      channelName
    )
    // Insert peer
    if (discoveryResults && discoveryResults.peers_by_org) {
      for (const orgName in discoveryResults.peers_by_org) {
        const org = discoveryResults.peers_by_org[orgName]
        for (const peer of org.peers) {
          // await this.insertNewPeer(peer, , client);
          logger.info(`peer: ${JSON.stringify(peer)}`)
          await FabricService.savePeer(Peer.parseFromObject(channelName, peer))
        }
      }
    }
    // fixme Don't display orderer info now
    // Insert orderer
    if (discoveryResults && discoveryResults.orderers) {
      for (const orgName in discoveryResults.orderers) {
        const org = discoveryResults.orderers[orgName]
        for (const orderer of org.endpoints) {
          orderer.org_name = orgName
          // await this.insertNewOrderers(orderer, channel_genesis_hash, client);
          logger.info(`orderer: ${JSON.stringify(orderer)}`)
        }
      }
    }

    // Insert chaincode
    await this.insertNewChannelChaincode(
      channelName
    )
    // Insert channel
    await this.insertNewChannel(channelName)

    // ----------interface------------
    /* info */
    let info = await FabricService.info()
    logger.info(`info: ${JSON.stringify(info)}`)
    /* peerList */
    let req = {channelId: 'mychannel'}
    let channelList = await FabricService.getChannelList()
    logger.info(`channelList: ${JSON.stringify(channelList)}`)

    /* blockList */
    let blockList = await FabricService.getBlockList(req)
    logger.info(`blockList: ${JSON.stringify(blockList)}`)

    /* blockInfo */
    let blockReq = {channelId: 'mychannel', number: '4'}
    let block = await FabricService.getBlock(blockReq)
    logger.info(`block: ${JSON.stringify(block)}`)

    /* transactionList */
    let transactionList = await FabricService.getTransactionList(req)
    logger.info(`transactionList: ${JSON.stringify(transactionList)}`)

    /* transactionInfo */
    let txReq = {channelId: 'mychannel', txId: '7f9b83f0286973b2d10412e15d2bb27ed242c34f0fc7760c126e65e904df3148'}
    let transaction = await FabricService.getTransaction(txReq)
    logger.info(`transaction: ${JSON.stringify(transaction)}`)

    /* peerList */
    let peerList = await FabricService.getPeerList(req)
    logger.info(`peerList: ${JSON.stringify(peerList)}`)

    /* chaincodeList */
    let chaincodeList = await FabricService.getChaincodeList(req)
    logger.info(`chaincodeList: ${JSON.stringify(chaincodeList)}`)
  }

  /**
   *
   * @returns
   * @memberof SyncServices
   */
  getPlatform () {
    return this.platform
  }

  /**
   *
   * @returns
   * @memberof SyncServices
   */
  getPersistence () {
    return this.persistence
  }
}

// module.exports = SyncServices
