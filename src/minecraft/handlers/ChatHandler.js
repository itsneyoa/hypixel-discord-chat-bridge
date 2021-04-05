const EventHandler = require('../../contracts/EventHandler')
const chalk = require('chalk')
const fetch = require('node-fetch')

class StateHandler extends EventHandler {
  constructor(minecraft, command) {
    super()

    this.minecraft = minecraft
    this.command = command
    this.inviter = ''
    this.partyLeader = ''
  }

  async registerEvents(bot) {
    this.bot = bot

    this.bot.on('message', (...args) => this.onMessage(...args))

    this.guildMembers = await this.getGuildMembers(this.minecraft.app.config.minecraft.guildName);

    setInterval(async () => {  // Refresh it every 15 minutes
      this.guildMembers = await this.getGuildMembers(this.minecraft.app.config.minecraft.guildName);
    }, 900000)
  }

  onMessage(event) {
    const message = event.toString().trim()

    if (this.isLobbyJoinMessage(message)) {
      console.log(chalk.yellow('Sending Minecraft client to limbo'))
      return this.bot.chat('/ac §')
    }

    if (this.isPartyInviteMessage(message)) {
      this.inviter = message.split(" ")[1]
      if (this.inviter === "has") this.inviter = message.split(" ")[0].replace("-----------------------------\n", "") // Nons

      if (this.guildMembers && !this.guildMembers.has(this.inviter)) {
        setTimeout(() => {
          console.log("Won't accept party invite from: " + this.inviter + ", since they aren't in " + this.minecraft.app.config.minecraft.guildName)
          let sorryMsg = "Sorry, this bot is set to only accept party invites from guild members! Join " + this.minecraft.app.config.minecraft.guildName + "!"

          sorryMsg = this.addCharToString(sorryMsg, "⭍", 15);
          this.bot.chat("/msg " + this.inviter + " " + sorryMsg)
        }, 100)
      } else {
        console.log("Accepting party invite from: " + this.inviter)

        setTimeout(() => {
          this.bot.chat("/p join " + this.inviter)
        }, 100)
      }
      return
    }

    if (this.inviter) {
      if (this.isMessageYouJoinedParty(message)) {
        console.log("Joined party from: " + this.inviter)
        this.partyLeader = this.inviter
        this.inviter = 0

        setTimeout(() => {
          this.bot.chat(
            "/pc fragruns go brr"
          )
        }, 1000)

        setTimeout(() => {
          console.log("Leaving party from: " + this.partyLeader)
          this.partyLeader = 0

          this.bot.chat("/p leave")
        }, 5000)
      } else if (this.isMessageYoureInParty(message)) {
        console.log("Can't join " + this.inviter + "'s party, already in a party with: " + this.partyLeader)
        let pastInviter = this.inviter
        this.inviter = 0

        let sorryMsg = "Sorry, I'm already in a party with " + (this.partyLeader ? this.partyLeader : "someone") + ", try in a bit! uwu"

        sorryMsg = this.addCharToString(sorryMsg, "⭍", 15);
        this.bot.chat("/msg " + pastInviter + " " + sorryMsg)
        setTimeout((pastInviter) => {
          if (this.inviter === pastInviter || this.partyLeader == 0) this.bot.chat("/p leave") // In case it gets stuck
        }, 5000)
      }
    }

    if (!this.isGuildMessage(message)) {
      return
    }

    let parts = message.split(':')
    let group = parts.shift().trim()
    let hasRank = group.endsWith(']')

    let userParts = group.split(' ')
    let username = userParts[userParts.length - (hasRank ? 2 : 1)]
    let guildRank = userParts[userParts.length - 1].replace(/\W/g, '')

    if (this.isMessageFromBot(username)) {
      return
    }

    const playerMessage = parts.join(':').trim()
    if (this.command.handle(username, playerMessage)) {
      return
    }

    this.minecraft.broadcastMessage({
      username: username,
      message: playerMessage,
      guildRank: guildRank,
    })
  }

  isMessageFromBot(username) {
    return this.bot.username === username
  }

  isLobbyJoinMessage(message) {
    return (message.endsWith(' the lobby!') || message.endsWith(' the lobby! <<<')) && message.includes('[MVP+')
  }

  isGuildMessage(message) {
    return message.startsWith('Guild >') && message.includes(':')
  }

  isPartyInviteMessage(message) {
    return message.endsWith(" here to join!\n-----------------------------") && !message.includes(':')
  }

  isMessageYouJoinedParty(message) {
    return message.endsWith(" party!") && !message.includes(':')
  }

  isMessageYoureInParty(message) {
    return message.endsWith(" to join another one.") && !message.includes(':')
  }

  addCharToString(string, chars, times) {
    for (let i = 0; i < times; i++) {
      let randomNumber = Math.floor(Math.random() * string.length + 1)
      let a = string.split("")

      a.splice(randomNumber, 0, chars)
      string = a.join("")
    }
    return string
  }

  async getGuildMembers(guildname) {
    console.log("Getting players from guild: " + guildname)

    const responseHypixel = await fetch("https://api.hypixel.net/guild?name=" + guildname + "&key=" + this.minecraft.app.config.minecraft.hypixelToken)
    const dataHypixel = await responseHypixel.json()

    if (dataHypixel && dataHypixel.guild) {
      let members = new Map()

      await Promise.all(
        dataHypixel.guild.members.map(async (member) => {
          const response = await fetch("https://api.mojang.com/user/profiles/" + member.uuid + "/names")
          const data = await response.json()

          members.set(data.pop().name, member.uuid)
        })
      )

      console.log(members.size + " players from guild: " + guildname + " fetched!")
      return members
    } else {
      console.log("Guild " + guildname + " not found or Hypixel API Token is invalid!")
    }
  }
}

module.exports = StateHandler
