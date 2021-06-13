const PingCommand = require('./PingCommand')
const GuildLobbyCommand = require('./GuildLobbyCommand')
const WeightCommand = require('./WeightCommand')
const DungeonsCommand = require('./DungeonsCommand')
const SlayerCommand = require('./SlayerCommand')
const AboutCommand = require('./AboutCommand')
const StatsCommand = require('./StatsCommand')
const MoneyCommands = require('./MoneyCommand')
const DiceCommands = require('./DiceCommand')

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
      {
        trigger: ['!slayer', '!slayers'],
        handler: new SlayerCommand(minecraft),
      },
      {
        trigger: ['!about', '!help', '!info'],
        handler: new AboutCommand(minecraft),
      },
      {
        trigger: ['!stats', '!user'],
        handler: new StatsCommand(minecraft),
      },
      {
        trigger: ['!coins', '!bank'],
        handler: new MoneyCommands(minecraft),
      },
      {
        trigger: ['!roll', '!dice'],
        handler: new DiceCommands(minecraft),
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
