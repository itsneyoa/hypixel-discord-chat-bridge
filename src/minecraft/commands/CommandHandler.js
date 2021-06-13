const PingCommand = require('./PingCommand')
const GuildLobbyCommand = require('./GuildLobbyCommand')
const WeightCommand = require('./WeightCommand')
const DungeonsCommand = require('./DungeonsCommand')

class CommandHandler {
  constructor(minecraft) {
    this.minecraft = minecraft

    this.commands = [
      {
        trigger: ['!ping'],
        handler: new PingCommand(minecraft),
      },
      {
        trigger: ['!guildlobby', '!globby'],
        handler: new GuildLobbyCommand(minecraft),
      },
      {
        trigger: ['!weight', '!we'],
        handler: new WeightCommand(minecraft),
      },
      {
        trigger: ['!dungeons', '!cata', '!catacombs'],
        handler: new DungeonsCommand(minecraft),
      },
    ]
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
    this.minecraft.app.log.minecraft(`${player} - [${command.handler.constructor.name}] ${message}`)

    command.handler.onCommand(player, message)
  }
}

module.exports = CommandHandler
