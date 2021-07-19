const DiscordCommand = require('../../contracts/DiscordCommand')

class SetRankCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)

    this.name = 'setrank'
    this.aliases = ['rank', 'sr']
    this.description = `Sets the user's guild rank to the given rank name`
  }

  onCommand(message) {
    let args = this.getArgs(message)
    let user = args.shift()
    let rank = args.shift()

    this.sendMinecraftMessage(`/g setrank ${user ? user : ''} ${rank ? rank : ''}`)
  }
}

module.exports = SetRankCommand
