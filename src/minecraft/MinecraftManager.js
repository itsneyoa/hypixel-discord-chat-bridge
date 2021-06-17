const CommunicationBridge = require('../contracts/CommunicationBridge')
const CommandHandler = require('./CommandHandler')
const StateHandler = require('./handlers/StateHandler')
const ErrorHandler = require('./handlers/ErrorHandler')
const ChatHandler = require('./handlers/ChatHandler')
const mineflayer = require('mineflayer')

class MinecraftManager extends CommunicationBridge {
  constructor(app) {
    super()

    this.app = app

    this.stateHandler = new StateHandler(this)
    this.errorHandler = new ErrorHandler(this)
    this.chatHandler = new ChatHandler(this, new CommandHandler(this))
  }

  connect() {
    this.bot = this.createBotConnection()

    this.errorHandler.registerEvents(this.bot)
    this.stateHandler.registerEvents(this.bot)
    this.chatHandler.registerEvents(this.bot)
  }

  createBotConnection() {
    return mineflayer.createBot({
      host: this.app.config.server.host,
      port: this.app.config.server.port,
      username: this.app.config.minecraft.username,
      password: this.app.config.minecraft.password,
      version: false,
      auth: this.app.config.minecraft.accountType,
    })
  }

  onBroadcast({ username, message, replyingTo }) {
    this.app.log.broadcast(`${username}: ${message}`, 'Minecraft')

    if (this.bot.player !== undefined) {
      this.bot.chat(`/gc ${this.obfuscate(`${replyingTo ? `${username} replying to ${replyingTo}:` : `${username}:`} ${message}`)}`)
    }
  }

  obfuscate(message) {
    let maxTimes = 128
    let values = ['\u0801', '\u0802', '\u0803', '\u0804', '\u0805', '\u0806', '\u0807', '\u0808', '\u0809', '\u080A', '\u080B', '\u080C', '\u080D', '\u080E', '\u080F', '\u0810', '\u0811', '\u0812', '\u0813', '\u0814', '\u0815']

    let times = Math.floor(Math.random() * maxTimes)
    let messageArray = message.split()

    for (let i = 0; i < times; i++) {
      let position = Math.floor(Math.random() * messageArray.length + 1)
      let char = Math.floor(Math.random() * values.length + 1)

      messageArray.splice(position, 0, values[char])
    }

    return messageArray.join('')
  }
}

module.exports = MinecraftManager
