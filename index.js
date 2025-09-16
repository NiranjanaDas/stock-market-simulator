const MarketService = require('./src/services/MarketService')
const NewsService = require('./src/services/NewsService')
const RealNewsService = require('./src/services/RealNewsService')
const DataService = require('./src/services/DataService')
const CommandHandler = require('./src/cli/commands')
const DisplayService = require('./src/cli/display')
const colors = require('./src/utils/colors')

class StockMarketSimulator {
    constructor() {
        this.marketService = new MarketService()
        this.newsService = new NewsService()
        this.realNewsService = new RealNewsService()
        this.dataService = new DataService()
        this.commandHandler = null
        this.rl = null
        this.newsInterval = null
    }

    async initialize() {
        console.log(colors.clear)
        const SoundService = require('./src/services/SoundService')
        SoundService.playSound('startup')
        DisplayService.showLoadingAnimation('INITIALIZING QUANTUM TRADING MATRIX')
        
        await new Promise(resolve => setTimeout(resolve, 2500))

        const savedStocks = this.dataService.loadMarketData()
        if (savedStocks.length > 0) {
            savedStocks.forEach((stockData, index) => {
                if (this.marketService.stocks[index]) {
                    this.marketService.stocks[index].price = stockData.price
                    this.marketService.stocks[index].previousPrice = stockData.previousPrice
                    this.marketService.stocks[index].history = stockData.history || [stockData.price]
                }
            })
            console.log(`${colors.neonGreen}✅ QUANTUM MARKET DATA SYNCHRONIZED${colors.reset}`)
        }

        const savedPlayers = this.dataService.loadPlayers()
        if (savedPlayers.length > 0) {
            this.marketService.players = savedPlayers.map(playerData => {
                const Player = require('./src/models/Player')
                const player = new Player(playerData.name, playerData.initialCash)
                player.cash = playerData.cash
                player.portfolio = new Map(Object.entries(playerData.portfolio || {}))
                player.transactionHistory = playerData.transactionHistory || []
                return player
            })
            this.marketService.currentPlayer = this.marketService.players[0]
            console.log(`${colors.neonGreen}✅ NEURAL TRADER PROFILES LOADED${colors.reset}`)
        }

        const savedNews = this.dataService.loadNews()
        if (savedNews.length > 0) {
            this.newsService.news = savedNews.map(newsData => {
                const News = require('./src/models/News').News
                const news = new News(newsData.title, newsData.content, newsData.impact, newsData.affectedStocks)
                news.timestamp = new Date(newsData.timestamp)
                news.isRead = newsData.isRead
                return news
            })
            console.log(`${colors.neonGreen}✅ QUANTUM NEWS FEED ACTIVE${colors.reset}`)
        }

        console.log(`${colors.neonBlue}${colors.bold}🧠 NEURAL TRADING SYSTEM ONLINE! 🧠${colors.reset}\n`)
    }

    startNewsGeneration() {
        this.fetchRealNews()
        
        this.newsInterval = setInterval(() => {
            if (Math.random() < 0.3) {
                this.newsService.generateNews(this.marketService.stocks)
            }
        }, 10000)
        
        this.realNewsInterval = setInterval(() => {
            this.fetchRealNews()
        }, 15 * 60 * 1000)
    }

    async fetchRealNews() {
        try {
            const realNews = await this.realNewsService.getLatestNews(5)
            realNews.forEach(news => {
                this.newsService.addRealNews(news)
                this.applyNewsImpact(news)
            })
        } catch (error) {
            console.log(`${colors.neonOrange}⚠️ Real news fetch failed, using quantum backup${colors.reset}`)
        }
    }

    applyNewsImpact(news) {
        if (news.affectedStocks && news.affectedStocks.length > 0) {
            news.affectedStocks.forEach(symbol => {
                const stock = this.marketService.getStockBySymbol(symbol)
                if (stock) {
                    let impactMultiplier = 1
                    
                    switch (news.impact) {
                        case 'positive':
                            impactMultiplier = 1 + (Math.random() * 0.03)
                            break
                        case 'negative':
                            impactMultiplier = 1 - (Math.random() * 0.03)
                            break
                        default:
                            impactMultiplier = 1 + (Math.random() * 0.02 - 0.01)
                    }
                    
                    stock.price *= impactMultiplier
                    
                    if (Math.abs(impactMultiplier - 1) > 0.02) {
                        const SoundService = require('./src/services/SoundService')
                        SoundService.playSound('news')
                    }
                }
            })
        }
    }

    stopNewsGeneration() {
        if (this.newsInterval) {
            clearInterval(this.newsInterval)
            this.newsInterval = null
        }
        if (this.realNewsInterval) {
            clearInterval(this.realNewsInterval)
            this.realNewsInterval = null
        }
    }

    displayMainScreen() {
        DisplayService.clear()
        DisplayService.showHeader()
        DisplayService.showStockPrices(this.marketService.stocks)
        DisplayService.showPlayerInfo(this.marketService.currentPlayer, this.marketService.stocks)
        DisplayService.showPortfolio(this.marketService.currentPlayer, this.marketService.stocks)
        DisplayService.showLeaderboard(this.marketService.getLeaderboard())

        const newsSummary = this.newsService.getNewsSummary()
        if (newsSummary.unread > 0) {
            console.log(`${colors.red}📰 ${newsSummary.unread} unread news items${colors.reset}`)
        }

        if (this.marketService.isRunning) {
            console.log(`${colors.dim}⚡ Market is live! Prices updating every 3 seconds...${colors.reset}`)
        }

        DisplayService.showMainMenu(this.marketService.isRunning)
    }

    async run() {
        await this.initialize()

        this.rl = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        })

        this.commandHandler = new CommandHandler(this.marketService, this.newsService, this.dataService, this.rl)

        global.stockApp = {
            realNewsService: this.realNewsService,
            marketService: this.marketService,
            newsService: this.newsService
        }

        if (this.marketService.players.length === 0) {
            console.log(`${colors.neonYellow}🧠 Let's initialize your neural trader profile...${colors.reset}`)
            await this.commandHandler.handleAddPlayer()
        }

        this.startNewsGeneration()
        this.marketService.startPriceUpdates()

        this.displayMainScreen()

        process.on('SIGINT', () => {
            console.log(`\n${colors.yellow}Saving data and exiting...${colors.reset}`)
            this.dataService.saveMarketData(this.marketService.stocks)
            this.dataService.savePlayers(this.marketService.players)
            this.dataService.saveNews(this.newsService.news)
            this.stopNewsGeneration()
            this.rl.close()
            process.exit(0)
        })

        this.startInputLoop()
    }

    startInputLoop() {
        this.rl.question('> ', async (input) => {
            if (input.trim()) {
                await this.commandHandler.processCommand(input.trim())
                this.displayMainScreen()
            }
            this.startInputLoop()
        })
    }
}

const simulator = new StockMarketSimulator()
simulator.run().catch(console.error)
