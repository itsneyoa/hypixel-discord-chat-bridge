const DiscordCommand = require('../../contracts/DiscordCommand')

class SetRankCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)

    this.name = 'unmute'
    this.aliases = ['um']
    this.description = `Unmutes the specified user`
  }

  onCommand(message) {
    let args = this.getArgs(message)
    let user = args.shift()

    this.sendMinecraftMessage(`/g unmute ${user ? user : ''}`)
  }
}

module.exports = SetRankCommand
