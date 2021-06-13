const MinecraftCommand = require('../../contracts/MinecraftCommand')

class CoinflipCommand extends MinecraftCommand {
  onCommand(username, message) {
    let coin = Math.floor(Math.random() * 2);
if coin == 1 {
    this.sendToGuild(`You got heads, ${username}!`)
} else {
    this.sendToGuild(`You got tails, ${username}!`)
  }
}

module.exports = CoinflipCommand
