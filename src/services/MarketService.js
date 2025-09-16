const Stock = require('../models/Stock')
const Player = require('../models/Player')
const TechnicalIndicators = require('../utils/indicators')
const { clearScreen, formatCurrency, formatPercentage, padString, truncateString } = require('../utils/helpers')
const colors = require('../utils/colors')

class MarketService {
    constructor() {
        this.stocks = []
        this.players = []
        this.currentPlayer = null
        this.isRunning = false
        this.updateInterval = null
        this.initializeStocks()
    }

    initializeStocks() {
        const stockData = [
            ['AAPL', 'Apple Inc.', 150.00, 0.02],
            ['GOOGL', 'Alphabet Inc.', 2800.00, 0.025],
            ['MSFT', 'Microsoft Corp.', 300.00, 0.018],
            ['TSLA', 'Tesla Inc.', 800.00, 0.04],
            ['AMZN', 'Amazon.com Inc.', 3200.00, 0.03],
            ['NVDA', 'NVIDIA Corp.', 400.00, 0.035],
            ['META', 'Meta Platforms', 320.00, 0.03],
            ['NFLX', 'Netflix Inc.', 450.00, 0.025],
            ['AMD', 'Advanced Micro Devices', 120.00, 0.035],
            ['SPOT', 'Spotify Technology', 250.00, 0.03],
            ['UBER', 'Uber Technologies', 45.00, 0.04],
            ['LYFT', 'Lyft Inc.', 12.00, 0.05],
            ['ZOOM', 'Zoom Video Communications', 75.00, 0.03],
            ['SHOP', 'Shopify Inc.', 85.00, 0.04],
            ['SQ', 'Block Inc.', 65.00, 0.035]
        ]

        this.stocks = stockData.map(([symbol, name, price, volatility]) =>
            new Stock(symbol, name, price, volatility)
        )
    }

    updatePrices() {
        this.stocks.forEach(stock => stock.updatePrice())
    }

    getStockBySymbol(symbol) {
        return this.stocks.find(stock => stock.symbol === symbol)
    }

    getTopGainers(limit = 5) {
        return [...this.stocks]
            .sort((a, b) => b.getPriceChangePercent() - a.getPriceChangePercent())
            .slice(0, limit)
    }

    getTopLosers(limit = 5) {
        return [...this.stocks]
            .sort((a, b) => a.getPriceChangePercent() - b.getPriceChangePercent())
            .slice(0, limit)
    }

    getMostVolatile(limit = 5) {
        return [...this.stocks]
            .sort((a, b) => b.volatility - a.volatility)
            .slice(0, limit)
    }

    getMarketSummary() {
        const totalMarketCap = this.stocks.reduce((sum, stock) => sum + stock.price, 0)
        const avgChange = this.stocks.reduce((sum, stock) => sum + stock.getPriceChangePercent(), 0) / this.stocks.length

        const gainers = this.getTopGainers(3)
        const losers = this.getTopLosers(3)

        return {
            totalStocks: this.stocks.length,
            totalMarketCap,
            avgChange,
            topGainer: gainers[0],
            topLoser: losers[0],
            marketTrend: avgChange > 0.5 ? 'bullish' : avgChange < -0.5 ? 'bearish' : 'sideways'
        }
    }

    getTechnicalAnalysis(symbol) {
        const stock = this.getStockBySymbol(symbol)
        if (!stock) return null

        return {
            symbol: stock.symbol,
            sma20: TechnicalIndicators.getSMA(stock, 20),
            rsi: TechnicalIndicators.getRSI(stock),
            trend: TechnicalIndicators.getPriceTrend(stock),
            volatility: TechnicalIndicators.getVolatility(stock),
            supportResistance: TechnicalIndicators.getSupportResistance(stock)
        }
    }

    addPlayer(name) {
        const player = new Player(name)
        this.players.push(player)
        return player
    }

    switchPlayer(name) {
        const player = this.players.find(p => p.name === name)
        if (player) {
            this.currentPlayer = player
            return true
        }
        return false
    }

    getLeaderboard() {
        return [...this.players]
            .sort((a, b) => b.getTotalValue(this.stocks) - a.getTotalValue(this.stocks))
            .map((player, index) => ({
                rank: index + 1,
                player,
                totalValue: player.getTotalValue(this.stocks),
                profit: player.getProfit(this.stocks),
                profitPercent: player.getProfitPercent(this.stocks)
            }))
    }

    startPriceUpdates(interval = 3000) {
        if (this.updateInterval) return

        this.isRunning = true
        this.updateInterval = setInterval(() => {
            this.updatePrices()
        }, interval)
    }

    stopPriceUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval)
            this.updateInterval = null
        }
        this.isRunning = false
    }

    getMarketStatus() {
        return {
            isRunning: this.isRunning,
            totalStocks: this.stocks.length,
            totalPlayers: this.players.length,
            currentPlayer: this.currentPlayer?.name,
            lastUpdate: new Date()
        }
    }
}

module.exports = MarketService