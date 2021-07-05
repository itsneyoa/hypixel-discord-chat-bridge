const CommunicationBridge = require('../contracts/CommunicationBridge')
const StateHandler = require('./handlers/StateHandler')
const MessageHandler = require('./handlers/MessageHandler')
const CommandHandler = require('./CommandHandler')
const Discord = require('discord.js-light')

class DiscordManager extends CommunicationBridge {
  constructor(app) {
    super()

    this.app = app

    this.stateHandler = new StateHandler(this)
    this.messageHandler = new MessageHandler(this, new CommandHandler(this))
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
      this.app.log.error(error)

      process.exit(1)
    })

    process.on('SIGINT', () => this.stateHandler.onClose())
  }

  sendBotMessage(username, message, guildRank, channelID, colour) {
    this.app.discord.client.channels.fetch(channelID).then(channel => {
      channel.send({
        embed: {
          description: message,
          color: colour,
          timestamp: new Date(),
          footer: {
            text: guildRank,
          },
          author: {
            name: username,
            icon_url: 'https://www.mc-heads.net/avatar/' + username,
          },
        }
      })
    })
  }

  sendWebhookMessage(username, message, webhook) {
    message = message.replace(/@/g, '') // Stop pinging @everyone or @here
    webhook.send(
      message, { username: username, avatarURL: 'https://www.mc-heads.net/avatar/' + username }
    )
  }

  sendEvent(message, destination) {
    switch (destination.toLowerCase()) {
      case 'guild':
        this.app.discord.client.channels.fetch(this.app.config.discord.guildChannel).then(channel => {
          channel.send(message)
        })
        break;

      case 'officer':
        this.app.discord.client.channels.fetch(this.app.config.discord.officerChannel).then(channel => {
          channel.send(message)
        })
        break;

      case 'both':
        this.app.discord.client.channels.fetch(this.app.config.discord.guildChannel).then(channel => {
          channel.send(message)
        })
        this.app.discord.client.channels.fetch(this.app.config.discord.officerChannel).then(channel => {
          channel.send(message)
        })
        break;
    }
  }

  onGuildBroadcast({ username, message, guildRank }) {
    this.app.log.broadcast(`${username} [${guildRank}]: ${message}`, `Discord`)
    switch (this.app.config.discord.messageMode.toLowerCase()) {
      case 'bot':
        this.sendBotMessage(username, message, guildRank, this.app.config.discord.guildChannel, '6495ED')
        break

      case 'webhook':
        this.sendWebhookMessage(username, message, this.app.discord.guildWebhook)
        break

      default:
        throw new Error('Invalid message mode: must be bot or webhook')
    }
  }

  onOfficerBroadcast({ username, message, guildRank }) {
    this.app.log.broadcast(`${username} [${guildRank}]: ${message}`, `Discord`)
    switch (this.app.config.discord.messageMode.toLowerCase()) {
      case 'bot':
        this.sendBotMessage(username, message, guildRank, this.app.config.discord.officerChannel, '00AAAA')
        break

      case 'webhook':
        this.sendWebhookMessage(username, message, this.app.discord.officerWebhook)
        break

      default:
        throw new Error('Invalid message mode: must be bot or webhook')
    }
  }

  onBroadcastCleanEmbed({ message, color, destination }) {
    this.app.log.broadcast(message, 'Event')

    this.sendEvent({
      embed: {
        color: color,
        description: message,
      }
    }, destination)
  }

  onBroadcastHeadedEmbed({ message, title, icon, color, destination }) {
    this.app.log.broadcast(message, 'Event')

    this.sendEvent({
      embed: {
        color: color,
        author: {
          name: title,
          icon_url: icon,
        },
        description: message,
      }
    }, destination)
  }

  onPlayerToggle({ username, message, color }) {
    this.app.log.broadcast(username + ' ' + message, 'Event')

    switch (this.app.config.discord.messageMode.toLowerCase()) {
      case 'bot':
        this.sendEvent({
          embed: {
            color: color,
            timestamp: new Date(),
            author: {
              name: `${username} ${message}`,
              icon_url: 'https://www.mc-heads.net/avatar/' + username,
            },
          }
        }, 'Guild')
        break

      case 'webhook':
        this.app.discord.guildWebhook.send({
          username: username, avatarURL: 'https://www.mc-heads.net/avatar/' + username, embeds: [{
            color: color,
            description: `${username} ${message}`,
          }]
        })
        break

      default:
        throw new Error('Invalid message mode: must be bot or webhook')
    }
  }
}

module.exports = DiscordManager
