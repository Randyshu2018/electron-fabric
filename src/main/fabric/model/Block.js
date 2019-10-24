export class Block {
  constructor (channelId, number, dataHash, previousHash, txCount, txHash) {
    this.channelId = channelId
    this.number = number
    this.dataHash = dataHash
    this.previousHash = previousHash
    this.txCount = txCount
    this.txHash = txHash
  }
  static parseFromObject (block) {
    if (block && block.header && block.data.data) {
      let header = block.header
      /* 交易哈希 */
      let txHash = []
      for (let i = 0; i < block.data.data.length; i++) {
        const txObj = block.data.data[i]
        const txId = txObj.payload.header.channel_header.tx_id
        txHash.push(txId)
      }
      return new Block(block.data.data[0].payload.header.channel_header.channel_id, header.number, header.data_hash, header.previous_hash, block.data.data.length, txHash)
    }
    throw new Error('parse Block error')
  }
}
