const { News, NewsGenerator } = require('../models/News')
const SoundService = require('./SoundService')

class NewsService {
    constructor() {
        this.news = []
        this.maxNewsItems = 50
    }

    generateNews(stocks) {
        const newsType = Math.random()

        if (newsType < 0.7) {
            const news = NewsGenerator.generateRandomNews(stocks)
            this.addNews(news)
            SoundService.playSound('news')
            return news
        } else {
            const news = NewsGenerator.generateMarketNews()
            this.addNews(news)
            SoundService.playSound('news')
            return news
        }
    }

    addNews(news) {
        this.news.unshift(news)
        if (this.news.length > this.maxNewsItems) {
            this.news = this.news.slice(0, this.maxNewsItems)
        }
    }

    addRealNews(realNewsData) {
        const news = new News(
            realNewsData.title,
            realNewsData.content,
            realNewsData.impact,
            realNewsData.affectedStocks
        )
        news.timestamp = realNewsData.timestamp
        news.source = realNewsData.source
        news.url = realNewsData.url
        news.isReal = true
        
        this.addNews(news)
        SoundService.playSound('news')
        return news
    }

    getLatestNews(limit = 10) {
        return this.news.slice(0, limit)
    }

    getUnreadNews() {
        return this.news.filter(item => !item.isRead)
    }

    markAllAsRead() {
        this.news.forEach(item => item.markAsRead())
    }

    getNewsForStock(symbol) {
        return this.news.filter(item => item.affectedStocks.includes(symbol))
    }

    applyNewsImpact(stocks) {
        this.news.forEach(newsItem => {
            if (!newsItem.isRead && newsItem.affectedStocks.length > 0) {
                newsItem.affectedStocks.forEach(symbol => {
                    const stock = stocks.find(s => s.symbol === symbol)
                    if (stock) {
                        const impact = newsItem.impact * (0.5 + Math.random() * 0.5)
                        stock.price *= (1 + impact)
                        stock.price = Math.max(0.01, stock.price)
                        stock.history.push(stock.price)
                        if (stock.history.length > 50) stock.history.shift()
                    }
                })
                newsItem.markAsRead()
            }
        })
    }

    getMarketSentiment() {
        const recentNews = this.news.slice(0, 20)
        if (recentNews.length === 0) return 'neutral'

        const totalImpact = recentNews.reduce((sum, news) => sum + news.impact, 0)
        const avgImpact = totalImpact / recentNews.length

        if (avgImpact > 0.02) return 'bullish'
        if (avgImpact < -0.02) return 'bearish'
        return 'neutral'
    }

    getNewsSummary() {
        const recent = this.getLatestNews(5)
        const unread = this.getUnreadNews().length

        return {
            total: this.news.length,
            unread,
            recent,
            sentiment: this.getMarketSentiment()
        }
    }
}

module.exports = NewsService