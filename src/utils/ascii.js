const colors = require('./colors')

const ascii = {
    logo: `
${colors.neonBlue}╔══════════════════════════════════════════════════════════════════════════╗
║  ${colors.neonGreen}███████╗████████╗ ██████╗  ██████╗██╗  ██╗    ███╗   ███╗ █████╗ ██████╗ ██╗  ██╗${colors.neonBlue}  ║
║  ${colors.neonGreen}██╔════╝╚══██╔══╝██╔═══██╗██╔════╝██║ ██╔╝    ████╗ ████║██╔══██╗██╔══██╗██║ ██╔╝${colors.neonBlue}  ║
║  ${colors.neonGreen}███████╗   ██║   ██║   ██║██║     █████╔╝     ██╔████╔██║███████║██████╔╝█████╔╝${colors.neonBlue}   ║
║  ${colors.neonGreen}╚════██║   ██║   ██║   ██║██║     ██╔═██╗     ██║╚██╔╝██║██╔══██║██╔══██╗██╔═██╗${colors.neonBlue}   ║
║  ${colors.neonGreen}███████║   ██║   ╚██████╔╝╚██████╗██║  ██╗    ██║ ╚═╝ ██║██║  ██║██║  ██║██║  ██╗${colors.neonBlue}  ║
║  ${colors.neonGreen}╚══════╝   ╚═╝    ╚═════╝  ╚═════╝╚═╝  ╚═╝    ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝${colors.neonBlue}  ║
║                                                                              ║
║  ${colors.neonPink}▄▄▄▄▄▄▄ ▄▄▄ ▄▄   ▄▄ ▄▄▄   ▄ ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄ ▄▄▄▄▄▄  ${colors.neonBlue}                 ║
║  ${colors.neonPink}█       █   █  █▄█  █   █ █ █       █       █       █   ▄  █ ${colors.neonBlue}                ║
║  ${colors.neonPink}█  ▄▄▄▄▄█   █       █   █▄█ █   ▄   █▄     ▄█   ▄   █  █ █ █ ${colors.neonBlue}                ║
║  ${colors.neonPink}█ █▄▄▄▄▄█   █       █      ▄█  █ █  █ █   █ █  █▄█  █   █▄▄█▄${colors.neonBlue}                ║
║  ${colors.neonPink}█▄▄▄▄▄  █   █       █     █▄█  █▄█  █ █   █ █       █    ▄▄  █${colors.neonBlue}               ║
║  ${colors.neonPink} ▄▄▄▄▄█ █   █ ██▄██ █    ▄  █       █ █   █ █   ▄   █   █  █ █${colors.neonBlue}               ║
║  ${colors.neonPink}█▄▄▄▄▄▄▄█▄▄▄█▄█   █▄█▄▄▄█ █▄█▄▄▄▄▄▄▄█ █▄▄▄█ █▄▄█ █▄▄█▄▄▄█  █▄█${colors.neonBlue}               ║
╚══════════════════════════════════════════════════════════════════════════╝${colors.reset}
`,

    separator: `${colors.neonBlue}════════════════════════════════════════════════════════════════════════════${colors.reset}`,
    
    holoBorder: `${colors.hologram}┌─────────────────────────────────────────────────────────────────────────┐${colors.reset}`,
    holoBorderEnd: `${colors.hologram}└─────────────────────────────────────────────────────────────────────────┘${colors.reset}`,
    
    glitchBar: `${colors.glitch}▓▓▒▒░░  G L I T C H   M O D E   A C T I V A T E D  ░░▒▒▓▓${colors.reset}`,
    
    tradingFloor: `
${colors.neonYellow}    ╔═══════════════════════════════════════════════════════════════════════╗
    ║  ${colors.neonGreen}⚡ QUANTUM TRADING FLOOR 2035 ⚡${colors.neonYellow}                                   ║
    ║  ${colors.neonBlue}▓▓▓ Neural Network Trading Engine Active ▓▓▓${colors.neonYellow}                      ║
    ╚═══════════════════════════════════════════════════════════════════════╝${colors.reset}
`,

    loadingBar: (percent) => {
        const filled = Math.floor(percent / 5)
        const empty = 20 - filled
        return `${colors.neonBlue}[${colors.neonGreen}${'█'.repeat(filled)}${colors.gray}${'░'.repeat(empty)}${colors.neonBlue}] ${percent}%${colors.reset}`
    },
    
    matrixRain: `${colors.matrix}░▒▓█ INITIALIZING MATRIX PROTOCOL █▓▒░${colors.reset}`,
    
    statusIndicator: (status) => {
        const indicators = {
            online: `${colors.neonGreen}● ONLINE${colors.reset}`,
            offline: `${colors.red}● OFFLINE${colors.reset}`,
            trading: `${colors.neonYellow}⚡ TRADING${colors.reset}`,
            processing: `${colors.neonBlue}◐ PROCESSING${colors.reset}`,
            error: `${colors.hotPink}✗ ERROR${colors.reset}`,
            success: `${colors.neonGreen}✓ SUCCESS${colors.reset}`
        }
        return indicators[status] || status
    },
    
    neuralNetwork: `
${colors.gradient1}    ╭─────────────────────────────────────────────────────────────────╮
${colors.gradient2}    │  🧠 NEURAL MARKET ANALYSIS ENGINE v3.7.2                     │
${colors.gradient3}    │  ▓▓▓ Quantum Processing Active ▓▓▓                           │
${colors.gradient4}    │  🔮 Predictive Analytics: ENABLED                            │
    ╰─────────────────────────────────────────────────────────────────╯${colors.reset}
`,

    holographicMenu: `
${colors.hologram}    ◢◤◢◤◢◤◢◤ HOLOGRAPHIC INTERFACE v2.1 ◢◤◢◤◢◤◢◤
    ▓▓▒▒░░ Gesture Recognition: ACTIVE ░░▒▒▓▓
    ╔══════════════════════════════════════════╗
    ║     🎮 NEURAL COMMAND INTERFACE 🎮      ║
    ╚══════════════════════════════════════════╝${colors.reset}
`,

    cryptoSymbols: ['₿', '₵', '⟠', '⟡', '◈', '◉', '◎', '⬟', '⬢', '⟐'],
    
    priceArrow: (direction) => {
        if (direction > 0) return `${colors.neonGreen}▲${colors.reset}`
        if (direction < 0) return `${colors.hotPink}▼${colors.reset}`
        return `${colors.neonYellow}◆${colors.reset}`
    },
    
    animatedSpinner: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
    
    futuristicBorder: (text) => {
        const line = '─'.repeat(text.length + 4)
        return `${colors.neonBlue}╭${line}╮
${colors.neonBlue}│  ${colors.neonGreen}${text}${colors.neonBlue}  │
${colors.neonBlue}╰${line}╯${colors.reset}`
    },
    
    glitchText: (text) => {
        const glitchChars = ['▓', '▒', '░', '#', '@', '$', '%', '&']
        let result = ''
        for (let i = 0; i < text.length; i++) {
            if (Math.random() < 0.1) {
                result += `${colors.glitch}${glitchChars[Math.floor(Math.random() * glitchChars.length)]}${colors.reset}`
            } else {
                result += text[i]
            }
        }
        return result
    }
}

module.exports = ascii
