const MinecraftCommand = require('../../contracts/MinecraftCommand')

class CoinflipCommand extends MinecraftCommand {
  onCommand(username, message) {
    switch(Math.floor(Math.random() * 2)){
  case 0:
    this.sendToGuild(`You got heads, ${username}!`)
    break;
  case 1:
    this.sendToGuild(`You got tails, ${username}!`)
    break;
    }
}

module.exports = CoinflipCommand
