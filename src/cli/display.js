const colors = require('../utils/colors')
const ascii = require('../utils/ascii')
const { clearScreen, formatCurrency, formatPercentage, padString, truncateString } = require('../utils/helpers')

class DisplayService {
    static showHeader(title = 'QUANTUM STOCK MARKET 2035') {
        console.log(colors.clear)
        console.log(ascii.logo)
        console.log(ascii.tradingFloor)
        console.log(ascii.neuralNetwork)
        console.log(`${colors.neonBlue}${ascii.statusIndicator('online')}  ${colors.neonGreen}Neural Trading Engine Active${colors.reset}`)
        console.log(ascii.separator)
    }

    static showLoadingAnimation(text = 'INITIALIZING QUANTUM SYSTEMS') {
        console.log(`\n${colors.neonBlue}${text}${colors.reset}`)
        for (let i = 0; i <= 100; i += 10) {
            setTimeout(() => {
                process.stdout.write(`\r${ascii.loadingBar(i)}`)
                if (i === 100) {
                    console.log(`\n${colors.neonGreen}${ascii.statusIndicator('success')} SYSTEMS ONLINE${colors.reset}\n`)
                }
            }, i * 20)
        }
    }

    static showStockPrices(stocks) {
        console.log(ascii.holoBorder)
        console.log(`${colors.neonYellow}${colors.bold}  ⚡ LIVE MARKET DATA - NEURAL ANALYTICS ENABLED ⚡${colors.reset}`)
        console.log(ascii.holoBorderEnd)
        console.log(`${colors.neonBlue}╔═════════╦═════════════════════════╦══════════╦═════════════════╦═════════╗${colors.reset}`)
        console.log(`${colors.neonBlue}║${colors.neonGreen} Symbol  ${colors.neonBlue}║${colors.neonGreen} Company Name            ${colors.neonBlue}║${colors.neonGreen} Price    ${colors.neonBlue}║${colors.neonGreen} Change          ${colors.neonBlue}║${colors.neonGreen} Status  ${colors.neonBlue}║${colors.reset}`)
        console.log(`${colors.neonBlue}╠═════════╬═════════════════════════╬══════════╬═════════════════╬═════════╣${colors.reset}`)

        stocks.forEach(stock => {
            const change = stock.getPriceChange()
            const arrow = ascii.priceArrow(change)
            const changeStr = stock.getFormattedChange()
            const cryptoSymbol = ascii.cryptoSymbols[Math.floor(Math.random() * ascii.cryptoSymbols.length)]

            console.log(`${colors.neonBlue}║${colors.reset} ${colors.neonGreen}${stock.symbol}${colors.reset}${cryptoSymbol.padEnd(8 - stock.symbol.length)} ${colors.neonBlue}║${colors.reset} ${colors.white}${truncateString(stock.name, 23).padEnd(23)}${colors.reset} ${colors.neonBlue}║${colors.reset} ${colors.neonYellow}${stock.getFormattedPrice().padStart(8)}${colors.reset} ${colors.neonBlue}║${colors.reset} ${changeStr.padEnd(15)} ${colors.neonBlue}║${colors.reset} ${arrow} ${ascii.statusIndicator('trading').padEnd(6)} ${colors.neonBlue}║${colors.reset}`)
        })

        console.log(`${colors.neonBlue}╚═════════╩═════════════════════════╩══════════╩═════════════════╩═════════╝${colors.reset}`)
        console.log(`${colors.matrix}${ascii.matrixRain}${colors.reset}\n`)
    }

    static showPlayerInfo(player, stocks) {
        if (!player) return

        const totalValue = player.getTotalValue(stocks)
        const profit = player.getProfit(stocks)
        const profitPercent = player.getProfitPercent(stocks)
        const profitColor = profit >= 0 ? colors.neonGreen : colors.hotPink

        console.log(ascii.futuristicBorder(`NEURAL TRADER PROFILE: ${player.name.toUpperCase()}`))
        console.log(`${colors.neonBlue}╔═══════════════════════════════════════════════════════════════════════╗${colors.reset}`)
        console.log(`${colors.neonBlue}║${colors.reset} ${colors.neonYellow}� QUANTUM WALLET:${colors.reset} ${colors.neonGreen}${formatCurrency(player.cash).padStart(15)}${colors.reset}                           ${colors.neonBlue}║${colors.reset}`)
        console.log(`${colors.neonBlue}║${colors.reset} ${colors.neonYellow}🧠 PORTFOLIO VALUE:${colors.reset} ${colors.neonPurple}${formatCurrency(player.getPortfolioValue(stocks)).padStart(12)}${colors.reset}                        ${colors.neonBlue}║${colors.reset}`)
        console.log(`${colors.neonBlue}║${colors.reset} ${colors.neonYellow}⚡ TOTAL ASSETS:${colors.reset} ${colors.electricBlue}${formatCurrency(totalValue).padStart(15)}${colors.reset}                           ${colors.neonBlue}║${colors.reset}`)
        console.log(`${colors.neonBlue}║${colors.reset} ${colors.neonYellow}� NEURAL PROFIT:${colors.reset} ${profitColor}${(profit >= 0 ? '+' : '')}${formatCurrency(profit)} (${formatPercentage(profitPercent)})${colors.reset}${''.padStart(20 - formatCurrency(profit).length)} ${colors.neonBlue}║${colors.reset}`)
        console.log(`${colors.neonBlue}╚═══════════════════════════════════════════════════════════════════════╝${colors.reset}`)
        console.log(`${colors.hologram}${ascii.statusIndicator('online')} QUANTUM TRADING INTERFACE ACTIVE${colors.reset}\n`)
    }

    static showPortfolio(player, stocks) {
        if (!player || player.portfolio.size === 0) {
            console.log(`${colors.dim}📝 Portfolio is empty${colors.reset}\n`)
            return
        }

        console.log(`${colors.cyan}${colors.bright}📝 YOUR PORTFOLIO${colors.reset}`)
        console.log(`${colors.blue}┌─────────┬──────────┬──────────┬─────────────┬─────────────┐${colors.reset}`)
        console.log(`${colors.blue}│ Symbol  │ Quantity │ Price    │ Value       │ P&L         │${colors.reset}`)
        console.log(`${colors.blue}├─────────┼──────────┼──────────┼─────────────┼─────────────┤${colors.reset}`)

        for (const [symbol, quantity] of player.portfolio) {
            const stock = stocks.find(s => s.symbol === symbol)
            if (stock) {
                const value = stock.price * quantity
                const plChange = stock.getFormattedChange()
                console.log(`${colors.blue}│${colors.reset} ${symbol.padEnd(7)} ${colors.blue}│${colors.reset} ${quantity.toString().padStart(8)} ${colors.blue}│${colors.reset} ${stock.getFormattedPrice().padStart(8)} ${colors.blue}│${colors.reset} ${formatCurrency(value).padStart(10)} ${colors.blue}│${colors.reset} ${plChange.padEnd(11)} ${colors.blue}│${colors.reset}`)
            }
        }

        console.log(`${colors.blue}└─────────┴──────────┴──────────┴─────────────┴─────────────┘${colors.reset}\n`)
    }

    static showLeaderboard(leaderboard) {
        if (leaderboard.length === 0) return

        console.log(`${colors.yellow}${colors.bright}🏆 LEADERBOARD${colors.reset}`)
        console.log(`${colors.blue}┌──────┬─────────────────┬─────────────┬─────────────┬─────────────┐${colors.reset}`)
        console.log(`${colors.blue}│ Rank │ Player          │ Total Value │ Profit/Loss │ Return %    │${colors.reset}`)
        console.log(`${colors.blue}├──────┼─────────────────┼─────────────┼─────────────┼─────────────┤${colors.reset}`)

        leaderboard.forEach(entry => {
            const profitColor = entry.profit >= 0 ? colors.green : colors.red
            const rank = entry.rank.toString()
            const medal = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : ' '

            console.log(`${colors.blue}│${colors.reset} ${medal}${rank.padStart(3)} ${colors.blue}│${colors.reset} ${entry.player.name.padEnd(15).substring(0, 15)} ${colors.blue}│${colors.reset} ${formatCurrency(entry.totalValue).padStart(10)} ${colors.blue}│${colors.reset} ${profitColor}${entry.profit >= 0 ? '+' : ''}${formatCurrency(entry.profit).padStart(9)}${colors.reset} ${colors.blue}│${colors.reset} ${profitColor}${formatPercentage(entry.profitPercent).padStart(9)}${colors.reset} ${colors.blue}│${colors.reset}`)
        })

        console.log(`${colors.blue}└──────┴─────────────────┴─────────────┴─────────────┴─────────────┘${colors.reset}\n`)
    }

    static showNews(news, limit = 5) {
        if (news.length === 0) {
            console.log(`${colors.dim}📰 No quantum news feeds available${colors.reset}\n`)
            return
        }

        console.log(`${colors.neonPurple}${colors.bold}� QUANTUM NEWS FEED - NEURAL NETWORK ANALYSIS${colors.reset}`)
        console.log(`${colors.neonBlue}╔═══════════════════════════════════════════════════════════════════════╗${colors.reset}`)
        console.log(`${colors.neonBlue}║${colors.neonGreen}                    🧠 LIVE MARKET INTELLIGENCE 🧠                    ${colors.neonBlue}║${colors.reset}`)
        console.log(`${colors.neonBlue}╚═══════════════════════════════════════════════════════════════════════╝${colors.reset}`)

        news.slice(0, limit).forEach((item, index) => {
            const status = item.isRead ? `${colors.neonGreen}✓${colors.reset}` : `${colors.neonYellow}●${colors.reset}`
            const newsType = item.isReal ? `${colors.hotPink}[LIVE]${colors.reset}` : `${colors.neonBlue}[SIM]${colors.reset}`
            const impactColor = item.impact === 'positive' ? colors.neonGreen : 
                               item.impact === 'negative' ? colors.hotPink : colors.neonYellow
            
            // News item header with quantum styling
            console.log(`${colors.neonBlue}╔═══════════════════════════════════════════════════════════════════════╗${colors.reset}`)
            console.log(`${colors.neonBlue}║${colors.reset} ${newsType} ${status} ${colors.neonGreen}${index + 1}.${colors.reset} ${item.title.substring(0, 60)}${colors.neonBlue}║${colors.reset}`)
            
            // Content with quantum effects
            const content = item.content.substring(0, 67)
            console.log(`${colors.neonBlue}║${colors.reset} ${colors.white}${content.padEnd(69)}${colors.neonBlue}║${colors.reset}`)
            
            // Impact and metadata
            const impactText = `Impact: ${impactColor}${item.getFormattedImpact()}${colors.reset}`
            const timeText = `${colors.gray}${item.timestamp.toLocaleTimeString()}${colors.reset}`
            const sourceText = item.source ? `${colors.neonPurple}${item.source}${colors.reset}` : `${colors.neonBlue}Quantum Gen${colors.reset}`
            
            console.log(`${colors.neonBlue}║${colors.reset} ${impactText} | ${timeText} | ${sourceText}${''.padEnd(20)}${colors.neonBlue}║${colors.reset}`)
            
            // Affected stocks
            if (item.affectedStocks && item.affectedStocks.length > 0) {
                const stocksText = `Affects: ${colors.neonYellow}${item.affectedStocks.join(', ')}${colors.reset}`
                console.log(`${colors.neonBlue}║${colors.reset} ${stocksText}${''.padEnd(65 - item.affectedStocks.join(', ').length)}${colors.neonBlue}║${colors.reset}`)
            }
            
            console.log(`${colors.neonBlue}╚═══════════════════════════════════════════════════════════════════════╝${colors.reset}`)
            console.log(`${colors.matrix}${ascii.matrixRain}${colors.reset}`)
        })
        
        console.log(`\n${colors.hologram}📡 NEURAL NEWS FEED ACTIVE - QUANTUM ANALYSIS IN PROGRESS${colors.reset}\n`)
    }

    static showMarketSummary(summary) {
        console.log(`${colors.green}${colors.bright}📊 MARKET SUMMARY${colors.reset}`)
        console.log(`${colors.white}Total Stocks: ${colors.cyan}${summary.totalStocks}${colors.reset}`)
        console.log(`${colors.white}Market Cap: ${colors.yellow}${formatCurrency(summary.totalMarketCap)}${colors.reset}`)
        console.log(`${colors.white}Avg Change: ${summary.avgChange >= 0 ? colors.green : colors.red}${formatPercentage(summary.avgChange)}${colors.reset}`)
        console.log(`${colors.white}Market Trend: ${this.getTrendColor(summary.marketTrend)}${summary.marketTrend}${colors.reset}`)

        if (summary.topGainer) {
            console.log(`${colors.white}Top Gainer: ${colors.green}${summary.topGainer.symbol} ${formatPercentage(summary.topGainer.getPriceChangePercent())}${colors.reset}`)
        }

        if (summary.topLoser) {
            console.log(`${colors.white}Top Loser: ${colors.red}${summary.topLoser.symbol} ${formatPercentage(summary.topLoser.getPriceChangePercent())}${colors.reset}`)
        }

        console.log('')
    }

    static showTechnicalAnalysis(analysis) {
        if (!analysis) {
            console.log(`${colors.red}Stock not found${colors.reset}\n`)
            return
        }

        console.log(`${colors.blue}${colors.bright}📈 TECHNICAL ANALYSIS: ${analysis.symbol}${colors.reset}`)
        console.log(`${colors.white}SMA (20): ${colors.cyan}${analysis.sma20 ? formatCurrency(analysis.sma20) : 'N/A'}${colors.reset}`)
        console.log(`${colors.white}RSI: ${this.getRSIColor(analysis.rsi)}${analysis.rsi ? analysis.rsi.toFixed(2) : 'N/A'}${colors.reset}`)
        console.log(`${colors.white}Trend: ${this.getTrendColor(analysis.trend)}${analysis.trend}${colors.reset}`)
        console.log(`${colors.white}Volatility: ${colors.yellow}${(analysis.volatility || 0).toFixed(2)}%${colors.reset}`)

        if (analysis.supportResistance) {
            console.log(`${colors.white}Support: ${colors.green}${formatCurrency(analysis.supportResistance.support)}${colors.reset}`)
            console.log(`${colors.white}Resistance: ${colors.red}${formatCurrency(analysis.supportResistance.resistance)}${colors.reset}`)
        }

        console.log('')
    }

    static showPortfolioAnalytics(player, stocks) {
        const diversification = player.getPortfolioDiversification(stocks)
        const riskMetrics = player.getRiskMetrics(stocks)

        console.log(`${colors.neonPurple}${colors.bold}🧠 NEURAL PORTFOLIO ANALYTICS${colors.reset}`)
        console.log(`${colors.neonBlue}╔═══════════════════════════════════════════════════════════════════════╗${colors.reset}`)
        console.log(`${colors.neonBlue}║${colors.reset} ${colors.neonYellow}⚡ AI Risk Score:${colors.reset} ${this.getDiversificationColor(riskMetrics.diversificationScore)}${riskMetrics.diversificationScore.replace('_', ' ')}${colors.reset}                          ${colors.neonBlue}║${colors.reset}`)
        console.log(`${colors.neonBlue}║${colors.reset} ${colors.neonYellow}🎯 Active Positions:${colors.reset} ${colors.neonGreen}${riskMetrics.totalPositions}${colors.reset}                                     ${colors.neonBlue}║${colors.reset}`)
        console.log(`${colors.neonBlue}║${colors.reset} ${colors.neonYellow}⚠️ Concentration Risk:${colors.reset} ${riskMetrics.concentrationRisk > 50 ? colors.hotPink : riskMetrics.concentrationRisk > 25 ? colors.neonOrange : colors.neonGreen}${(riskMetrics.concentrationRisk || 0).toFixed(1)}%${colors.reset}                              ${colors.neonBlue}║${colors.reset}`)
        console.log(`${colors.neonBlue}╚═══════════════════════════════════════════════════════════════════════╝${colors.reset}`)

        if (diversification.length > 0) {
            console.log(`\n${colors.matrix}${ascii.matrixRain}${colors.reset}`)
            console.log(`${colors.neonGreen}TOP NEURAL HOLDINGS:${colors.reset}`)
            diversification.slice(0, 5).forEach(holding => {
                const symbol = ascii.cryptoSymbols[Math.floor(Math.random() * ascii.cryptoSymbols.length)]
                console.log(`  ${colors.neonBlue}${symbol} ${colors.neonGreen}${holding.symbol}:${colors.reset} ${colors.neonYellow}${formatPercentage(holding.percentage)}${colors.reset} ${colors.gray}(${formatCurrency(holding.value)})${colors.reset}`)
            })
        }

        console.log('')
    }

    static showMainMenu(isRunning) {
        console.log(ascii.holographicMenu)
        console.log(`${colors.neonBlue}
╔═══════════════════════════════════════════════════════════════════════════╗
║                        ⚡ QUANTUM TRADING COMMANDS ⚡                      ║
╚═══════════════════════════════════════════════════════════════════════════╝${colors.reset}`)

        console.log(`${colors.gradient1}╭─────────────────────────────────────────────────────────────────────────╮${colors.reset}`)
        console.log(`${colors.gradient2}│  ${colors.neonGreen}[B]${colors.white}uy Stocks    ${colors.gradient2}│  ${colors.neonGreen}[S]${colors.white}ell Holdings ${colors.gradient2}│  ${colors.neonGreen}[A]${colors.white}dd Player     ${colors.gradient2}│${colors.reset}`)
        console.log(`${colors.gradient3}│  ${colors.neonBlue}[W]${colors.white}itch Player  ${colors.gradient3}│  ${colors.neonBlue}[N]${colors.white}ews Feed     ${colors.gradient3}│  ${colors.neonBlue}[T]${colors.white}ech Analysis  ${colors.gradient3}│${colors.reset}`)
        console.log(`${colors.gradient4}│  ${colors.neonPink}[C]${colors.white}hart View    ${colors.gradient4}│  ${colors.neonPink}[P]${colors.white}ortfolio     ${colors.gradient4}│  ${colors.neonPink}[M]${colors.white}arket Summary ${colors.gradient4}│${colors.reset}`)
        console.log(`${colors.gradient1}│  ${colors.neonYellow}[E]${colors.white}xport Data   ${colors.gradient1}│  ${colors.neonYellow}[L]${colors.white}eaderboard   ${colors.gradient1}│  ${colors.neonYellow}[F]${colors.white}resh News     ${colors.gradient1}│${colors.reset}`)
        console.log(`${colors.gradient2}│  ${colors.neonOrange}[R]${colors.white}un Updates   ${colors.gradient2}│  ${colors.hotPink}[Q]${colors.white}uit & Save   ${colors.gradient2}│                  ${colors.gradient2}│${colors.reset}`)
        console.log(`${colors.gradient2}╰─────────────────────────────────────────────────────────────────────────╯${colors.reset}`)
        
        console.log(`\n${colors.hotPink}${colors.blink}[Q]${colors.reset}${colors.white}uit & Save${colors.reset}`)
        console.log(`\n${colors.hologram}${ascii.glitchText('>>> NEURAL COMMAND INPUT READY')} ${colors.neonGreen}◄${colors.reset} `)
    }

    static getTrendColor(trend) {
        switch (trend) {
            case 'bullish': return colors.green
            case 'bearish': return colors.red
            default: return colors.yellow
        }
    }

    static getRSIColor(rsi) {
        if (!rsi) return colors.dim
        if (rsi > 70) return colors.red
        if (rsi < 30) return colors.green
        return colors.yellow
    }

    static getDiversificationColor(score) {
        switch (score) {
            case 'well_diversified': return colors.green
            case 'moderately_diversified': return colors.yellow
            default: return colors.red
        }
    }

    static clear() {
        clearScreen()
    }
}

module.exports = DisplayService