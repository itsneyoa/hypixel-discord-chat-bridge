const MinecraftCommand = require('../../contracts/MinecraftCommand')
const { version } = require('../../../package.json')

class AboutCommand extends MinecraftCommand {
  onCommand(username, message) {
    this.sendToGuild(`Hi ${username}, I'm ${this.minecraft.bot.username} - The guild's bridge bot. You can read more about what I am and how to use me at https://bridge.neyoa.me! I'm currently running version ${version}.`)
  }
}

module.exports = AboutCommand
