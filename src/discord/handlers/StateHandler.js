const log = require('../../Log')

class StateHandler {
  constructor(discord) {
    this.discord = discord
    this.log = new log()
  }

  onReady() {
    this.log.discord('Discord client ready, logged in as ' + this.discord.client.user.tag)
  }
}

module.exports = StateHandler
