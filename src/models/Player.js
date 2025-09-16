const { formatCurrency, formatPercentage } = require('../utils/helpers')

class Player {
    constructor(name, cash = 10000) {
        this.name = name
        this.cash = cash
        this.initialCash = cash
        this.portfolio = new Map()
        this.transactionHistory = []
    }

    buyStock(stock, quantity) {
        const cost = stock.price * quantity
        if (this.cash >= cost) {
            this.cash -= cost
            const currentQuantity = this.portfolio.get(stock.symbol) || 0
            this.portfolio.set(stock.symbol, currentQuantity + quantity)
            this.transactionHistory.push({
                type: 'buy',
                symbol: stock.symbol,
                quantity,
                price: stock.price,
                total: cost,
                timestamp: new Date()
            })
            return true
        }
        return false
    }

    sellStock(stock, quantity) {
        const currentQuantity = this.portfolio.get(stock.symbol) || 0
        if (currentQuantity >= quantity) {
            this.cash += stock.price * quantity
            this.portfolio.set(stock.symbol, currentQuantity - quantity)
            if (this.portfolio.get(stock.symbol) === 0) {
                this.portfolio.delete(stock.symbol)
            }
            this.transactionHistory.push({
                type: 'sell',
                symbol: stock.symbol,
                quantity,
                price: stock.price,
                total: stock.price * quantity,
                timestamp: new Date()
            })
            return true
        }
        return false
    }

    getPortfolioValue(stocks) {
        let portfolioValue = 0
        for (const [symbol, quantity] of this.portfolio) {
            const stock = stocks.find(s => s.symbol === symbol)
            if (stock) {
                portfolioValue += stock.price * quantity
            }
        }
        return portfolioValue
    }

    getTotalValue(stocks) {
        return this.cash + this.getPortfolioValue(stocks)
    }

    getProfit(stocks) {
        return this.getTotalValue(stocks) - this.initialCash
    }

    getProfitPercent(stocks) {
        return ((this.getTotalValue(stocks) - this.initialCash) / this.initialCash) * 100
    }

    getPortfolioDiversification(stocks) {
        const totalValue = this.getTotalValue(stocks)
        if (totalValue === 0) return []

        const diversification = []
        for (const [symbol, quantity] of this.portfolio) {
            const stock = stocks.find(s => s.symbol === symbol)
            if (stock) {
                const value = stock.price * quantity
                const percentage = (value / totalValue) * 100
                diversification.push({
                    symbol,
                    name: stock.name,
                    quantity,
                    value,
                    percentage
                })
            }
        }
        return diversification.sort((a, b) => b.percentage - a.percentage)
    }

    getRiskMetrics(stocks) {
        const diversification = this.getPortfolioDiversification(stocks)
        const totalValue = this.getTotalValue(stocks)

        let concentrationRisk = 0
        if (diversification.length > 0) {
            concentrationRisk = diversification[0].percentage
        }

        return {
            totalPositions: diversification.length,
            concentrationRisk,
            diversificationScore: diversification.length > 5 ? 'well_diversified' :
                                diversification.length > 2 ? 'moderately_diversified' : 'concentrated'
        }
    }

    getRecentTransactions(limit = 10) {
        return this.transactionHistory.slice(-limit).reverse()
    }
}

module.exports = Player