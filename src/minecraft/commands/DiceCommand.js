const MinecraftCommand = require('../../contracts/MinecraftCommand')

class CoinsCommand extends MinecraftCommand {
  onCommand(username, message) {
    let args = this.getArgs(message)
    let limit = args.shift()
    let num = Math.floor(Math.random() * (limit ? limit : 6)) + 1

    this.sendToGuild(`${username} rolled a ${num}`)
  }
}

module.exports = CoinsCommand
