const MinecraftCommand = require('../../contracts/MinecraftCommand')

class WeightCommand extends MinecraftCommand {
  onCommand(username, message) {
    let args = this.getArgs(message)
    let user = args.shift()

    this.discord.app.api.fetch(user ? user : username).then(res => {
      this.send(`${res.username}'s weight for their ${res.name} profile is ${res.weight.toFixed(2)} + ${res.weight_overflow.toFixed(2)} Overflow (${(res.weight + res.weight_overflow).toFixed(2)} Total)`)
    }).catch(e => this.discord.app.log.warn(e))
  }
}

module.exports = WeightCommand
