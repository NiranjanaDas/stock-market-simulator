const path = require('path')
const { readJsonFile, writeJsonFile, ensureDirectoryExists } = require('../utils/helpers')

class DataService {
    constructor(dataDir = path.join(__dirname, '../../data')) {
        this.dataDir = dataDir
        this.marketDataFile = path.join(dataDir, 'market_data.json')
        this.playersFile = path.join(dataDir, 'players.json')
        this.newsFile = path.join(dataDir, 'news.json')
        this.sessionsFile = path.join(dataDir, 'sessions.json')

        ensureDirectoryExists(dataDir)
    }

    saveMarketData(stocks) {
        const data = {
            stocks: stocks.map(stock => ({
                symbol: stock.symbol,
                price: stock.price,
                previousPrice: stock.previousPrice,
                history: stock.history,
                volatility: stock.volatility
            })),
            lastUpdated: new Date()
        }
        writeJsonFile(this.marketDataFile, data)
    }

    loadMarketData() {
        const data = readJsonFile(this.marketDataFile)
        return data ? data.stocks || [] : []
    }

    savePlayers(players) {
        const data = {
            players: players.map(player => ({
                name: player.name,
                cash: player.cash,
                initialCash: player.initialCash,
                portfolio: Object.fromEntries(player.portfolio),
                transactionHistory: player.transactionHistory
            })),
            lastUpdated: new Date()
        }
        writeJsonFile(this.playersFile, data)
    }

    loadPlayers() {
        const data = readJsonFile(this.playersFile)
        return data ? data.players || [] : []
    }

    saveNews(news) {
        const data = {
            news: news.map(item => ({
                title: item.title,
                content: item.content,
                impact: item.impact,
                affectedStocks: item.affectedStocks,
                timestamp: item.timestamp,
                isRead: item.isRead
            })),
            lastUpdated: new Date()
        }
        writeJsonFile(this.newsFile, data)
    }

    loadNews() {
        const data = readJsonFile(this.newsFile)
        return data ? data.news || [] : []
    }

    saveSession(sessionName, sessionData) {
        const sessions = this.loadSessions()
        sessions[sessionName] = {
            ...sessionData,
            savedAt: new Date()
        }
        writeJsonFile(this.sessionsFile, sessions)
    }

    loadSession(sessionName) {
        const sessions = this.loadSessions()
        return sessions[sessionName] || null
    }

    loadSessions() {
        return readJsonFile(this.sessionsFile) || {}
    }

    deleteSession(sessionName) {
        const sessions = this.loadSessions()
        delete sessions[sessionName]
        writeJsonFile(this.sessionsFile, sessions)
    }

    exportPortfolio(player, stocks, format = 'json') {
        const portfolio = player.getPortfolioDiversification(stocks)
        const exportData = {
            playerName: player.name,
            exportDate: new Date(),
            cash: player.cash,
            portfolioValue: player.getPortfolioValue(stocks),
            totalValue: player.getTotalValue(stocks),
            profit: player.getProfit(stocks),
            profitPercent: player.getProfitPercent(stocks),
            holdings: portfolio,
            transactionHistory: player.getRecentTransactions(50)
        }

        if (format === 'csv') {
            return this.convertToCSV(exportData)
        }

        return JSON.stringify(exportData, null, 2)
    }

    convertToCSV(data) {
        let csv = 'Player,Export Date,Cash,Portfolio Value,Total Value,Profit,Profit %,Holdings\n'
        csv += `${data.playerName},${data.exportDate.toISOString()},${data.cash},${data.portfolioValue},${data.totalValue},${data.profit},${data.profitPercent},`

        const holdings = data.holdings.map(h => `${h.symbol}:${h.quantity}@$${h.value.toFixed(2)}`).join('; ')
        csv += `"${holdings}"\n`

        csv += '\nTransaction History\n'
        csv += 'Type,Symbol,Quantity,Price,Total,Timestamp\n'
        data.transactionHistory.forEach(tx => {
            csv += `${tx.type},${tx.symbol},${tx.quantity},${tx.price},${tx.total},${tx.timestamp.toISOString()}\n`
        })

        return csv
    }

    getBackupFilename() {
        const now = new Date()
        return `backup_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}.json`
    }

    createBackup() {
        const backupData = {
            marketData: readJsonFile(this.marketDataFile),
            players: readJsonFile(this.playersFile),
            news: readJsonFile(this.newsFile),
            sessions: readJsonFile(this.sessionsFile),
            backupDate: new Date()
        }

        const backupFile = path.join(this.dataDir, 'backups', this.getBackupFilename())
        writeJsonFile(backupFile, backupData)
        return backupFile
    }
}

module.exports = DataService