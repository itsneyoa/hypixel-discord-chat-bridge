const MinecraftCommand = require('../../contracts/MinecraftCommand')

class CoinsCommand extends MinecraftCommand {
  onCommand(username, message) {
    let args = this.getArgs(message)
    let user = args.shift()
    let profile = args.shift()

    this.minecraft.app.api.fetch(user ? user : username, profile).then(res => {
      this.sendToGuild(`${res.username}'s has ${Math.floor(res.coins.total).toLocaleString('en-US')} coins on their ${res.name} profile.`)
    }).catch(e => this.minecraft.app.log.warn(e))
  }
}

module.exports = CoinsCommand
