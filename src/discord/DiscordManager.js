const CommunicationBridge = require('../contracts/CommunicationBridge')
const StateHandler = require('./handlers/StateHandler')
const MessageHandler = require('./handlers/MessageHandler')
const CommandHandler = require('./commands/CommandHandler')
const Discord = require('discord.js-light')
const log = require('../Log')

class DiscordManager extends CommunicationBridge {
  constructor(app) {
    super()

    this.app = app

    this.stateHandler = new StateHandler(this)
    this.messageHandler = new MessageHandler(this, new CommandHandler(this))
    this.log = new log()
  }

  connect() {
    this.client = new Discord.Client({
      cacheGuilds: true,
      cacheChannels: true,
      cacheOverwrites: false,
      cacheRoles: true,
      cacheEmojis: false,
      cachePresences: false,
    })

    this.client.on('ready', () => this.stateHandler.onReady())
    this.client.on('message', message => this.messageHandler.onMessage(message))

    this.client.login(this.app.config.discord.token).catch(error => {
      this.log.error('Discord Bot Error: ', error)
    })
  }

  onBroadcast({ username, message, guildRank }) {
    this.client.channels.fetch(this.app.config.discord.channel).then(channel => {
      this.log.discord(`Discord Broadcast > ${username} [${guildRank}]: ${message}`)

      channel.send({
        embed: {
          description: message,
          color: 8311585,
          timestamp: new Date(),
          footer: {
            text: guildRank,
          },
          author: {
            name: username,
            icon_url: 'https://www.mc-heads.net/avatar/' + username,
          },
        },
      })
    })
  }
}

module.exports = DiscordManager
