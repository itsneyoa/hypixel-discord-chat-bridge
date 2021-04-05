const chalk = require('chalk')

class log {
    handler(message) {
        return console.log(chalk.grey(message))
    }

    discord(message) {
        return console.log(chalk.cyan(message))
    }

    minecraft(message) {
        return console.log(chalk.green(message))
    }

    party(message) {
        return console.log(chalk.blue(message))
    }

    error(message) {
        return console.log(chalk.black.bgRed(message))
    }

    other(message) {
        return console.log(chalk.white(message))
    }
}

module.exports = log