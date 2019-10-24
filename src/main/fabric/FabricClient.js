const hfc = require('fabric-client')
const path = require('path')
const isDev = require('electron-is-dev')
export class FabricClient {
  constructor () {
    this.hfc_client = hfc.loadFromConfig(
      isDev ? path.join(__dirname, 'network-config-first-network.yaml') : path.resolve(process.resourcesPath, 'src/main/fabric/network-config-first-network.yaml')
    )
    this.defaultPeer = this.hfc_client.getTargetPeers('peer0.org1.example.com')[0]
  }
  /**
   * return channel info according to channelName
   * @param channelName
   * @return {Channel}
   */
  getChannel = (channelName) => {
    return this.hfc_client.getChannel(channelName)
  }
  /**
   * return channels info
   * @return {Promise}
   */
  getChannels = () => {
    return this.hfc_client.queryChannels(this.defaultPeer, true)
  }
}
