class StateHandler {
  constructor(discord) {
    this.discord = discord
  }

  async onReady() {
    this.discord.app.log.discord('Client ready, logged in as ' + this.discord.client.user.tag)
    this.discord.client.user.setActivity('Guild Chat', { type: 'WATCHING' })

    if (this.discord.app.config.discord.messageMode == 'webhook') {
      this.discord.guildWebhook = await getWebhook(this.discord, this.discord.app.config.discord.guildChannel)
      this.discord.officerWebhook = await getWebhook(this.discord, this.discord.app.config.discord.officerChannel)
    }

    let onlineEmbed = {
      embed: {
        author: { name: `Chat Bridge is Online` },
        color: '47F049'
      }
    }

    this.discord.client.channels.fetch(this.discord.app.config.discord.guildChannel).then(channel => {
      channel.send(onlineEmbed)
    })

    this.discord.client.channels.fetch(this.discord.app.config.discord.officerChannel).then(channel => {
      channel.send(onlineEmbed)
    })
  }

  onClose() {
    let offlineEmbed = {
      embed: {
        author: { name: `Chat Bridge is Offline` },
        color: 'F04947'
      }
    }

    this.discord.client.channels.fetch(this.discord.app.config.discord.guildChannel).then(channel => {
      channel.send(offlineEmbed).then(() => {
        this.discord.client.channels.fetch(this.discord.app.config.discord.officerChannel).then(channel => {
          channel.send(offlineEmbed).then(() => { process.exit() })
        }).catch(() => { process.exit() })
      }).catch(() => { process.exit() })
    }).catch(() => { process.exit() })
  }
}

async function getWebhook(discord, channelID) {
  let channel = discord.client.channels.cache.get(channelID)
  let webhooks = await channel.fetchWebhooks()
  if (webhooks.first()) {
    return webhooks.first()
  } else {
    var res = await channel.createWebhook(discord.client.user.username, {
      avatar: discord.client.user.avatarURL(),
    })
    return res
  }
}

module.exports = StateHandler
