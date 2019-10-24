export class Transaction {
  constructor (channelId, number, txId, type, creator, readSet, writeSet, timestamp) {
    this.channelId = channelId
    this.number = number
    this.txId = txId
    this.type = type
    this.creator = creator
    this.readSet = readSet
    this.writeset = writeSet
    this.timestamp = timestamp
  }
  static parseFromObject (block) {
    if (block && block.header && block.data.data) {
      const header = block.header
      const channelId = block.data.data[0].payload.header.channel_header.channel_id
      const number = header.number
      let arr = []
      for (let i = 0; i < block.data.data.length; i++) {
        const txObj = block.data.data[i]
        const txId = txObj.payload.header.channel_header.tx_id
        const type = txObj.payload.header.channel_header.typeString
        const creator = txObj.payload.header.signature_header.creator.Mspid
        const timestamp = txObj.payload.header.channel_header.timestamp
        let readSet
        let writeSet
        if (txObj.payload.data.actions !== undefined) {
          const rwset =
            txObj.payload.data.actions[0].payload.action.proposal_response_payload
              .extension.results.ns_rwset
          const readSetTemp = rwset.map(i => ({
            chaincode: i.namespace,
            set: i.rwset.reads
          }))
          const writeSetTemp = rwset.map(i => ({
            chaincode: i.namespace,
            set: i.rwset.writes
          }))
          readSet = JSON.stringify(readSetTemp, null, 2)
          writeSet = JSON.stringify(writeSetTemp, null, 2)
        }
        arr.push(new Transaction(channelId, number, txId, type, creator, readSet, writeSet, timestamp))
      }
      return arr
    }
  }
}
