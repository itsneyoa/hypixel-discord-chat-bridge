class MinecraftCommand {
  constructor(minecraft) {
    this.minecraft = minecraft
  }

  getArgs(message) {
    let args = message.split(' ')

    args.shift()

    return args
  }

  send(message) {
    if (this.minecraft.bot.player !== undefined) {
      this.minecraft.bot.chat(message)
    }
  }

  reply(username, message, origin) {
    if (this.minecraft.bot.player == undefined) {
      return
    }

    switch (origin) {
      case 'Guild':
        this.minecraft.bot.chat(`/gc ${message}`)
        break
      case 'Officer':
        this.minecraft.bot.chat(`/oc ${message}`)
        break
      case 'Party':
        this.minecraft.bot.chat(`/pc ${message}`)
        break
      case 'From':
        this.minecraft.bot.chat(`/w ${username} ${message}`)
        break
    }
  }

  onCommand(player, message) {
    throw new Error('Command onCommand method is not implemented yet!')
  }
}

module.exports = MinecraftCommand
