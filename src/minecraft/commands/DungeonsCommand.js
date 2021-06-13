const MinecraftCommand = require('../../contracts/MinecraftCommand')

class DungeonsCommand extends MinecraftCommand {
  onCommand(username, message) {
    let args = this.getArgs(message)
    let user = args.shift()
    let profile = args.shift()

    this.minecraft.app.api.fetch(user ? user : username, profile).then(res => {
      if (res.dungeons != null) {
        this.sendToGuild(`${res.username} on profile ${res.name} is Catacombs ${res.dungeons.types.catacombs.level.toFixed(2)} and ${res.dungeons.selected_class} ${res.dungeons.classes[res.dungeons.selected_class].level.toFixed(2)} with ${res.dungeons.secrets_found} secrets found`)
      } else {
        this.sendToGuild(`${res.username} has not entered dungeons on their ${res.name} profile`)
      }
    }).catch(e => this.minecraft.app.log.warn(e))
  }
}

module.exports = DungeonsCommand
