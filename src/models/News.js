class News {
    constructor(title, content, impact, affectedStocks = []) {
        this.title = title
        this.content = content
        this.impact = impact
        this.affectedStocks = affectedStocks
        this.timestamp = new Date()
        this.isRead = false
        this.source = null
        this.url = null
        this.isReal = false
    }

    getImpactColor() {
        const colors = require('../utils/colors')
        if (this.impact > 0.1) return colors.green
        if (this.impact < -0.1) return colors.red
        return colors.yellow
    }

    getFormattedImpact() {
        const colors = require('../utils/colors')
        
        // Handle string-based impact (from real news)
        if (typeof this.impact === 'string') {
            switch (this.impact.toLowerCase()) {
                case 'positive':
                    return `${colors.neonGreen}BULLISH${colors.reset}`
                case 'negative':
                    return `${colors.hotPink}BEARISH${colors.reset}`
                default:
                    return `${colors.neonYellow}NEUTRAL${colors.reset}`
            }
        }
        
        // Handle numeric impact (legacy)
        const sign = this.impact >= 0 ? '+' : ''
        const color = this.impact > 0 ? colors.neonGreen : this.impact < 0 ? colors.hotPink : colors.neonYellow
        return `${color}${sign}${(this.impact * 100).toFixed(1)}%${colors.reset}`
    }

    markAsRead() {
        this.isRead = true
    }
}

class NewsGenerator {
    static generateRandomNews(stocks) {
        const newsTemplates = [
            {
                title: 'Quarterly Earnings Beat Expectations',
                content: 'Company reports better than expected quarterly earnings, boosting investor confidence.',
                impact: 0.05
            },
            {
                title: 'New Product Launch Success',
                content: 'The latest product launch has exceeded sales projections, driving market enthusiasm.',
                impact: 0.03
            },
            {
                title: 'Regulatory Concerns Emerge',
                content: 'Recent regulatory developments raise concerns about future operations.',
                impact: -0.04
            },
            {
                title: 'Market Volatility Increases',
                content: 'Global market conditions are causing increased volatility across sectors.',
                impact: -0.02
            },
            {
                title: 'Strategic Partnership Announced',
                content: 'New partnership deal opens up significant growth opportunities.',
                impact: 0.04
            },
            {
                title: 'Supply Chain Disruptions',
                content: 'Ongoing supply chain issues are impacting production and delivery timelines.',
                impact: -0.03
            },
            {
                title: 'Strong Consumer Demand',
                content: 'Consumer spending data shows robust demand for products and services.',
                impact: 0.02
            },
            {
                title: 'Economic Indicators Improve',
                content: 'Latest economic data suggests improving conditions for businesses.',
                impact: 0.03
            }
        ]

        const template = newsTemplates[Math.floor(Math.random() * newsTemplates.length)]
        const affectedStock = stocks[Math.floor(Math.random() * stocks.length)]

        return new News(
            `${affectedStock.name}: ${template.title}`,
            template.content,
            template.impact + (Math.random() - 0.5) * 0.02,
            [affectedStock.symbol]
        )
    }

    static generateMarketNews() {
        const marketNews = [
            {
                title: 'Federal Reserve Announces Policy Changes',
                content: 'The Federal Reserve has made significant announcements regarding monetary policy.',
                impact: 0.02
            },
            {
                title: 'Global Trade Tensions Ease',
                content: 'Recent diplomatic developments suggest easing of international trade tensions.',
                impact: 0.03
            },
            {
                title: 'Economic Data Surprises Markets',
                content: 'Latest economic indicators have surprised analysts with stronger than expected results.',
                impact: 0.025
            },
            {
                title: 'Geopolitical Events Impact Markets',
                content: 'Recent geopolitical developments are causing uncertainty in global markets.',
                impact: -0.02
            }
        ]

        const template = marketNews[Math.floor(Math.random() * marketNews.length)]
        return new News(
            `Market News: ${template.title}`,
            template.content,
            template.impact + (Math.random() - 0.5) * 0.01,
            []
        )
    }
}

module.exports = { News, NewsGenerator }
