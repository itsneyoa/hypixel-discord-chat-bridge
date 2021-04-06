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

    this.client.on('ready', () => {
      this.stateHandler.onReady()
      this.client.user.setActivity('Guild Chat', { type: 'WATCHING' })

      this.client.channels.fetch(this.app.config.discord.channel).then(channel => {
        channel.send({
          embed: {
            description: 'Chat Bridge is Online',
            color: '7CFC00',
            timestamp: new Date(),
            author: {
              name: this.client.user.username,
              icon_url: this.client.user.avatarURL()
            }
          }
        })
      })
    })
    
    this.client.on('message', message => this.messageHandler.onMessage(message))

    this.client.login(this.app.config.discord.token).catch(error => {
      this.log.error('Discord Bot Error: ', error)
    })

    process.on('SIGINT', () => {
      this.client.channels.fetch(this.app.config.discord.channel).then(channel => {
        channel.send({
          embed: {
            description: 'Chat Bridge is Offline',
            color: 'DC143C',
            timestamp: new Date(),
            author: {
              name: this.client.user.username,
              icon_url: this.client.user.avatarURL()
            }
          }
        }).then(() => { process.exit() }
        )
      })
    })
  }

  onBroadcast({ username, message, guildRank }) {
    this.client.channels.fetch(this.app.config.discord.channel).then(channel => {
      this.log.discord(`Discord Broadcast > ${username} [${guildRank}]: ${message}`)

      channel.send({
        embed: {
          description: message,
          color: '909090',
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

  onLogin(username) {
    this.client.channels.fetch(this.app.config.discord.channel).then(channel => {
      channel.send({
        embed: {
          color: '7CFC00',
          timestamp: new Date(),
          author: {
            name: `${username} joined.`,
            icon_url: 'https://www.mc-heads.net/avatar/' + username,
          },
        },
      })
    })
  }

  onLogout(username) {
    this.client.channels.fetch(this.app.config.discord.channel).then(channel => {
      channel.send({
        embed: {
          color: 'DC143C',
          timestamp: new Date(),
          author: {
            name: `${username} left.`,
            icon_url: 'https://www.mc-heads.net/avatar/' + username,
          },
        },
      })
    })
  }
}

module.exports = DiscordManager
