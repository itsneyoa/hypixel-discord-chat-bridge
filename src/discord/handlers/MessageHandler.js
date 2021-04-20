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
      .replace(/\b(b+|a+)(a+|q+|o+|\*|b+|l+)(l+|d+|a+)(d+|b+|l+)|n+i+g+g+(e+r+|a+)|(i+|j+)(b+|a+)(a+|q+|o+|\*|b+l+)(l+|d+|a+)(d+|b+|l+)|t+h+e+u+l+t+i+m+a+t+e+(b+|a+)(a+|q+|o+|\*|b+|l+)(l+|d+|a+)(d+|b+|l+)|t+h+e+(b+|a+)(a+|q+|o+|\*|b+|l+)(l+|d+|a+)(d+|b+|l+)_+m+c+\b/gi, '\n')
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
