/*
 * SPDX-License-Identifier: Apache-2.0
 */
// const helper = require('../../../common/helper')
//
// const logger = helper.getLogger('FabricEvent')
const logger = require('electron-logger')
logger.setLevel('debug')
// const BlockDecoder = require('fabric-client/lib/BlockDecoder')
// const CurdService = require('../service/crudService').CRUDService
// const Block = require('../model/Block').Block

/**
 *
 *
 * @class FabricEvent
 */
export class FabricEvent {
/**
 * Creates an instance of FabricEvent.
 * @param {*} client
 * @param {*} fabricServices
 * @memberof FabricEvent
 */
  constructor (client, fabricServices, syncService) {
    this.client = client
    this.fabricServices = fabricServices
    this.syncService = syncService
  }

  /**
   *
   *
   * * @memberof FabricEvent
   */
  initialize = async () => {
    // Creating channel event hub
    const channels = await this.client.getChannels()
    logger.info(JSON.stringify(channels.channels))

    // channels.channels.forEach(function (channelInfo, i) {
    for (let i = 0; i < channels.channels.length; i++) {
      let channelInfo = channels.channels[i]
      console.log('key:' + i + ' value : ' + channelInfo.channel_id)
      let channel = await this.client.getChannel(channelInfo.channel_id)
      logger.info(channelInfo.channel_id)
      const eventHub = FabricEvent.channelEventHubs.get(channelInfo.channel_id)
      if (eventHub) {
        logger.debug('initialize() - Channel.js event hub already exists for [%s]', channelInfo.channel_id)
        return
      }
      this.createChannelEventHub(channel)
      logger.debug('initialize() - Successfully created channel event hub for [%s]', channelInfo.channel_id)
    }
    // for (const channelInfo in channels.channels) {
    //   let channel = this.client.getChannel(channelInfo.channel_id)
    //   logger.info(channelInfo.channel_id)
    //   const eventHub = FabricEvent.channelEventHubs.get(channelInfo.channel_id)
    //   if (eventHub) {
    //     logger.debug('initialize() - Channel.js event hub already exists for [%s]', channelInfo.channel_id)
    //     continue
    //   }
    //   // this.createChannelEventHub(channel)
    //   logger.debug('initialize() - Successfully created channel event hub for [%s]', channelInfo.channel_id)
    // }
  }

  /**
   *
   * @param {*} channel
   * @memberof FabricEvent
   */
  createChannelEventHub (channel) {
    // Create channel event hub
    const eventHub = channel.newChannelEventHub(this.client.defaultPeer)
    eventHub.registerBlockEvent(
      async block => {
      // Skip first block, it is process by peer event hub
        if (!(block.header.number === '0' || block.header.number === 0)) {
          // await this.fabricServices.processBlockEvent(this.client, block)
          // await this.syncService.initializeChannelFromDiscover('qiushichannel')
          // console.log(this.syncService)
          // await CurdService.saveBlock(Block.parseFromObject(block))
        }
      },
      err => {
        logger.error('Block Event %s', err)
        console.error(err)
      },
      {}
    )
    this.connectChannelEventHub(channel.getName(), eventHub)
    // Set channel event hub to map
    FabricEvent.channelEventHubs.set(channel.getName(), eventHub)
  }
  /* eslint-disable */
	/**
	 *
	 *
	 * @param {*} channel_name
	 * @param {*} eventHub
	 * @returns
	 * @memberof FabricEvent
	 */
	connectChannelEventHub(channel_name, eventHub) {
		const _self = this
		if (eventHub) {
			eventHub.connect(true)
			setTimeout(
				channel_name => {
					_self.synchChannelBlocks(channel_name)
     _self.syncFromDiscover(channel_name)
				},
				5000,
				channel_name
			)
		} else {
			/* if channel event hub is not defined then create new channel event hub,
      this may happen when a new channel is created, and explorer is trying to get it
      */
			try {
				const channel = this.client.hfc_client.getChannel(channel_name)
				if (channel) {
					this.createChannelEventHub(channel)
				}
			} catch (err) {
				logger.error('Failed to get the channel ', err)
				console.error('Failed to get the channel ', err)
			}
			return false
		}
	}
	/**
	 *
	 *
	 * @param {*} channel_name
	 * @returns
	 * @memberof FabricEvent
	 */
	isChannelEventHubConnected(channel_name) {
		const eventHub = FabricEvent.channelEventHubs.get(channel_name)
		if (eventHub) {
			return eventHub.isconnected()
		}
		return false
	}

	/**
	 *
	 *
	 * @param {*} channel_name
	 * @returns
	 * @memberof FabricEvent
	 */
	disconnectChannelEventHub(channel_name) {
		logger.debug('disconnectChannelEventHub(' + channel_name + ')')

		const eventHub = FabricEvent.channelEventHubs.get(channel_name)
		return eventHub.disconnect()
	}

	/**
	 *
	 *
	 * @memberof FabricEvent
	 */
	disconnectEventHubs() {
		logger.debug('disconnectEventHubs()')

		// disconnect all event hubs
		for (const [
			channel_name,
			eventHub
		] of FabricEvent.channelEventHubs.entries()) {
			const status = this.isChannelEventHubConnected(channel_name)
			if (status) {
				this.disconnectChannelEventHub(channel_name)
			} else {
				logger.debug(
					'disconnectEventHubs(), no connection found ',
					channel_name,
					eventHub
				)
			}
		}
	}

	// channel event hub used to sync the blocks
	/**
	 *
	 *
	 * @param {*} channel_name
	 * @memberof FabricEvent
	 */
	async synchChannelBlocks(channel_name) {
		if (this.isChannelEventHubConnected(channel_name)) {
			const channel = this.client.hfc_client.getChannel(channel_name)
			await this.syncService.synchBlocks(this.client, channel)
		}
	}
	
	async syncFromDiscover (channelName) {
	  await this.syncService.processDiscoveryResult(channelName)
 }

	/**
	 *
	 *
	 * @memberof FabricEvent
	 */
	async synchBlocks() {
		// getting all channels list from client ledger
		const channels = await this.client
			.getHFC_Client()
			.queryChannels(this.client.getDefaultPeer().getName(), true)

		for (const channel of channels.channels) {
			const channel_name = channel.channel_id
			if (!this.client.getChannels().get(channel_name)) {
				// initialize channel, if it is not exists in the client context
				await this.client.initializeNewChannel(channel_name)
				await this.fabricServices.synchNetworkConfigToDB(this.client)
			}
		}
		for (const channel of channels.channels) {
			const channel_name = channel.channel_id
			// check channel event is connected
			if (this.isChannelEventHubConnected(channel_name)) {
				// call sync blocks
				const channel = this.client.hfc_client.getChannel(channel_name)
				await this.fabricServices.synchBlocks(this.client, channel)
			} else {
				const eventHub = FabricEvent.channelEventHubs.get(channel_name)
				if (eventHub) {
					// connect channel event hub
					this.connectChannelEventHub(channel_name, eventHub)
				} else {
					const channel = this.client.getChannels().get(channel_name)
					if (channel) {
						// create channel event hub
						this.createChannelEventHub(channel)
					} else {
						// initialize channel, if it is not exists in the client context
						await this.client.initializeNewChannel(this, channel_name)
						await this.fabricServices.synchNetworkConfigToDB(this.client)
					}
				}
			}
		}
	}
}

// static class variable
FabricEvent.channelEventHubs = new Map()