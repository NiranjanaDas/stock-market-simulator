const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m',
    clear: '\x1b[2J\x1b[H',
    
    // Neon/Cyberpunk colors
    neonGreen: '\x1b[38;5;46m',
    neonBlue: '\x1b[38;5;51m',
    neonPink: '\x1b[38;5;201m',
    neonPurple: '\x1b[38;5;165m',
    neonOrange: '\x1b[38;5;208m',
    neonYellow: '\x1b[38;5;226m',
    electricBlue: '\x1b[38;5;33m',
    hotPink: '\x1b[38;5;198m',
    matrix: '\x1b[38;5;40m',
    
    // Background colors
    bgDarkGray: '\x1b[48;5;235m',
    bgNeonGreen: '\x1b[48;5;46m',
    bgNeonBlue: '\x1b[48;5;51m',
    
    // Effects
    bold: '\x1b[1m',
    underline: '\x1b[4m',
    blink: '\x1b[5m',
    reverse: '\x1b[7m',
    strikethrough: '\x1b[9m',
    
    // Gradients (simulated with RGB)
    gradient1: '\x1b[38;2;0;255;255m',   
    gradient2: '\x1b[38;2;128;0;255m',   
    gradient3: '\x1b[38;2;255;0;128m',   
    gradient4: '\x1b[38;2;255;128;0m',
    
    // Special effects
    glitch: '\x1b[5m\x1b[38;5;196m',
    hologram: '\x1b[2m\x1b[38;5;51m'
}

module.exports = colors