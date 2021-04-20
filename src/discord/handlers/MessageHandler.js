class MessageHandler {
  constructor(discord, command) {
    this.discord = discord
    this.command = command
  }

  onMessage(message) {
    if (!this.shouldBroadcastMessage(message)) {
      return
    }

    if (this.command.handle(message)) {
      return
    }

    const content = this.stripDiscordContent(message.content).trim()
    if (content.length == 0) {
      return
    }

    this.discord.broadcastMessage({
      username: message.member.displayName,
      message: this.stripDiscordContent(message.content),
    })
  }

  stripDiscordContent(message) {
    return message
      .replace(/[^a-z0-9=\\\\\\-+_)(*&^%$#@!\[\]';,\./><`~{}':" ?|\\^]/gi, '\n')
      .replace(/\bb+a+l+d+|j+b+a+l+d+|b+\*+l+d+|b+a+d+l+|j+b+a+d+l+|n+i+g+g+e+r|n+i+g+g+a|b+q+l+d|b+o+l+d|theultimateb+a+l+d+|d+l+a+b|a+b+l+d|b+l+a+d|theb+a+l+d_mc|i+b+a+l+d\b/gi, '\n')
      .split('\n')
      .map(part => {
        part = part.trim()

        return part.length == 0 ? '' : part + ' '
      })
      .join('')
  }

  shouldBroadcastMessage(message) {
    return !message.author.bot && message.channel.id == this.discord.app.config.discord.channel && message.content && message.content.length > 0
  }
}

module.exports = MessageHandler
