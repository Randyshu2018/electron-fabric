export class Channel {
  constructor (name) {
    this.name = name
  }
  static parseFromObject (channel) {
    return new Channel(channel.getName())
  }
}
