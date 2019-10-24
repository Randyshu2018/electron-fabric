export class Peer {
  constructor (channelId, name, mspId, endpoint) {
    this.channelId = channelId
    this.name = name
    this.mspId = mspId
    this.endpoint = endpoint
  }
  static parseFromObject (channelName, peer) {
    let name = peer.endpoint.split(':')[0]
    return new Peer(channelName, name, peer.mspid, peer.endpoint)
  }
}
