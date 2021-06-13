const MinecraftCommand = require('../../contracts/MinecraftCommand')

class Scuj extends MinecraftCommand {
  onCommand(username, message) {
    var array = ["s", "c", "u", "j"];
    array.push(array.shift());
    this.sendToGuild(`${scuj[0]}${scuj[1}${scuj[2}${scuj[3}`)
  }
}

module.exports = Scuj
