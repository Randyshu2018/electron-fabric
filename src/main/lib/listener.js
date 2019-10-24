import {FabricClient} from '../fabric/FabricClient'
import event from './event'
import {FabricEvent} from '../fabric/sync/FabricEvent'
import {FabricService} from '../fabric/service/FabricService'
import {SyncService} from '../fabric/sync/SyncService'

const client = new FabricClient()
const syncService = new SyncService(client, null, null)
const channelEvent = new FabricEvent(client, null, syncService)

export default {
  async initialize () {
    await channelEvent.initialize()
    event.registerListener('channels', client.getChannels)
    event.registerListener('channel', client.getChannel)
    event.registerListener('block/list', FabricService.getBlockList)
    event.registerListener('block/count', FabricService.getBlockCount)
  }
}
