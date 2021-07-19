const DiscordCommand = require('../../contracts/DiscordCommand')

class ExecuteCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)

    this.name = 'execute'
    this.aliases = ['exec', 'e']
    this.description = 'Executes commands as the minecraft bot'
  }

  onCommand(message) {
    let args = this.getArgs(message).join(' ')

    if (args.length == 0) {
      return message.reply(`No command specified`)
    }

    this.sendMinecraftMessage(`/${args}`)

    message.reply(`\`/${args}\` has been executed`)
  }
}

module.exports = ExecuteCommand
