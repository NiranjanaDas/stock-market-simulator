const { calculateSMA, calculateRSI } = require('./helpers')

class TechnicalIndicators {
    static getSMA(stock, period = 20) {
        return calculateSMA(stock.history, period)
    }

    static getRSI(stock, period = 14) {
        return calculateRSI(stock.history, period)
    }

    static getPriceTrend(stock, periods = 5) {
        if (stock.history.length < periods) return 'insufficient_data'

        const recent = stock.history.slice(-periods)
        const first = recent[0]
        const last = recent[recent.length - 1]

        const change = ((last - first) / first) * 100

        if (change > 1) return 'bullish'
        if (change < -1) return 'bearish'
        return 'sideways'
    }

    static getVolatility(stock, periods = 20) {
        if (stock.history.length < periods) return null

        const prices = stock.history.slice(-periods)
        const returns = []

        for (let i = 1; i < prices.length; i++) {
            returns.push((prices[i] - prices[i - 1]) / prices[i - 1])
        }

        const mean = returns.reduce((a, b) => a + b, 0) / returns.length
        const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length

        return Math.sqrt(variance) * Math.sqrt(252) * 100
    }

    static getSupportResistance(stock, lookback = 20) {
        if (stock.history.length < lookback) return { support: null, resistance: null }

        const prices = stock.history.slice(-lookback)
        const sorted = [...prices].sort((a, b) => a - b)

        return {
            support: sorted[Math.floor(sorted.length * 0.25)],
            resistance: sorted[Math.floor(sorted.length * 0.75)]
        }
    }
}

module.exports = TechnicalIndicators