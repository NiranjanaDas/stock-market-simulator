const DisplayService = require('./display')
const ChartService = require('../services/ChartService')
const SoundService = require('../services/SoundService')
const fs = require('fs')
const path = require('path')
const colors = require('../utils/colors')

class CommandHandler {
    constructor(marketService, newsService, dataService, rl) {
        this.marketService = marketService
        this.newsService = newsService
        this.dataService = dataService
        this.rl = rl
    }

    async getInput(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, (answer) => {
                resolve(answer)
            })
        })
    }

    async handleBuyStock() {
        if (!this.marketService.currentPlayer) {
            SoundService.playSound('error')
            console.log(`${colors.red}Please add or select a player first${colors.reset}`)
            return
        }

        DisplayService.showStockPrices(this.marketService.stocks)

        const stockChoice = await this.getInput('Select stock (number or symbol): ')
        let stock

        if (isNaN(stockChoice)) {
            stock = this.marketService.getStockBySymbol(stockChoice.toUpperCase())
        } else {
            const index = parseInt(stockChoice) - 1
            stock = this.marketService.stocks[index]
        }

        if (!stock) {
            console.log(`${colors.red}Invalid stock selection${colors.reset}`)
            return
        }

        const quantity = parseInt(await this.getInput(`Enter quantity to buy (max: ${Math.floor(this.marketService.currentPlayer.cash / stock.price)}): `))

        if (isNaN(quantity) || quantity <= 0) {
            SoundService.playSound('error')
            console.log(`${colors.red}Invalid quantity${colors.reset}`)
            return
        }

        const cost = stock.price * quantity
        console.log(`${colors.yellow}Total cost: $${cost.toFixed(2)}${colors.reset}`)
        console.log(`${colors.yellow}Available cash: $${this.marketService.currentPlayer.cash.toFixed(2)}${colors.reset}`)

        const confirm = await this.getInput(`${colors.neonYellow}Confirm quantum purchase? (y/n): ${colors.reset}`)

        if (confirm.toLowerCase() === 'y') {
            if (this.marketService.currentPlayer.buyStock(stock, quantity)) {
                SoundService.playSound('trade')
                console.log(`${colors.neonGreen}${colors.bold}⚡ QUANTUM PURCHASE SUCCESSFUL! ⚡${colors.reset}`)
                console.log(`${colors.neonBlue}Acquired ${quantity} neural shares of ${stock.symbol}!${colors.reset}`)
            } else {
                SoundService.playSound('error')
                console.log(`${colors.hotPink}${colors.blink}❌ QUANTUM WALLET INSUFFICIENT! ❌${colors.reset}`)
            }
        } else {
            SoundService.playSound('menu')
        }
    }

    async handleSellStock() {
        if (!this.marketService.currentPlayer) {
            SoundService.playSound('error')
            console.log(`${colors.red}Please add or select a player first${colors.reset}`)
            return
        }

        if (this.marketService.currentPlayer.portfolio.size === 0) {
            console.log(`${colors.red}No stocks to sell${colors.reset}`)
            return
        }

        DisplayService.showPortfolio(this.marketService.currentPlayer, this.marketService.stocks)

        const stockChoice = await this.getInput('Select stock to sell (symbol): ')
        const symbol = stockChoice.toUpperCase()
        const quantity = this.marketService.currentPlayer.portfolio.get(symbol)

        if (!quantity) {
            console.log(`${colors.red}You don't own ${symbol}${colors.reset}`)
            return
        }

        const stock = this.marketService.getStockBySymbol(symbol)
        const sellQuantity = parseInt(await this.getInput(`Enter quantity to sell (max ${quantity}): `))

        if (isNaN(sellQuantity) || sellQuantity <= 0 || sellQuantity > quantity) {
            SoundService.playSound('error')
            console.log(`${colors.red}Invalid quantity${colors.reset}`)
            return
        }

        const revenue = stock.price * sellQuantity
        console.log(`${colors.yellow}Total revenue: $${revenue.toFixed(2)}${colors.reset}`)

        const confirm = await this.getInput(`${colors.neonYellow}Execute quantum liquidation? (y/n): ${colors.reset}`)

        if (confirm.toLowerCase() === 'y') {
            if (this.marketService.currentPlayer.sellStock(stock, sellQuantity)) {
                SoundService.playSound('trade')
                console.log(`${colors.neonGreen}${colors.bold}💎 QUANTUM LIQUIDATION COMPLETE! 💎${colors.reset}`)
                console.log(`${colors.neonPurple}Liquidated ${sellQuantity} neural shares of ${stock.symbol}!${colors.reset}`)
            } else {
                SoundService.playSound('error')
                console.log(`${colors.hotPink}${colors.blink}⚠️ LIQUIDATION PROTOCOL FAILED! ⚠️${colors.reset}`)
            }
        } else {
            SoundService.playSound('menu')
        }
    }

    async handleAddPlayer() {
        const name = await this.getInput(`${colors.neonBlue}Enter neural trader designation: ${colors.reset}`)
        if (name.trim()) {
            const player = this.marketService.addPlayer(name.trim())
            this.marketService.currentPlayer = player
            SoundService.playSound('success')
            console.log(`${colors.neonGreen}${colors.bold}🧠 NEURAL TRADER INITIALIZED! 🧠${colors.reset}`)
            console.log(`${colors.neonPurple}Trader ${name.toUpperCase()} linked with ¤10,000 quantum credits!${colors.reset}`)
        } else {
            SoundService.playSound('error')
            console.log(`${colors.hotPink}❌ INVALID NEURAL DESIGNATION${colors.reset}`)
        }
    }

    async handleSwitchPlayer() {
        if (this.marketService.players.length === 0) {
            console.log(`${colors.red}No players available. Add a player first.${colors.reset}`)
            return
        }

        console.log(`${colors.yellow}Available players:${colors.reset}`)
        this.marketService.players.forEach((player, index) => {
            console.log(`${index + 1}. ${player.name}`)
        })

        const choice = await this.getInput('Select player (number): ')
        const index = parseInt(choice) - 1

        if (index >= 0 && index < this.marketService.players.length) {
            this.marketService.currentPlayer = this.marketService.players[index]
            SoundService.playSound('success')
            console.log(`${colors.neonGreen}${colors.bold}⚡ NEURAL LINK ESTABLISHED! ⚡${colors.reset}`)
            console.log(`${colors.neonBlue}Connected to trader: ${this.marketService.currentPlayer.name.toUpperCase()}${colors.reset}`)
        } else {
            SoundService.playSound('error')
            console.log(`${colors.hotPink}${colors.blink}⚠️ NEURAL LINK FAILED - INVALID TRADER ID${colors.reset}`)
        }
    }

    async handleShowNews() {
        SoundService.playSound('notification')
        DisplayService.showNews(this.newsService.getLatestNews(10))
    }

    async handleRefreshNews() {
        console.log(`${colors.neonBlue}🔄 Refreshing quantum news feeds...${colors.reset}`)
        try {
            // Get reference to main app for real news service
            const realNewsService = global.stockApp?.realNewsService
            if (realNewsService) {
                const news = await realNewsService.refreshNews()
                news.forEach(newsItem => {
                    this.newsService.addRealNews(newsItem)
                })
                SoundService.playSound('success')
                console.log(`${colors.neonGreen}✅ Neural news feeds synchronized!${colors.reset}`)
                DisplayService.showNews(this.newsService.getLatestNews(5))
            } else {
                SoundService.playSound('error')
                console.log(`${colors.hotPink}❌ Quantum news service unavailable${colors.reset}`)
            }
        } catch (error) {
            SoundService.playSound('error')
            console.log(`${colors.hotPink}❌ News refresh failed: ${error.message}${colors.reset}`)
        }
    }

    async handleTechnicalAnalysis() {
        const symbol = await this.getInput('Enter stock symbol: ')
        const analysis = this.marketService.getTechnicalAnalysis(symbol.toUpperCase())
        DisplayService.showTechnicalAnalysis(analysis)
    }

    async handleShowChart() {
        const symbol = await this.getInput('Enter stock symbol: ')
        const stock = this.marketService.getStockBySymbol(symbol.toUpperCase())

        if (!stock) {
            SoundService.playSound('error')
            console.log(`${colors.red}Stock not found${colors.reset}`)
            return
        }

        console.log(ChartService.generatePriceChart(stock))
    }

    async handlePortfolioAnalysis() {
        if (!this.marketService.currentPlayer) {
            console.log(`${colors.red}Please select a player first${colors.reset}`)
            return
        }

        DisplayService.showPortfolioAnalytics(this.marketService.currentPlayer, this.marketService.stocks)
        console.log(ChartService.generatePortfolioChart(this.marketService.currentPlayer, this.marketService.stocks))
    }

    async handleMarketSummary() {
        const summary = this.marketService.getMarketSummary()
        DisplayService.showMarketSummary(summary)
    }

    async handleExportPortfolio() {
        if (!this.marketService.currentPlayer) {
            console.log(`${colors.red}Please select a player first${colors.reset}`)
            return
        }

        const format = await this.getInput('Export format (json/csv): ')
        const data = this.dataService.exportPortfolio(this.marketService.currentPlayer, this.marketService.stocks, format.toLowerCase())

        const filename = `portfolio_${this.marketService.currentPlayer.name}_${new Date().toISOString().split('T')[0]}.${format}`
        const filepath = path.join(__dirname, '../../exports', filename)

        try {
            require('fs').writeFileSync(filepath, data)
            SoundService.playSound('success')
            console.log(`${colors.green}Portfolio exported to ${filepath}${colors.reset}`)
        } catch (error) {
            SoundService.playSound('error')
            console.log(`${colors.red}Export failed: ${error.message}${colors.reset}`)
        }
    }

    async handleLeaderboard() {
        const leaderboard = this.marketService.getLeaderboard()
        DisplayService.showLeaderboard(leaderboard)
    }

    async handleToggleUpdates() {
        if (this.marketService.isRunning) {
            this.marketService.stopPriceUpdates()
            console.log(`${colors.yellow}Price updates stopped${colors.reset}`)
        } else {
            this.marketService.startPriceUpdates()
            console.log(`${colors.yellow}Price updates started${colors.reset}`)
        }
    }

    async handleQuit() {
        console.log(`${colors.yellow}Saving data and exiting...${colors.reset}`)
        this.dataService.saveMarketData(this.marketService.stocks)
        this.dataService.savePlayers(this.marketService.players)
        this.dataService.saveNews(this.newsService.news)
        this.rl.close()
        process.exit(0)
    }

    async processCommand(command) {
        this.marketService.stopPriceUpdates()

        switch (command.toLowerCase()) {
            case 'b':
            case 'buy':
                await this.handleBuyStock()
                break
            case 's':
            case 'sell':
                await this.handleSellStock()
                break
            case 'a':
            case 'add':
                await this.handleAddPlayer()
                break
            case 'w':
            case 'switch':
                await this.handleSwitchPlayer()
                break
            case 'n':
            case 'news':
                await this.handleShowNews()
                break
            case 't':
            case 'technical':
                await this.handleTechnicalAnalysis()
                break
            case 'c':
            case 'chart':
                await this.handleShowChart()
                break
            case 'p':
            case 'portfolio':
                await this.handlePortfolioAnalysis()
                break
            case 'm':
            case 'market':
                await this.handleMarketSummary()
                break
            case 'e':
            case 'export':
                await this.handleExportPortfolio()
                break
            case 'l':
            case 'leaderboard':
                await this.handleLeaderboard()
                break
            case 'r':
            case 'run':
                await this.handleToggleUpdates()
                break
            case 'f':
            case 'refresh':
                await this.handleRefreshNews()
                break
            case 'q':
            case 'quit':
                await this.handleQuit()
                return
            default:
                SoundService.playSound('error')
                console.log(`${colors.hotPink}${colors.blink}⚠️ UNKNOWN QUANTUM COMMAND${colors.reset}`)
                console.log(`${colors.neonBlue}Available neural commands: B,S,A,W,N,T,C,P,M,E,L,R,F,Q${colors.reset}`)
        }

        if (this.marketService.isRunning) {
            this.marketService.startPriceUpdates()
        }
    }
}

module.exports = CommandHandler
