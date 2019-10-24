export class Chaincode {
  constructor (channelId, name, version) {
    this.channelId = channelId
    this.name = name
    this.version = version
  }
  static parseFromObject (channelName, chaincode) {
    return new Chaincode(channelName, chaincode.name, chaincode.version)
  }
}
