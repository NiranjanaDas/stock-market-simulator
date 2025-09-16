const colors = require('../utils/colors')

class Stock {
    constructor(symbol, name, price, volatility = 0.02) {
        this.symbol = symbol
        this.name = name
        this.price = price
        this.previousPrice = price
        this.volatility = volatility
        this.history = [price]
    }

    updatePrice() {
        this.previousPrice = this.price
        const change = (Math.random() - 0.5) * 2 * this.volatility + 0.0001
        this.price = Math.max(0.01, this.price * (1 + change))
        this.history.push(this.price)
        if (this.history.length > 50) this.history.shift()
    }

    getPriceChange() {
        return this.price - this.previousPrice
    }

    getPriceChangePercent() {
        return ((this.price - this.previousPrice) / this.previousPrice) * 100
    }

    getFormattedPrice() {
        return `$${this.price.toFixed(2)}`
    }

    getFormattedChange() {
        const change = this.getPriceChange()
        const changePercent = this.getPriceChangePercent()
        const sign = change >= 0 ? '+' : ''
        const color = change > 0 ? colors.green : change < 0 ? colors.red : colors.yellow
        return `${color}${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)${colors.reset}`
    }
}

module.exports = Stock