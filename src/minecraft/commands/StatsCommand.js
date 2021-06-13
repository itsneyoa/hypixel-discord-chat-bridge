const MinecraftCommand = require('../../contracts/MinecraftCommand')

class StatsCommand extends MinecraftCommand {
  onCommand(username, message) {
    let args = this.getArgs(message)
    let user = args.shift()
    let profile = args.shift()

    this.minecraft.app.api.fetch(user ? user : username, profile).then(res => {
      this.sendToGuild(`${res.username}'s stats for their ${res.name} profile are ${Math.floor(res.slayers.bosses.revenant.level)}/${Math.floor(res.slayers.bosses.tarantula.level)}/${Math.floor(res.slayers.bosses.sven.level)}/${Math.floor(res.slayers.bosses.enderman.level)} slayers, ${Math.floor(res.skills.average_skills)} skill average and ${Math.floor(res.coins.total).toLocaleString('en-US')} coins.`)
    }).catch(e => this.minecraft.app.log.warn(e))
  }
}

module.exports = StatsCommand
