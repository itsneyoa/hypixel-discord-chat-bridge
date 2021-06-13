const MinecraftCommand = require('../../contracts/MinecraftCommand')

class SlayerCommand extends MinecraftCommand {
  onCommand(username, message) {
    let args = this.getArgs(message)
    let user = args.shift()
    let profile = args.shift()

    this.minecraft.app.api.fetch(user ? user : username, profile).then(res => {
      this.sendToGuild(`${res.username}'s slayers for their ${res.name} profile are ${Math.floor(res.slayers.bosses.revenant)} / ${Math.floor(res.slayers.bosses.tarantula)} / ${Math.floor(res.slayers.bosses.sven)} / ${Math.floor(res.slayers.bosses.enderman)} with ${res.slayers.total_experience} total experience and $${res.slayers.total_coins_spent.toLocaleString('en-US')} total coins spent`)
    }).catch(e => this.minecraft.app.log.warn(e))
  }
}

module.exports = SlayerCommand
