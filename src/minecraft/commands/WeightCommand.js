const MinecraftCommand = require('../../contracts/MinecraftCommand')

class WeightCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'weight'
    this.aliases = ['we']
    this.description = "Gets a user's player weight"
  }

  onCommand(username, message, origin) {
    let args = this.getArgs(message)
    let user = args.shift()
    let profile = args.shift()

    this.minecraft.app.api.fetch(user ? user : username, profile).then(res => {
      this.reply(username, `${res.username}'s weight for their ${res.name} profile is ${res.weight.toFixed(2)} + ${res.weight_overflow.toFixed(2)} Overflow (${(res.weight + res.weight_overflow).toFixed(2)} Total)`, origin)
    }).catch(e => this.minecraft.app.log.warn(e))
  }
}

module.exports = WeightCommand