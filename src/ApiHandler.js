const axios = require('axios')
const { setupCache } = require('axios-cache-adapter')

class ApiHandler {
  constructor(app) {
    let cache = setupCache({ maxAge: 2 * 1000 * 60 }) // Cache API responses for 2 minutes

    this.facade = axios.create({
      baseURL: 'https://hypixel-api.senither.com/v1/profiles/',
      method: 'get',
      headers: { 'Authorization': app.config.minecraft.apiKey },
      adapter: cache.adapter
    })

    this.mojang = axios.create({
      baseURL: 'https://api.mojang.com/users/profiles/minecraft/',
      method: 'get',
      adapter: cache.adapter
    })
  }

  fetch(username) {
    return new Promise((resolve, reject) => {
      this.mojang(username).then(mojang => {
        if (mojang.data) {
          let uuid = mojang.data.id

          this.facade(uuid + '/save').then(facade => {
            resolve(facade.data.data)
          }).catch(reject)
        } else {
          reject(`InvalidUsername`)
        }
      }).catch(reject)
    })
  }
}

module.exports = ApiHandler