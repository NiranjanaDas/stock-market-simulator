const fs = require('fs')
const path = require('path')

function clearScreen() {
    process.stdout.write('\x1B[2J\x1B[0f')
}

function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`
}

function formatPercentage(value) {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
}

function padString(str, length, align = 'left') {
    if (align === 'right') {
        return str.padStart(length)
    }
    return str.padEnd(length)
}

function truncateString(str, maxLength) {
    return str.length > maxLength ? str.substring(0, maxLength - 3) + '...' : str
}

function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
    }
}

function readJsonFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'))
        }
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message)
    }
    return null
}

function writeJsonFile(filePath, data) {
    try {
        ensureDirectoryExists(path.dirname(filePath))
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error.message)
    }
}

function calculateSMA(prices, period) {
    if (prices.length < period) return null
    const sum = prices.slice(-period).reduce((a, b) => a + b, 0)
    return sum / period
}

function calculateRSI(prices, period = 14) {
    if (prices.length < period + 1) return null

    const gains = []
    const losses = []

    for (let i = 1; i <= period; i++) {
        const change = prices[i] - prices[i - 1]
        gains.push(Math.max(change, 0))
        losses.push(Math.max(-change, 0))
    }

    let avgGain = gains.reduce((a, b) => a + b, 0) / period
    let avgLoss = losses.reduce((a, b) => a + b, 0) / period

    for (let i = period + 1; i < prices.length; i++) {
        const change = prices[i] - prices[i - 1]
        const gain = Math.max(change, 0)
        const loss = Math.max(-change, 0)

        avgGain = (avgGain * (period - 1) + gain) / period
        avgLoss = (avgLoss * (period - 1) + loss) / period
    }

    if (avgLoss === 0) return 100
    const rs = avgGain / avgLoss
    return 100 - (100 / (1 + rs))
}

module.exports = {
    clearScreen,
    formatCurrency,
    formatPercentage,
    padString,
    truncateString,
    ensureDirectoryExists,
    readJsonFile,
    writeJsonFile,
    calculateSMA,
    calculateRSI
}