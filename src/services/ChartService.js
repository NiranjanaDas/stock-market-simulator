const colors = require('../utils/colors')

class ChartService {
    static generatePriceChart(stock, width = 60, height = 10) {
        if (stock.history.length < 2) {
            return 'Insufficient data for chart'
        }

        const prices = stock.history.slice(-width)
        const min = Math.min(...prices)
        const max = Math.max(...prices)
        const range = max - min || 1

        const chart = []
        for (let y = height - 1; y >= 0; y--) {
            let line = ''
            const threshold = min + (range * y / (height - 1))

            for (let x = 0; x < prices.length; x++) {
                const price = prices[x]
                const prevPrice = x > 0 ? prices[x - 1] : price

                if (price >= threshold) {
                    if (price > prevPrice) {
                        line += `${colors.green}█${colors.reset}`
                    } else if (price < prevPrice) {
                        line += `${colors.red}█${colors.reset}`
                    } else {
                        line += `${colors.yellow}█${colors.reset}`
                    }
                } else {
                    line += ' '
                }
            }

            const priceLabel = `$${(min + range * y / (height - 1)).toFixed(2)}`
            chart.push(`${priceLabel.padStart(8)} │${line}`)
        }

        const xAxis = '         └' + '─'.repeat(width)
        chart.push(xAxis)

        const timeLabels = []
        for (let i = 0; i < prices.length; i += Math.max(1, Math.floor(prices.length / 10))) {
            timeLabels.push(`${i}`.padStart(2))
        }
        chart.push(`           ${timeLabels.join(' '.repeat(Math.max(1, Math.floor(width / timeLabels.length) - 1)))}`)

        return chart.join('\n')
    }

    static generatePortfolioChart(player, stocks, width = 60, height = 10) {
        const diversification = player.getPortfolioDiversification(stocks)

        if (diversification.length === 0) {
            return 'No portfolio data available'
        }

        const chart = []
        chart.push(`${colors.cyan}${colors.bright}Portfolio Allocation${colors.reset}`)
        chart.push('')

        diversification.forEach((holding, index) => {
            const barLength = Math.round((holding.percentage / 100) * width)
            const bar = '█'.repeat(barLength) + '░'.repeat(width - barLength)
            const color = this.getHoldingColor(index)

            chart.push(`${color}${holding.symbol.padEnd(6)}${colors.reset} ${bar} ${holding.percentage.toFixed(1).padStart(5)}%`)
        })

        chart.push('')
        chart.push(`${colors.dim}Total Value: $${player.getTotalValue(stocks).toFixed(2)}${colors.reset}`)

        return chart.join('\n')
    }

    static generatePerformanceChart(player, stocks, periods = 20) {
        const history = player.transactionHistory.slice(-periods)
        if (history.length < 2) {
            return 'Insufficient transaction history'
        }

        const performance = []
        let runningTotal = player.initialCash

        performance.push({ value: runningTotal, label: 'Start' })

        history.forEach(tx => {
            if (tx.type === 'buy') {
                runningTotal -= tx.total
            } else {
                runningTotal += tx.total
            }
            performance.push({ value: runningTotal, label: tx.symbol })
        })

        const currentValue = player.getTotalValue(stocks)
        performance.push({ value: currentValue, label: 'Current' })

        const min = Math.min(...performance.map(p => p.value))
        const max = Math.max(...performance.map(p => p.value))
        const range = max - min || 1

        const chart = []
        for (let y = 10; y >= 0; y--) {
            let line = ''
            const threshold = min + (range * y / 10)

            performance.forEach((point, index) => {
                if (point.value >= threshold) {
                    line += point.value > (performance[index - 1]?.value || point.value) ? '↗' : '↘'
                } else {
                    line += ' '
                }
            })

            const valueLabel = `$${(min + range * y / 10).toFixed(0)}`.padStart(8)
            chart.push(`${valueLabel} │${line}`)
        }

        const xAxis = '         └' + '─'.repeat(performance.length)
        chart.push(xAxis)

        return chart.join('\n')
    }

    static getHoldingColor(index) {
        const colors = [colors.green, colors.blue, colors.yellow, colors.magenta, colors.cyan, colors.red]
        return colors[index % colors.length]
    }

    static generateCandlestickChart(stock, periods = 20) {
        if (stock.history.length < periods) {
            return 'Insufficient data for candlestick chart'
        }

        const prices = stock.history.slice(-periods)
        const chart = []

        chart.push(`${colors.cyan}${colors.bright}${stock.symbol} Candlestick Chart${colors.reset}`)
        chart.push('')

        prices.forEach((price, index) => {
            const prevPrice = index > 0 ? prices[index - 1] : price
            const change = price - prevPrice

            const body = change >= 0 ? '█' : '░'
            const color = change > 0 ? colors.green : change < 0 ? colors.red : colors.yellow

            const wick = change >= 0 ? '│' : '│'
            const candle = `${color}${wick}${body}${wick}${colors.reset}`

            chart.push(`${index.toString().padStart(2)} ${candle} $${price.toFixed(2).padStart(7)} ${change >= 0 ? '+' : ''}${change.toFixed(2)}`)
        })

        return chart.join('\n')
    }
}

module.exports = ChartService
