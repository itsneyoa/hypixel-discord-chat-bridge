const PingCommand = require('./PingCommand')
const GuildLobbyCommand = require('./GuildLobbyCommand')
const log = require('../../Log')

class CommandHandler {
  constructor(minecraft) {
    this.commands = [
      {
        trigger: ['!ping'],
        handler: new PingCommand(minecraft),
      },
      {
        trigger: ['!guildlobby', '!globby'],
        handler: new GuildLobbyCommand(minecraft),
      },
    ]
    this.log = new log()
  }

  handle(player, message) {
    const commandTrigger = message.toLowerCase().split(' ')[0]

    for (let command of this.commands) {
      for (let trigger of command.trigger) {
        if (trigger == commandTrigger) {
          this.runCommand(command, player, message)

          return true
        }
      }
    }

    return false
  }

  runCommand(command, player, message) {
    this.log.handler(`Minecraft Command Handler > ${player} - [${command.handler.constructor.name}] ${message}`)

    command.handler.onCommand(player, message)
  }
}

module.exports = CommandHandler
