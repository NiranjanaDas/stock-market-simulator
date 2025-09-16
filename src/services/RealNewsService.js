const axios = require('axios')
const colors = require('../utils/colors')

class RealNewsService {
    constructor() {
        this.newsCache = []
        this.lastFetch = null
        this.cacheExpiry = 15 * 60 * 1000 // 15 minutes
        
        // Multiple free APIs for redundancy
        this.newsAPIs = [
            {
                name: 'NewsAPI',
                url: 'https://newsapi.org/v2/everything',
                headers: {},
                params: {
                    q: 'stock market OR finance OR trading OR economy OR earnings',
                    language: 'en',
                    sortBy: 'publishedAt',
                    pageSize: 20,
                    apiKey: 'demo' // Free tier demo key
                }
            },
            {
                name: 'GNews',
                url: 'https://gnews.io/api/v4/search',
                headers: {},
                params: {
                    q: 'stock market finance trading',
                    lang: 'en',
                    country: 'us',
                    max: 20,
                    token: 'demo' // Demo token
                }
            },
            {
                name: 'MediaStack',
                url: 'http://api.mediastack.com/v1/news',
                headers: {},
                params: {
                    keywords: 'stock,market,finance,trading,economy',
                    languages: 'en',
                    countries: 'us',
                    limit: 20,
                    access_key: 'demo'
                }
            }
        ]
        
        // Fallback RSS feeds (free)
        this.rssFeeds = [
            'https://feeds.finance.yahoo.com/rss/2.0/headline',
            'https://feeds.bloomberg.com/markets/news.rss',
            'https://www.cnbc.com/id/100003114/device/rss/rss.html'
        ]
    }

    async fetchRealNews() {
        try {
            console.log(`${colors.neonBlue}🔄 Fetching quantum news data...${colors.reset}`)
            
            // Try each API in order
            for (const api of this.newsAPIs) {
                try {
                    const response = await this.tryAPI(api)
                    if (response && response.length > 0) {
                        this.newsCache = response
                        this.lastFetch = Date.now()
                        console.log(`${colors.neonGreen}✅ Neural news feed synchronized via ${api.name}${colors.reset}`)
                        return response
                    }
                } catch (error) {
                    console.log(`${colors.neonOrange}⚠️ ${api.name} unavailable, trying backup...${colors.reset}`)
                    continue
                }
            }
            
            // Fallback to mock news if all APIs fail
            console.log(`${colors.neonPurple}🔄 Activating quantum news generator...${colors.reset}`)
            return this.generateQuantumNews()
            
        } catch (error) {
            console.log(`${colors.hotPink}❌ Neural news feed error: ${error.message}${colors.reset}`)
            return this.generateQuantumNews()
        }
    }

    async tryAPI(api) {
        const response = await axios.get(api.url, {
            params: api.params,
            headers: api.headers,
            timeout: 5000
        })

        if (api.name === 'NewsAPI') {
            return this.parseNewsAPI(response.data)
        } else if (api.name === 'GNews') {
            return this.parseGNews(response.data)
        } else if (api.name === 'MediaStack') {
            return this.parseMediaStack(response.data)
        }
        
        return []
    }

    parseNewsAPI(data) {
        if (!data.articles) return []
        
        return data.articles.slice(0, 10).map(article => ({
            title: this.quantumizeTitle(article.title),
            content: this.quantumizeContent(article.description || article.content),
            timestamp: new Date(article.publishedAt),
            source: article.source.name,
            url: article.url,
            impact: this.calculateImpact(article.title, article.description),
            affectedStocks: this.extractStockSymbols(article.title + ' ' + (article.description || ''))
        }))
    }

    parseGNews(data) {
        if (!data.articles) return []
        
        return data.articles.slice(0, 10).map(article => ({
            title: this.quantumizeTitle(article.title),
            content: this.quantumizeContent(article.description),
            timestamp: new Date(article.publishedAt),
            source: article.source.name,
            url: article.url,
            impact: this.calculateImpact(article.title, article.description),
            affectedStocks: this.extractStockSymbols(article.title + ' ' + article.description)
        }))
    }

    parseMediaStack(data) {
        if (!data.data) return []
        
        return data.data.slice(0, 10).map(article => ({
            title: this.quantumizeTitle(article.title),
            content: this.quantumizeContent(article.description),
            timestamp: new Date(article.published_at),
            source: article.source,
            url: article.url,
            impact: this.calculateImpact(article.title, article.description),
            affectedStocks: this.extractStockSymbols(article.title + ' ' + (article.description || ''))
        }))
    }

    quantumizeTitle(title) {
        const prefixes = [
            '🧠 NEURAL ANALYSIS:',
            '⚡ QUANTUM ALERT:',
            '🔮 MARKET ORACLE:',
            '💎 TRADING INTEL:',
            '🚀 MARKET PULSE:',
            '⚡ NEURAL NETWORK:',
            '🧬 QUANTUM DATA:'
        ]
        
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
        return `${prefix} ${title}`
    }

    quantumizeContent(content) {
        if (!content) return 'Neural networks are analyzing quantum market fluctuations...'
        
        const quantumTerms = [
            'quantum analysis reveals',
            'neural networks predict',
            'holographic projections suggest',
            'AI algorithms indicate',
            'quantum computing shows',
            'neural pathways indicate'
        ]
        
        const term = quantumTerms[Math.floor(Math.random() * quantumTerms.length)]
        return `Advanced ${term} that ${content.toLowerCase()}`
    }

    calculateImpact(title, description) {
        const text = (title + ' ' + (description || '')).toLowerCase()
        
        const positiveWords = ['rise', 'gain', 'up', 'surge', 'bull', 'profit', 'growth', 'positive', 'strong', 'beat', 'exceed']
        const negativeWords = ['fall', 'drop', 'down', 'crash', 'bear', 'loss', 'decline', 'negative', 'weak', 'miss', 'below']
        
        let positiveScore = 0
        let negativeScore = 0
        
        positiveWords.forEach(word => {
            if (text.includes(word)) positiveScore++
        })
        
        negativeWords.forEach(word => {
            if (text.includes(word)) negativeScore++
        })
        
        if (positiveScore > negativeScore) return 'positive'
        if (negativeScore > positiveScore) return 'negative'
        return 'neutral'
    }

    extractStockSymbols(text) {
        const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX', 'AMD', 'SPOT', 'UBER', 'LYFT', 'ZOOM', 'SHOP', 'SQ']
        const mentionedSymbols = []
        
        symbols.forEach(symbol => {
            if (text.toUpperCase().includes(symbol) || text.toUpperCase().includes(symbol.replace(/[A-Z]/g, match => match.toLowerCase()))) {
                mentionedSymbols.push(symbol)
            }
        })
        
        // If no specific stocks mentioned, randomly affect 1-3 stocks
        if (mentionedSymbols.length === 0) {
            const randomCount = Math.floor(Math.random() * 3) + 1
            for (let i = 0; i < randomCount; i++) {
                const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)]
                if (!mentionedSymbols.includes(randomSymbol)) {
                    mentionedSymbols.push(randomSymbol)
                }
            }
        }
        
        return mentionedSymbols
    }

    generateQuantumNews() {
        const quantumNews = [
            {
                title: '🧠 NEURAL ANALYSIS: AI-Powered Trading Algorithms Show 300% Efficiency Increase',
                content: 'Advanced quantum computing analysis reveals that neural network trading systems are revolutionizing market predictions with unprecedented accuracy.',
                timestamp: new Date(),
                source: 'Quantum Finance Network',
                impact: 'positive',
                affectedStocks: ['GOOGL', 'MSFT', 'NVDA']
            },
            {
                title: '⚡ QUANTUM ALERT: Holographic Data Centers Drive Tech Stock Surge',
                content: 'Neural pathways indicate that breakthrough holographic storage technology is creating massive opportunities in the tech sector.',
                timestamp: new Date(Date.now() - 300000),
                source: 'Neural Market Oracle',
                impact: 'positive',
                affectedStocks: ['AAPL', 'NVDA', 'AMD']
            },
            {
                title: '🔮 MARKET ORACLE: Quantum Encryption Boosts Cybersecurity Investments',
                content: 'AI algorithms indicate that quantum encryption breakthroughs are driving unprecedented investment in cybersecurity infrastructure.',
                timestamp: new Date(Date.now() - 600000),
                source: 'Holographic Trading Post',
                impact: 'positive',
                affectedStocks: ['MSFT', 'GOOGL']
            },
            {
                title: '💎 TRADING INTEL: Neural Networks Predict Major Market Shift',
                content: 'Quantum analysis reveals that advanced AI systems are forecasting significant changes in trading patterns over the next quantum cycle.',
                timestamp: new Date(Date.now() - 900000),
                source: 'Quantum Analytics Hub',
                impact: 'neutral',
                affectedStocks: ['TSLA', 'META', 'AMZN']
            },
            {
                title: '🚀 MARKET PULSE: Space-Based Trading Platforms Launch Successfully',
                content: 'Neural networks predict that zero-gravity trading environments will revolutionize high-frequency trading capabilities.',
                timestamp: new Date(Date.now() - 1200000),
                source: 'Galactic Finance Network',
                impact: 'positive',
                affectedStocks: ['TSLA', 'AMZN', 'SPOT']
            },
            {
                title: '⚠️ QUANTUM WARNING: Market Volatility Detected in Crypto Sector',
                content: 'Advanced algorithms have identified unusual quantum fluctuations indicating potential market corrections in digital assets.',
                timestamp: new Date(Date.now() - 1500000),
                source: 'Crypto Quantum Labs',
                impact: 'negative',
                affectedStocks: ['SQ', 'SHOP', 'META']
            },
            {
                title: '🌟 BREAKTHROUGH: Neural Chip Technology Revolutionizes Computing',
                content: 'Quantum research reveals that bio-neural processors are achieving 1000x performance improvements over traditional silicon.',
                timestamp: new Date(Date.now() - 1800000),
                source: 'Neural Tech Today',
                impact: 'positive',
                affectedStocks: ['NVDA', 'AMD', 'AAPL']
            },
            {
                title: '📈 MARKET SURGE: Autonomous Vehicle Sales Exceed Projections',
                content: 'Neural network analysis shows that self-driving car adoption rates are 400% higher than traditional forecasts predicted.',
                timestamp: new Date(Date.now() - 2100000),
                source: 'Autonomous Futures',
                impact: 'positive',
                affectedStocks: ['TSLA', 'GOOGL', 'UBER']
            },
            {
                title: '🔥 QUANTUM FLASH: Streaming Wars Enter New Phase with VR Integration',
                content: 'Holographic entertainment platforms are disrupting traditional streaming services with immersive neural interfaces.',
                timestamp: new Date(Date.now() - 2400000),
                source: 'Entertainment Matrix',
                impact: 'neutral',
                affectedStocks: ['NFLX', 'META', 'SPOT']
            },
            {
                title: '⚡ NEURAL ALERT: Cloud Computing Costs Drop 90% with Quantum Efficiency',
                content: 'Quantum computing breakthroughs are making cloud services dramatically more cost-effective for enterprise clients.',
                timestamp: new Date(Date.now() - 2700000),
                source: 'Cloud Quantum Report',
                impact: 'positive',
                affectedStocks: ['AMZN', 'MSFT', 'GOOGL']
            }
        ]
        
        // Return 2-4 random news items
        const shuffled = quantumNews.sort(() => 0.5 - Math.random())
        return shuffled.slice(0, Math.floor(Math.random() * 3) + 2)
    }

    async getLatestNews(limit = 10) {
        // Check if cache is still valid
        if (this.newsCache.length > 0 && this.lastFetch && (Date.now() - this.lastFetch) < this.cacheExpiry) {
            return this.newsCache.slice(0, limit)
        }
        
        // Fetch new news
        const news = await this.fetchRealNews()
        return news.slice(0, limit)
    }

    async refreshNews() {
        this.newsCache = []
        this.lastFetch = null
        return await this.getLatestNews()
    }
}

module.exports = RealNewsService